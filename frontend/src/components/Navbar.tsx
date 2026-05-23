"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import ConnectButton from "./ConnectButton";

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Navbar({ activeTab, setActiveTab }: Props) {
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio("/initiates/soundtrack.mp3");
    audio.loop = true;
    audio.volume = 0.18;
    audioRef.current = audio;
    return () => { audio.pause(); audio.src = ""; };
  }, []);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (!started) {
      audioRef.current.play().then(() => { setPlaying(true); setStarted(true); }).catch(() => {});
    } else if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setPlaying(true);
    }
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
            INITIATES<span style={{ color: "#9b59b6" }}> ARENA</span>
          </span>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 flex-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded text-xs font-mono tracking-wider whitespace-nowrap transition-all duration-200 ${
                activeTab === tab ? "text-white" : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
              style={activeTab === tab ? { background: "#7d3c98", boxShadow: "0 0 12px #7d3c98" } : {}}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Audio + Connect */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={toggleAudio}
            className="w-8 h-8 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={!started ? "Play music" : playing ? "Pause" : "Play"}
          >
            {!started ? "🎵" : playing ? "🔊" : "🔇"}
          </button>
          <ConnectButton />
        </div>
      </div>
    </nav>
  );
}
