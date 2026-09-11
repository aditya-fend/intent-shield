'use client';

import { useBlockNumber, useChainId } from 'wagmi';

export default function RpcStatusCheck() {
  const chainId = useChainId();
  const { data: blockNumber, isError, isLoading } = useBlockNumber({ watch: true });

  if (isLoading) return <div>Memuat data RPC Base Sepolia...</div>;
  if (isError) return <div>❌ Gagal terhubung ke RPC Base Sepolia</div>;

  return (
    <div className="p-4 border rounded-md bg-slate-900 text-white">
      <h3 className="font-bold text-green-400">✅ RPC Base Sepolia Connected</h3>
      <p>Chain ID: <strong>{chainId}</strong> (Base Sepolia: 84532)</p>
      <p>Latest Block: <strong>{blockNumber?.toString()}</strong></p>
    </div>
  );
}