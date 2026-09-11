import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';

const rpcUrl = process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC || 'https://sepolia.base.org';

// Public Client Viem untuk read-only operation ke Base Sepolia
export const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(rpcUrl),
});