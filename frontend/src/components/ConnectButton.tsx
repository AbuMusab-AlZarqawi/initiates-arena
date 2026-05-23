"use client";
import { useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { motion, AnimatePresence } from "framer-motion";

export default function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [showModal, setShowModal] = useState(false);

  if (isConnected && address) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowModal(!showModal)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 transition-colors"
        >
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="font-mono text-xs text-white">
            {address.slice(0, 6)}…{address.slice(-4)}
          </span>
        </button>

        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              className="absolute right-0 top-10 z-50 bg-slate-900 border border-slate-700 rounded-xl p-4 w-52 shadow-2xl"
            >
              <p className="font-mono text-xs text-slate-400 mb-3 break-all">{address}</p>
              <button
                onClick={() => { disconnect(); setShowModal(false); }}
                className="w-full py-2 rounded-lg bg-red-900/50 hover:bg-red-800/60 text-red-300 font-mono text-xs transition-colors"
              >
                Disconnect
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {showModal && (
          <div className="fixed inset-0 z-40" onClick={() => setShowModal(false)} />
        )}
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 rounded-lg font-cinzel text-xs font-bold text-white tracking-wider transition-all duration-200 hover:scale-105"
        style={{ background: "linear-gradient(135deg, #7d3c98, #9b59b6)", boxShadow: "0 0 16px #7d3c9866" }}
      >
        Connect Wallet
      </button>

      <AnimatePresence>
        {showModal && (
          <>
            <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-80 bg-slate-950 border border-slate-700 rounded-2xl p-6 shadow-2xl"
            >
              <h3 className="font-cinzel text-lg text-white text-center mb-1">Connect Wallet</h3>
              <p className="text-slate-500 text-xs text-center font-mono mb-5">Choose your wallet to enter the Arena</p>

              <div className="space-y-2">
                {connectors
                  .filter((c, i, arr) => arr.findIndex(x => x.name === c.name) === i) // dedupe
                  .map((connector) => (
                    <button
                      key={connector.uid}
                      onClick={() => { connect({ connector }); setShowModal(false); }}
                      disabled={isPending}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-700 hover:border-slate-500 bg-slate-900 hover:bg-slate-800 transition-all duration-200 disabled:opacity-50"
                    >
                      <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-lg">
                        {connector.name.toLowerCase().includes("metamask") ? "🦊" :
                         connector.name.toLowerCase().includes("coinbase") ? "🔵" : "💼"}
                      </div>
                      <span className="font-mono text-sm text-white">{connector.name}</span>
                      <span className="ml-auto text-slate-600 text-xs">→</span>
                    </button>
                  ))}
              </div>

              <p className="text-slate-600 text-xs text-center mt-4 font-mono">
                Need a wallet? Get{" "}
                <a href="https://metamask.io" target="_blank" rel="noopener noreferrer"
                  className="text-ritualist-light underline">MetaMask</a>
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
