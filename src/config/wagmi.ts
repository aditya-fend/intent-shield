import { http, createConfig } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

// Mengambil URL RPC dari environment variable atau fallback ke RPC publik
const rpcUrl = process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC || 'https://sepolia.base.org';

export const config = createConfig({
  chains: [baseSepolia],
  connectors: [
    injected(), // Wallet konektor (MetaMask, Coinbase Wallet, Rabby, dll)
  ],
  transports: {
    [baseSepolia.id]: http(rpcUrl),
  },
});