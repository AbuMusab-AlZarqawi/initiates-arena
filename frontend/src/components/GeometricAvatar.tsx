"use client";
import { avatarColors } from "@/lib/factions";

interface Props {
  address: string;
  size?: number;
}

export default function GeometricAvatar({ address, size = 80 }: Props) {
  const colors = avatarColors(address);
  const seed = parseInt(address.slice(2, 10), 16);
  
  // Generate deterministic geometric shapes
  const shapes = Array.from({ length: 6 }, (_, i) => {
    const s = (seed >> (i * 4)) & 0xf;
    const x = (s % 4) * 20 + 5;
    const y = Math.floor(s / 4) * 20 + 5;
    const type = i % 3;
    const color = colors[i % colors.length];
    const opacity = 0.7 + (i % 3) * 0.1;
    return { x, y, type, color, opacity, s };
  });

  return (
    <svg width={size} height={size} viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="80" fill="#0a0a0f" rx="4" />
      {/* Background grid */}
      {[0,1,2,3].map(i => (
        <line key={`h${i}`} x1="0" y1={i*20+10} x2="80" y2={i*20+10} stroke="#1a1a2e" strokeWidth="0.5"/>
      ))}
      {[0,1,2,3].map(i => (
        <line key={`v${i}`} x1={i*20+10} y1="0" x2={i*20+10} y2="80" stroke="#1a1a2e" strokeWidth="0.5"/>
      ))}
      {shapes.map((sh, i) => {
        if (sh.type === 0) return (
          <rect key={i} x={sh.x} y={sh.y} width={12 + (sh.s % 8)} height={12 + (sh.s % 8)}
            fill={sh.color} opacity={sh.opacity} rx="1"
            transform={`rotate(${(sh.s * 15) % 45} ${sh.x + 8} ${sh.y + 8})`} />
        );
        if (sh.type === 1) return (
          <circle key={i} cx={sh.x + 8} cy={sh.y + 8} r={6 + (sh.s % 6)}
            fill={sh.color} opacity={sh.opacity} />
        );
        const pts = `${sh.x+8},${sh.y} ${sh.x+16},${sh.y+16} ${sh.x},${sh.y+16}`;
        return <polygon key={i} points={pts} fill={sh.color} opacity={sh.opacity} />;
      })}
      {/* Center glyph */}
      <text x="40" y="44" textAnchor="middle" fontSize="14" fill="white" opacity="0.9" fontFamily="serif">
        {address.slice(2, 3).toUpperCase()}
      </text>
    </svg>
  );
}
