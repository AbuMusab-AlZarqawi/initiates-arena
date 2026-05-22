export type FactionId = 0 | 1 | 2 | 3;

export interface FighterData {
  name: string;
  faction: number;
  strength: number;
  speed: number;
  cunning: number;
  wins: number;
  losses: number;
  currentStreak: number;
  bestStreak: number;
  registeredAt: bigint;
  wallet: `0x${string}`;
  exists: boolean;
}

export const FACTIONS = {
  0: {
    name: "Ritty",
    color: "#c0392b",
    light: "#e74c3c",
    muted: "#7b241c",
    badge: "bg-ritty text-white",
    glow: "shadow-[0_0_20px_#c0392b]",
    border: "border-ritty",
    desc: "Scrappy underdog, street fighter",
    emoji: "🔥",
  },
  1: {
    name: "Bitty",
    color: "#27ae60",
    light: "#2ecc71",
    muted: "#1a6b3c",
    badge: "bg-bitty text-white",
    glow: "shadow-[0_0_20px_#27ae60]",
    border: "border-bitty",
    desc: "Cunning, trickster, nature magic",
    emoji: "🌿",
  },
  2: {
    name: "Ritualist",
    color: "#7d3c98",
    light: "#9b59b6",
    muted: "#4a235a",
    badge: "bg-ritualist text-white",
    glow: "shadow-[0_0_20px_#7d3c98]",
    border: "border-ritualist",
    desc: "Arcane, scholarly, mysterious",
    emoji: "✦",
  },
  3: {
    name: "Radiant Ritualist",
    color: "#f39c12",
    light: "#f1c40f",
    muted: "#9a6007",
    badge: "bg-radiant text-black",
    glow: "shadow-[0_0_30px_#f39c12,0_0_60px_#f1c40f]",
    border: "border-radiant",
    desc: "Legendary, divine, rare ✦ ~10% chance",
    emoji: "👑",
  },
} as const;

export function getFaction(id: number) {
  return FACTIONS[id as FactionId] ?? FACTIONS[0];
}

export function getRankBadge(wins: number): { label: string; color: string; glow: string } {
  if (wins >= 20) return { label: "Obsidian", color: "#c0c0c0", glow: "0 0 20px #c0c0c0" };
  if (wins >= 10) return { label: "Gold", color: "#f1c40f", glow: "0 0 20px #f1c40f" };
  if (wins >= 5) return { label: "Silver", color: "#bdc3c7", glow: "0 0 15px #bdc3c7" };
  return { label: "Bronze", color: "#cd7f32", glow: "0 0 10px #cd7f32" };
}

/** Deterministic avatar color from wallet address */
export function avatarColors(address: string): string[] {
  const palette = ["#c0392b", "#27ae60", "#7d3c98", "#f39c12", "#2980b9", "#16a085", "#8e44ad", "#d35400"];
  const seed = parseInt(address.slice(2, 10), 16);
  return [
    palette[seed % palette.length],
    palette[(seed >> 4) % palette.length],
    palette[(seed >> 8) % palette.length],
  ];
}

export function shortAddr(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}
