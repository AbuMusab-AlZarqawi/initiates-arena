// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract InitiatesArena {
    // ─── Faction IDs ───────────────────────────────────────────────
    // 0 = Ritty | 1 = Bitty | 2 = Ritualist | 3 = Radiant Ritualist

    struct Fighter {
        string name;
        uint8 faction;       // 0–3
        uint8 strength;      // 1–100
        uint8 speed;         // 1–100
        uint8 cunning;       // 1–100
        uint32 wins;
        uint32 losses;
        uint32 currentStreak;
        uint32 bestStreak;
        uint256 registeredAt;
        address wallet;
        bool exists;
    }

    mapping(address => Fighter) public fighters;
    address[] public fighterAddresses;

    uint256 public registrationFee = 0.001 ether;
    address public owner;

    event FighterRegistered(address indexed wallet, string name, uint8 faction, uint8 strength, uint8 speed, uint8 cunning);
    event BattleResult(address indexed winner, address indexed loser, uint32 winnerStreak);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // ─── Registration ──────────────────────────────────────────────
    function registerFighter(string calldata _name, uint8 _chosenFaction) external payable {
        require(msg.value >= registrationFee, "Insufficient fee");
        require(!fighters[msg.sender].exists, "Already registered");
        require(_chosenFaction <= 2, "Choose 0, 1, or 2 - contract may upgrade to Radiant");
        require(bytes(_name).length > 0 && bytes(_name).length <= 32, "Name 1-32 chars");

        // Derive traits from blockhash + address
        bytes32 seed = keccak256(abi.encodePacked(blockhash(block.number - 1), msg.sender, block.timestamp));

        uint8 str_ = uint8((uint256(seed) % 100) + 1);
        uint8 spd_ = uint8((uint256(seed >> 8) % 100) + 1);
        uint8 cun_ = uint8((uint256(seed >> 16) % 100) + 1);

        // ~10% chance upgrade to Radiant Ritualist
        uint8 faction = _chosenFaction;
        if (uint256(seed >> 24) % 10 == 0) {
            faction = 3; // Radiant Ritualist
        }

        fighters[msg.sender] = Fighter({
            name: _name,
            faction: faction,
            strength: str_,
            speed: spd_,
            cunning: cun_,
            wins: 0,
            losses: 0,
            currentStreak: 0,
            bestStreak: 0,
            registeredAt: block.timestamp,
            wallet: msg.sender,
            exists: true
        });

        fighterAddresses.push(msg.sender);
        emit FighterRegistered(msg.sender, _name, faction, str_, spd_, cun_);
    }

    // ─── Battle ────────────────────────────────────────────────────
    function battle(address _challengerAddr, address _opponentAddr) external {
        Fighter storage challenger = fighters[_challengerAddr];
        Fighter storage opponent = fighters[_opponentAddr];
        require(challenger.exists, "Challenger not registered");
        require(opponent.exists, "Opponent not registered");
        require(_challengerAddr != _opponentAddr, "Cannot battle yourself");

        bytes32 rand = keccak256(abi.encodePacked(blockhash(block.number - 1), _challengerAddr, _opponentAddr, block.timestamp));

        // Weighted score: strength 40% + speed 30% + cunning 30%
        uint256 cScore = uint256(challenger.strength) * 40 + uint256(challenger.speed) * 30 + uint256(challenger.cunning) * 30;
        uint256 oScore = uint256(opponent.strength) * 40 + uint256(opponent.speed) * 30 + uint256(opponent.cunning) * 30;

        // Add randomness ±500 to each
        uint256 cRand = uint256(rand) % 1001; // 0–1000
        uint256 oRand = uint256(rand >> 128) % 1001;

        cScore += cRand;
        oScore += oRand;

        // Radiant Ritualist bonus +300
        if (challenger.faction == 3) cScore += 300;
        if (opponent.faction == 3) oScore += 300;

        if (cScore >= oScore) {
            _recordWin(challenger, opponent);
            emit BattleResult(_challengerAddr, _opponentAddr, challenger.currentStreak);
        } else {
            _recordWin(opponent, challenger);
            emit BattleResult(_opponentAddr, _challengerAddr, opponent.currentStreak);
        }
    }

    function _recordWin(Fighter storage winner, Fighter storage loser) internal {
        winner.wins++;
        winner.currentStreak++;
        if (winner.currentStreak > winner.bestStreak) {
            winner.bestStreak = winner.currentStreak;
        }
        loser.losses++;
        loser.currentStreak = 0;
    }

    // ─── Batch Read ────────────────────────────────────────────────
    function getFighterCount() external view returns (uint256) {
        return fighterAddresses.length;
    }

    function getFightersBatch(uint256 start, uint256 count) external view returns (Fighter[] memory) {
        uint256 end = start + count;
        if (end > fighterAddresses.length) end = fighterAddresses.length;
        Fighter[] memory batch = new Fighter[](end - start);
        for (uint256 i = start; i < end; i++) {
            batch[i - start] = fighters[fighterAddresses[i]];
        }
        return batch;
    }

    // ─── Admin ─────────────────────────────────────────────────────
    function withdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    function setRegistrationFee(uint256 _fee) external onlyOwner {
        registrationFee = _fee;
    }
}
