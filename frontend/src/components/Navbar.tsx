"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Navbar({ activeTab, setActiveTab }: Props) {
  const [muted, setMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio("/initiates/soundtrack.mp3");
    audio.loop = true;
    audio.volume = 0.18;
    audio.muted = true;
    audioRef.current = audio;
    audio.play().catch(() => {});
    return () => { audio.pause(); audio.src = ""; };
  }, []);

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !muted;
    setMuted(!muted);
  };

  const tabs = ["Arena", "Register", "Battle", "Leaderboard"];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800"
      style={{ background: "rgba(6,6,10,0.92)", backdropFilter: "blur(16px)" }}>
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="relative w-9 h-9 rounded overflow-hidden border border-slate-700">
            <Image src="/initiates/symbol.jpg" alt="Initiates" fill style={{ objectFit: "cover" }} />
          </div>
          <span className="font-cinzel font-bold text-white text-sm hidden sm:block tracking-wider">
            INITIATES<span className="text-ritualist-light"> ARENA</span>
          </span>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 flex-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded text-xs font-mono tracking-wider whitespace-nowrap transition-all duration-200 ${
                activeTab === tab
                  ? "bg-ritualist text-white shadow-[0_0_12px_#7d3c98]"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Mute + Connect */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={toggleMute}
            className="w-8 h-8 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={muted ? "Unmute music" : "Mute music"}
          >
            {muted ? "🔇" : "🔊"}
          </button>
          <ConnectButton
            chainStatus="none"
            showBalance={false}
            accountStatus="avatar"
          />
        </div>
      </div>
    </nav>
  );
}
