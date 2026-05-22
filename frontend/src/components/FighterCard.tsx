"use client";
import { motion } from "framer-motion";
import { FighterData, getFaction, getRankBadge, shortAddr } from "@/lib/factions";
import GeometricAvatar from "./GeometricAvatar";

interface Props {
  fighter: FighterData;
  animateFrom?: "left" | "right" | "none";
  highlight?: boolean;
  onClick?: () => void;
  compact?: boolean;
}

export default function FighterCard({ fighter, animateFrom = "none", highlight, onClick, compact }: Props) {
  const faction = getFaction(fighter.faction);
  const rank = getRankBadge(fighter.wins);
  const totalBattles = fighter.wins + fighter.losses;
  const winRate = totalBattles > 0 ? Math.round((fighter.wins / totalBattles) * 100) : 0;

  const variants = {
    hidden: { x: animateFrom === "left" ? -200 : animateFrom === "right" ? 200 : 0, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 20 } },
  };

  return (
    <motion.div
      variants={animateFrom !== "none" ? variants : undefined}
      initial={animateFrom !== "none" ? "hidden" : undefined}
      animate={animateFrom !== "none" ? "visible" : undefined}
      whileHover={onClick ? { scale: 1.02 } : undefined}
      onClick={onClick}
      className={`relative rounded-lg border overflow-hidden cursor-${onClick ? "pointer" : "default"} transition-all duration-300 ${
        highlight ? "ring-2 ring-offset-1 ring-offset-obsidian" : ""
      }`}
      style={{
        borderColor: faction.color,
        boxShadow: highlight ? `0 0 30px ${faction.color}55` : `0 0 10px ${faction.color}22`,
        background: `linear-gradient(135deg, #0a0a0f 60%, ${faction.muted}33)`,
      }}
    >
      {/* Top faction stripe */}
      <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${faction.color}, ${faction.light})` }} />

      <div className={`p-${compact ? "3" : "4"}`}>
        <div className="flex gap-3 items-start">
          {/* Avatar */}
          <div className="flex-shrink-0 rounded overflow-hidden"
            style={{ boxShadow: `0 0 12px ${faction.color}66` }}>
            <GeometricAvatar address={fighter.wallet} size={compact ? 56 : 72} />
          </div>

          <div className="flex-1 min-w-0">
            {/* Name + faction */}
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-cinzel font-bold text-white truncate" style={{ fontSize: compact ? "0.85rem" : "1rem" }}>
                {fighter.name}
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold whitespace-nowrap"
                style={{ background: faction.color, color: fighter.faction === 3 ? "#000" : "#fff" }}>
                {faction.emoji} {faction.name}
              </span>
            </div>

            {/* Address */}
            <p className="font-mono text-xs mt-0.5" style={{ color: faction.color }}>
              {shortAddr(fighter.wallet)}
            </p>

            {!compact && (
              <>
                {/* Trait bars */}
                <div className="mt-3 space-y-1.5">
                  {[
                    { label: "STR", value: fighter.strength },
                    { label: "SPD", value: fighter.speed },
                    { label: "CUN", value: fighter.cunning },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center gap-2">
                      <span className="font-mono text-xs w-7" style={{ color: faction.light }}>{label}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: `linear-gradient(90deg, ${faction.color}, ${faction.light})` }}
                          initial={{ width: 0 }}
                          animate={{ width: `${value}%` }}
                          transition={{ duration: 1, delay: 0.3 }}
                        />
                      </div>
                      <span className="font-mono text-xs w-6 text-right text-slate-300">{value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* W/L + streak */}
            <div className="flex gap-3 mt-2 flex-wrap">
              <span className="font-mono text-xs text-green-400">{fighter.wins}W</span>
              <span className="font-mono text-xs text-red-400">{fighter.losses}L</span>
              {totalBattles > 0 && <span className="font-mono text-xs text-slate-400">{winRate}%</span>}
              {fighter.currentStreak > 1 && (
                <span className="font-mono text-xs text-yellow-300">🔥{fighter.currentStreak}</span>
              )}
              <span className="text-xs px-1.5 rounded font-semibold"
                style={{ color: rank.color, textShadow: rank.glow }}>
                {rank.label}
              </span>
            </div>
          </div>
        </div>

        {compact && (
          <div className="mt-2 flex gap-2">
            {[
              { label: "STR", value: fighter.strength },
              { label: "SPD", value: fighter.speed },
              { label: "CUN", value: fighter.cunning },
            ].map(({ label, value }) => (
              <div key={label} className="flex-1">
                <div className="font-mono text-xs text-center mb-0.5" style={{ color: faction.light }}>{label}</div>
                <div className="h-1 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${value}%`, background: faction.color }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
