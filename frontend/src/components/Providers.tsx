"use client";
import { ReactNode } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { metaMask, injected, coinbaseWallet } from "wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ritualChain } from "@/lib/contract";

const config = createConfig({
  chains: [ritualChain],
  connectors: [
    metaMask(),
    injected({ target: "metaMask" }),
    coinbaseWallet({ appName: "Initiates Arena" }),
    injected(),
  ],
  transports: { [ritualChain.id]: http() },
});

const queryClient = new QueryClient();

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
