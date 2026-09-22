"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect, type ReactNode } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { injected, metaMask, coinbaseWallet } from "wagmi/connectors";

const rpcUrl =
  process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC || "https://sepolia.base.org";

export const config = createConfig({
  chains: [baseSepolia],
  connectors: [
    injected(), // desktop extension + in-app browser (MetaMask/Rabbit mobile)
    metaMask({ dappMetadata: { name: "IntentShield" } }), // mobile deep-link fallback
    coinbaseWallet({ appName: "IntentShield" }), // mobile tanpa install via Smart Wallet
    // ponytail: no walletConnect connector, needs WC projectId; add when QR-for-all-wallets required
  ],
  transports: {
    [baseSepolia.id]: http(rpcUrl),
  },
  ssr: false,
});

export function Web3Provider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {mounted ? children : null}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
