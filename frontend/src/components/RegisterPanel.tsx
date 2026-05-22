"use client";
import { useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { parseEther } from "viem";
import { motion, AnimatePresence } from "framer-motion";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/contract";
import { FACTIONS, FighterData } from "@/lib/factions";
import FighterCard from "./FighterCard";

export default function RegisterPanel() {
  const { address, isConnected } = useAccount();
  const [name, setName] = useState("");
  const [chosenFaction, setChosenFaction] = useState<0 | 1 | 2>(0);
  const [error, setError] = useState("");

  const { data: existingFighter } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "fighters",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { data: hash, writeContract, isPending } = useWriteContract();
  const { isLoading: isMining, isSuccess } = useWaitForTransactionReceipt({ hash });

  const isRegistered = existingFighter && (existingFighter as any)[11] === true;

  const handleRegister = async () => {
    setError("");
    if (!name.trim()) { setError("Enter a fighter name"); return; }
    if (name.length > 32) { setError("Name must be 32 chars or less"); return; }
    try {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "registerFighter",
        args: [name.trim(), chosenFaction],
        value: parseEther("0.001"),
      });
    } catch (e: any) {
      setError(e.message ?? "Transaction failed");
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center py-24">
        <p className="font-cinzel text-2xl text-slate-400">Connect your wallet to enter the Arena</p>
      </div>
    );
  }

  if (isRegistered && existingFighter) {
    const f = existingFighter as any;
    const fighter: FighterData = {
      name: f[0], faction: f[1], strength: f[2], speed: f[3], cunning: f[4],
      wins: f[5], losses: f[6], currentStreak: f[7], bestStreak: f[8],
      registeredAt: f[9], wallet: address!, exists: true,
    };
    return (
      <div className="max-w-md mx-auto py-12">
        <h2 className="font-cinzel text-2xl text-white text-center mb-6">Your Fighter</h2>
        <FighterCard fighter={fighter} animateFrom="none" />
        <p className="text-center text-slate-500 text-sm mt-4 font-mono">Already registered — head to Battle!</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto py-10">
      <motion.h2
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="font-cinzel text-3xl text-white text-center mb-2 tracking-wide"
      >
        Register Your Fighter
      </motion.h2>
      <p className="text-center text-slate-400 text-sm font-mono mb-8">0.001 RITUAL · Traits assigned by the chain</p>

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-slate-900 border border-slate-700 rounded-xl p-6 space-y-6"
      >
        {/* Name input */}
        <div>
          <label className="block font-mono text-xs text-slate-400 mb-2 tracking-wider">FIGHTER NAME</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={32}
            placeholder="e.g. Shadow Vex"
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white font-cinzel placeholder-slate-600 focus:outline-none focus:border-ritualist transition-colors"
          />
          <p className="text-right text-xs text-slate-600 mt-1 font-mono">{name.length}/32</p>
        </div>

        {/* Faction picker */}
        <div>
          <label className="block font-mono text-xs text-slate-400 mb-3 tracking-wider">
            CHOOSE FACTION <span className="text-radiant ml-1">— or get upgraded to Radiant (~10%)</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {([0, 1, 2] as const).map((id) => {
              const f = FACTIONS[id];
              const selected = chosenFaction === id;
              return (
                <button
                  key={id}
                  onClick={() => setChosenFaction(id)}
                  className="relative rounded-lg p-3 border-2 transition-all duration-200 text-left"
                  style={{
                    borderColor: selected ? f.color : "#2a2a3e",
                    background: selected ? `${f.muted}44` : "transparent",
                    boxShadow: selected ? `0 0 16px ${f.color}55` : "none",
                  }}
                >
                  <div className="text-lg mb-1">{f.emoji}</div>
                  <div className="font-cinzel text-xs text-white font-bold">{f.name}</div>
                  <div className="text-xs mt-1" style={{ color: f.color, fontSize: "0.65rem" }}>{f.desc}</div>
                </button>
              );
            })}
          </div>
          <div className="mt-2 rounded-lg p-3 border border-dashed border-radiant/40 bg-radiant/5">
            <div className="flex items-center gap-2">
              <span className="text-lg">👑</span>
              <div>
                <div className="font-cinzel text-xs text-radiant font-bold">Radiant Ritualist</div>
                <div className="text-xs text-slate-500">{FACTIONS[3].desc}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-red-400 text-sm font-mono bg-red-950/30 rounded p-3">
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Submit */}
        <button
          onClick={handleRegister}
          disabled={isPending || isMining}
          className="w-full py-3.5 rounded-lg font-cinzel font-bold text-white tracking-wider transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: "linear-gradient(135deg, #7d3c98, #9b59b6)",
            boxShadow: "0 0 20px #7d3c9866",
          }}
        >
          {isPending ? "Confirm in Wallet…" : isMining ? "Entering the Arena…" : isSuccess ? "✦ Fighter Registered!" : "⚔ Enter the Arena — 0.001 RITUAL"}
        </button>
      </motion.div>
    </div>
  );
}
