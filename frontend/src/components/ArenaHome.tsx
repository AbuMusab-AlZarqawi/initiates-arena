"use client";
import { motion } from "framer-motion";
import { FACTIONS } from "@/lib/factions";

interface Props {
  setActiveTab: (tab: string) => void;
}

const FACTION_LIST = [
  { ...FACTIONS[0], id: 0 },
  { ...FACTIONS[1], id: 1 },
  { ...FACTIONS[2], id: 2 },
  { ...FACTIONS[3], id: 3 },
];

export default function ArenaHome({ setActiveTab }: Props) {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <div className="inline-block mb-4">
          <span className="font-mono text-xs tracking-[0.4em] text-ritualist-light uppercase px-4 py-1.5 rounded-full border border-ritualist/40 bg-ritualist/10">
            Ritual Chain Testnet · Pre-Mint Hype Builder
          </span>
        </div>

        <h1 className="font-cinzel text-5xl sm:text-7xl font-bold text-white mb-4 leading-tight">
          INITIATES<br />
          <span style={{ background: "linear-gradient(90deg, #7d3c98, #f39c12)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            ARENA
          </span>
        </h1>

        <p className="text-slate-400 text-lg max-w-xl mx-auto font-sans leading-relaxed mb-8">
          Register your Fighter. Choose your Faction. Battle for glory on the leaderboard.
          The Initiates NFTs have not yet been minted — but the Arena is open.
        </p>

        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={() => setActiveTab("Register")}
            className="px-8 py-3 rounded-xl font-cinzel font-bold text-white tracking-wider transition-all duration-200 hover:scale-105"
            style={{ background: "linear-gradient(135deg, #7d3c98, #9b59b6)", boxShadow: "0 0 24px #7d3c9866" }}
          >
            ⚔ Register Fighter
          </button>
          <button
            onClick={() => setActiveTab("Leaderboard")}
            className="px-8 py-3 rounded-xl font-cinzel font-bold tracking-wider border border-slate-600 text-slate-300 hover:border-slate-400 hover:text-white transition-all duration-200"
          >
            🏆 View Leaderboard
          </button>
        </div>
      </motion.div>

      {/* How it works */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="mb-16"
      >
        <h2 className="font-cinzel text-xl text-center text-slate-300 mb-6 tracking-wider">HOW IT WORKS</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { step: "01", title: "Register", desc: "Pay 0.001 RITUAL. Choose a Faction. Get onchain traits.", icon: "🗡" },
            { step: "02", title: "Battle", desc: "Challenge any fighter. The chain decides who wins.", icon: "⚔" },
            { step: "03", title: "Ascend", desc: "Climb the leaderboard. Earn rank badges. Become legend.", icon: "👑" },
          ].map(({ step, title, desc, icon }) => (
            <div key={step} className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 text-center">
              <div className="text-3xl mb-3">{icon}</div>
              <div className="font-mono text-xs text-slate-600 mb-1">{step}</div>
              <div className="font-cinzel text-lg text-white mb-2">{title}</div>
              <div className="text-slate-400 text-sm">{desc}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Factions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
      >
        <h2 className="font-cinzel text-xl text-center text-slate-300 mb-6 tracking-wider">THE FOUR FACTIONS</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {FACTION_LIST.map((f) => (
            <div
              key={f.id}
              className="rounded-xl border p-4 text-center transition-all duration-300 hover:scale-105"
              style={{
                borderColor: `${f.color}55`,
                background: `linear-gradient(135deg, ${f.muted}22, #0a0a0f)`,
                boxShadow: `0 0 12px ${f.color}22`,
              }}
            >
              <div className="text-2xl mb-2">{f.emoji}</div>
              <div className="font-cinzel text-sm font-bold mb-1" style={{ color: f.light }}>{f.name}</div>
              <div className="text-xs text-slate-500 leading-snug">{f.desc}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
