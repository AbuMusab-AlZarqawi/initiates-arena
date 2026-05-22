import { defineChain } from "viem";

export const ritualChain = defineChain({
  id: 1979,
  name: "Ritual Chain Testnet",
  nativeCurrency: { name: "RITUAL", symbol: "RITUAL", decimals: 18 },
  rpcUrls: { default: { http: ["https://rpc.ritualfoundation.org"] } },
  blockExplorers: { default: { name: "Explorer", url: "https://explorer.ritualfoundation.org" } },
  testnet: true,
});

export const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? "0x0000000000000000000000000000000000000000") as `0x${string}`;

export const CONTRACT_ABI = [
  {
    "inputs": [{ "internalType": "string", "name": "_name", "type": "string" }, { "internalType": "uint8", "name": "_chosenFaction", "type": "uint8" }],
    "name": "registerFighter",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "_challengerAddr", "type": "address" }, { "internalType": "address", "name": "_opponentAddr", "type": "address" }],
    "name": "battle",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "fighters",
    "outputs": [
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "uint8", "name": "faction", "type": "uint8" },
      { "internalType": "uint8", "name": "strength", "type": "uint8" },
      { "internalType": "uint8", "name": "speed", "type": "uint8" },
      { "internalType": "uint8", "name": "cunning", "type": "uint8" },
      { "internalType": "uint32", "name": "wins", "type": "uint32" },
      { "internalType": "uint32", "name": "losses", "type": "uint32" },
      { "internalType": "uint32", "name": "currentStreak", "type": "uint32" },
      { "internalType": "uint32", "name": "bestStreak", "type": "uint32" },
      { "internalType": "uint256", "name": "registeredAt", "type": "uint256" },
      { "internalType": "address", "name": "wallet", "type": "address" },
      { "internalType": "bool", "name": "exists", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getFighterCount",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "start", "type": "uint256" }, { "internalType": "uint256", "name": "count", "type": "uint256" }],
    "name": "getFightersBatch",
    "outputs": [
      {
        "components": [
          { "internalType": "string", "name": "name", "type": "string" },
          { "internalType": "uint8", "name": "faction", "type": "uint8" },
          { "internalType": "uint8", "name": "strength", "type": "uint8" },
          { "internalType": "uint8", "name": "speed", "type": "uint8" },
          { "internalType": "uint8", "name": "cunning", "type": "uint8" },
          { "internalType": "uint32", "name": "wins", "type": "uint32" },
          { "internalType": "uint32", "name": "losses", "type": "uint32" },
          { "internalType": "uint32", "name": "currentStreak", "type": "uint32" },
          { "internalType": "uint32", "name": "bestStreak", "type": "uint32" },
          { "internalType": "uint256", "name": "registeredAt", "type": "uint256" },
          { "internalType": "address", "name": "wallet", "type": "address" },
          { "internalType": "bool", "name": "exists", "type": "bool" }
        ],
        "internalType": "struct InitiatesArena.Fighter[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "registrationFee",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "wallet", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "name", "type": "string" },
      { "indexed": false, "internalType": "uint8", "name": "faction", "type": "uint8" },
      { "indexed": false, "internalType": "uint8", "name": "strength", "type": "uint8" },
      { "indexed": false, "internalType": "uint8", "name": "speed", "type": "uint8" },
      { "indexed": false, "internalType": "uint8", "name": "cunning", "type": "uint8" }
    ],
    "name": "FighterRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "winner", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "loser", "type": "address" },
      { "indexed": false, "internalType": "uint8", "name": "winnerStreak", "type": "uint8" }
    ],
    "name": "BattleResult",
    "type": "event"
  }
] as const;
