"use client";
import { useEffect, useState } from "react";
import { useReadContract, usePublicClient } from "wagmi";
import { motion } from "framer-motion";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/contract";
import { FighterData, getFaction, getRankBadge, shortAddr } from "@/lib/factions";
import GeometricAvatar from "./GeometricAvatar";

export default function LeaderboardPanel() {
  const publicClient = usePublicClient();
  const [fighters, setFighters] = useState<FighterData[]>([]);
  const [loading, setLoading] = useState(true);

  const { data: fighterCount } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getFighterCount",
  });

  useEffect(() => {
    if (!fighterCount || !publicClient) return;
    const count = Number(fighterCount);
    if (count === 0) { setLoading(false); return; }
    (async () => {
      try {
        const batch = await publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: "getFightersBatch",
          args: [0n, BigInt(count)],
        }) as any[];
        const mapped: FighterData[] = batch.map((f: any) => ({
          name: f.name, faction: Number(f.faction),
          strength: Number(f.strength), speed: Number(f.speed), cunning: Number(f.cunning),
          wins: Number(f.wins), losses: Number(f.losses),
          currentStreak: Number(f.currentStreak), bestStreak: Number(f.bestStreak),
          registeredAt: f.registeredAt, wallet: f.wallet, exists: f.exists,
        }));
        // Sort by wins desc, then bestStreak desc
        mapped.sort((a, b) => b.wins - a.wins || b.bestStreak - a.bestStreak);
        setFighters(mapped);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [fighterCount, publicClient]);

  return (
    <div className="max-w-4xl mx-auto py-10">
      <motion.h2
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="font-cinzel text-3xl text-white text-center mb-2 tracking-wide"
      >
        Hall of Champions
      </motion.h2>
      <p className="text-center text-slate-500 font-mono text-sm mb-8">
        {fighters.length} fighters registered · ranked by victories
      </p>

      {loading && (
        <div className="text-center py-20">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="inline-block text-4xl">⚔</motion.div>
          <p className="font-mono text-slate-400 mt-3 text-sm">Loading fighters…</p>
        </div>
      )}

      {!loading && fighters.length === 0 && (
        <div className="text-center py-20">
          <p className="font-cinzel text-xl text-slate-500">No fighters yet — be the first!</p>
        </div>
      )}

      {!loading && fighters.length > 0 && (
        <div className="space-y-2">
          {/* Header row */}
          <div className="grid items-center px-4 py-2 font-mono text-xs text-slate-500 tracking-wider"
            style={{ gridTemplateColumns: "2.5rem 2.5rem 1fr 5rem 4rem 4rem 4rem 5rem" }}>
            <span>#</span>
            <span></span>
            <span>FIGHTER</span>
            <span>FACTION</span>
            <span className="text-center">W</span>
            <span className="text-center">L</span>
            <span className="text-center">STK</span>
            <span className="text-right">RANK</span>
          </div>

          {fighters.map((fighter, i) => {
            const faction = getFaction(fighter.faction);
            const rank = getRankBadge(fighter.wins);
            const isTop3 = i < 3;
            const medals = ["🥇", "🥈", "🥉"];

            return (
              <motion.div
                key={fighter.wallet}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="grid items-center px-4 py-3 rounded-lg border transition-all duration-200 hover:brightness-110"
                style={{
                  gridTemplateColumns: "2.5rem 2.5rem 1fr 5rem 4rem 4rem 4rem 5rem",
                  borderColor: isTop3 ? faction.color : "#1e1e32",
                  background: isTop3
                    ? `linear-gradient(135deg, ${faction.muted}22, #0d0d18)`
                    : "#0d0d18",
                  boxShadow: isTop3 ? `0 0 12px ${faction.color}33` : "none",
                }}
              >
                {/* Rank number */}
                <span className="font-mono text-sm font-bold"
                  style={{ color: isTop3 ? faction.color : "#4a4a6a" }}>
                  {isTop3 ? medals[i] : `${i + 1}`}
                </span>

                {/* Avatar */}
                <div className="rounded overflow-hidden w-8 h-8">
                  <GeometricAvatar address={fighter.wallet} size={32} />
                </div>

                {/* Name + address */}
                <div className="min-w-0 pr-2">
                  <div className="font-cinzel text-sm text-white truncate font-semibold">{fighter.name}</div>
                  <div className="font-mono text-xs truncate" style={{ color: faction.color }}>
                    {shortAddr(fighter.wallet)}
                  </div>
                </div>

                {/* Faction badge */}
                <div className="truncate">
                  <span className="text-xs px-2 py-0.5 rounded-full whitespace-nowrap"
                    style={{ background: faction.color, color: fighter.faction === 3 ? "#000" : "#fff", fontSize: "0.65rem" }}>
                    {faction.emoji} {faction.name}
                  </span>
                </div>

                {/* Wins */}
                <span className="font-mono text-sm text-green-400 text-center font-bold">{fighter.wins}</span>

                {/* Losses */}
                <span className="font-mono text-sm text-red-400 text-center">{fighter.losses}</span>

                {/* Best streak */}
                <span className="font-mono text-sm text-yellow-300 text-center">
                  {fighter.bestStreak > 0 ? `🔥${fighter.bestStreak}` : "—"}
                </span>

                {/* Rank badge */}
                <div className="text-right">
                  <span className="font-mono text-xs font-bold"
                    style={{ color: rank.color, textShadow: rank.glow }}>
                    {rank.label}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
