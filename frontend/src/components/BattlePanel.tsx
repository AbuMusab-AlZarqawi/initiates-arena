"use client";
import { useState, useEffect } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract, usePublicClient } from "wagmi";
import { motion, AnimatePresence } from "framer-motion";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/contract";
import { FighterData, getFaction } from "@/lib/factions";
import FighterCard from "./FighterCard";

export default function BattlePanel() {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();

  const [allFighters, setAllFighters] = useState<FighterData[]>([]);
  const [selectedOpponent, setSelectedOpponent] = useState<FighterData | null>(null);
  const [battlePhase, setBattlePhase] = useState<"idle" | "fighting" | "result">("idle");
  const [winner, setWinner] = useState<FighterData | null>(null);
  const [shaking, setShaking] = useState(false);

  const { data: myFighterRaw } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "fighters",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { data: fighterCount } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getFighterCount",
  });

  useEffect(() => {
    if (!fighterCount || !publicClient) return;
    const count = Number(fighterCount);
    if (count === 0) return;
    (async () => {
      try {
        const batch = await publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: "getFightersBatch",
          args: [0n, BigInt(count)],
        }) as any[];
        setAllFighters(batch.map((f: any) => ({
          name: f.name, faction: f.faction, strength: f.strength, speed: f.speed, cunning: f.cunning,
          wins: f.wins, losses: f.losses, currentStreak: f.currentStreak, bestStreak: f.bestStreak,
          registeredAt: f.registeredAt, wallet: f.wallet, exists: f.exists,
        })));
      } catch {}
    })();
  }, [fighterCount, publicClient]);

  const { data: hash, writeContract, isPending } = useWriteContract();
  const { isLoading: isMining, isSuccess } = useWaitForTransactionReceipt({ hash });

  const myFighter = myFighterRaw && (myFighterRaw as any)[11]
    ? {
        name: (myFighterRaw as any)[0],
        faction: (myFighterRaw as any)[1],
        strength: (myFighterRaw as any)[2],
        speed: (myFighterRaw as any)[3],
        cunning: (myFighterRaw as any)[4],
        wins: (myFighterRaw as any)[5],
        losses: (myFighterRaw as any)[6],
        currentStreak: (myFighterRaw as any)[7],
        bestStreak: (myFighterRaw as any)[8],
        registeredAt: (myFighterRaw as any)[9],
        wallet: address!,
        exists: true,
      } as FighterData
    : null;

  const opponents = allFighters.filter(f => f.wallet.toLowerCase() !== address?.toLowerCase());

  useEffect(() => {
    if (isSuccess && battlePhase === "fighting") {
      setShaking(true);
      setTimeout(() => setShaking(false), 600);
      setTimeout(() => {
        // Determine winner by score (same logic as contract for display)
        if (myFighter && selectedOpponent) {
          const myScore = myFighter.strength * 40 + myFighter.speed * 30 + myFighter.cunning * 30;
          const oppScore = selectedOpponent.strength * 40 + selectedOpponent.speed * 30 + selectedOpponent.cunning * 30;
          setWinner(myScore >= oppScore ? myFighter : selectedOpponent);
        }
        setBattlePhase("result");
      }, 800);
    }
  }, [isSuccess]);

  const handleBattle = () => {
    if (!myFighter || !selectedOpponent || !address) return;
    setBattlePhase("fighting");
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "battle",
      args: [address, selectedOpponent.wallet],
    });
  };

  if (!isConnected) return (
    <div className="text-center py-24">
      <p className="font-cinzel text-2xl text-slate-400">Connect your wallet to battle</p>
    </div>
  );

  if (!myFighter) return (
    <div className="text-center py-24">
      <p className="font-cinzel text-xl text-slate-400">Register a Fighter first</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto py-10">
      <motion.h2
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="font-cinzel text-3xl text-white text-center mb-8 tracking-wide"
      >
        Battle Arena
      </motion.h2>

      {/* Battle stage */}
      <AnimatePresence mode="wait">
        {battlePhase !== "idle" && selectedOpponent && (
          <motion.div
            key="battle-stage"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className={`mb-8 rounded-2xl border border-slate-700 p-6 ${shaking ? "animate-shake" : ""}`}
            style={{ background: "linear-gradient(135deg, #0d0d18, #12121e)" }}
          >
            <div className="grid grid-cols-2 gap-6 items-center">
              <div>
                <FighterCard fighter={myFighter} animateFrom="left" />
              </div>
              <div className="relative">
                <FighterCard fighter={selectedOpponent} animateFrom="right" />
              </div>
            </div>

            {/* VS / status */}
            <div className="text-center mt-6">
              {battlePhase === "fighting" && (
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6 }}>
                  <p className="font-cinzel text-4xl text-white">⚔ FIGHTING ⚔</p>
                  <p className="font-mono text-sm text-slate-400 mt-1">
                    {isPending ? "Confirm in wallet…" : "On-chain resolution…"}
                  </p>
                </motion.div>
              )}

              {battlePhase === "result" && winner && (
                <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 150 }}>
                  <div className="text-5xl mb-2">{winner.wallet === address ? "🏆" : "💀"}</div>
                  <p className="font-cinzel text-3xl text-white mb-1">
                    {winner.wallet === address ? "VICTORY!" : "DEFEATED!"}
                  </p>
                  <p className="font-mono text-slate-400 text-sm">
                    {winner.name} wins the battle!
                    {` (results update on next page refresh)`}
                  </p>
                  <button onClick={() => { setBattlePhase("idle"); setWinner(null); }}
                    className="mt-4 px-6 py-2 rounded-lg bg-slate-800 text-white font-mono text-sm hover:bg-slate-700 transition-colors">
                    Battle Again
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {battlePhase === "idle" && (
        <>
          <div className="mb-6">
            <h3 className="font-cinzel text-lg text-white mb-1">Your Fighter</h3>
            <FighterCard fighter={myFighter} animateFrom="none" />
          </div>

          {/* Opponent picker */}
          <div>
            <h3 className="font-cinzel text-lg text-white mb-3">
              Choose an Opponent — {opponents.length} fighters registered
            </h3>
            {opponents.length === 0 ? (
              <p className="text-slate-500 font-mono text-sm">No other fighters yet. Be the first to register!</p>
            ) : (
              <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-h-96 overflow-y-auto pr-1">
                {opponents.map((opp) => (
                  <FighterCard
                    key={opp.wallet}
                    fighter={opp}
                    compact
                    highlight={selectedOpponent?.wallet === opp.wallet}
                    onClick={() => setSelectedOpponent(opp)}
                  />
                ))}
              </div>
            )}
          </div>

          {selectedOpponent && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 text-center">
              <p className="font-mono text-sm text-slate-400 mb-3">
                Challenging: <span className="text-white">{selectedOpponent.name}</span>
              </p>
              <button
                onClick={handleBattle}
                disabled={isPending || isMining}
                className="px-10 py-4 rounded-xl font-cinzel font-bold text-xl text-white tracking-wider transition-all duration-200 disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, #c0392b, #e74c3c)",
                  boxShadow: "0 0 30px #c0392b66",
                }}
              >
                ⚔ FIGHT!
              </button>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
