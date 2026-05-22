"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import ArenaHome from "@/components/ArenaHome";
import RegisterPanel from "@/components/RegisterPanel";
import BattlePanel from "@/components/BattlePanel";
import LeaderboardPanel from "@/components/LeaderboardPanel";
import { AnimatePresence, motion } from "framer-motion";

export default function AppClient() {
  const [activeTab, setActiveTab] = useState("Arena");

  const panels: Record<string, JSX.Element> = {
    Arena: <ArenaHome setActiveTab={setActiveTab} />,
    Register: <RegisterPanel />,
    Battle: <BattlePanel />,
    Leaderboard: <LeaderboardPanel />,
  };

  return (
    <div className="min-h-screen bg-void text-white"
      style={{
        backgroundImage: `
          radial-gradient(ellipse 80% 50% at 50% -10%, #1a0a2e44 0%, transparent 60%),
          repeating-linear-gradient(0deg, transparent, transparent 39px, #0d0d1844 39px, #0d0d1844 40px),
          repeating-linear-gradient(90deg, transparent, transparent 39px, #0d0d1844 39px, #0d0d1844 40px)
        `,
      }}>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="pt-16 min-h-screen px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            {panels[activeTab]}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="border-t border-slate-900 py-6 text-center">
        <p className="font-mono text-xs text-slate-600">
          INITIATES ARENA · Ritual Chain Testnet · Pre-mint community battle dApp
        </p>
      </footer>
    </div>
  );
}
