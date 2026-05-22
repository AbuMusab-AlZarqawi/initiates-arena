import type { Metadata } from "next";
import { Cinzel, Space_Mono, DM_Sans } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel", weight: ["400", "700", "900"] });
const spaceMono = Space_Mono({ subsets: ["latin"], variable: "--font-mono", weight: ["400", "700"] });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Initiates Arena",
  description: "Pre-mint community hype builder for the Initiates NFT project on Ritual Chain Testnet",
  icons: { icon: "/initiates/symbol.jpg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cinzel.variable} ${spaceMono.variable} ${dmSans.variable}`}>
      <body className="bg-void text-white antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
