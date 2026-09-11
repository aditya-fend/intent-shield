'use client';

import { useState } from 'react';
import { useAccount, useSignTypedData } from 'wagmi';
import { Hex } from 'viem';
import { EIP712_DOMAIN, EIP712_TYPES, PolicyStruct } from '@/lib/eip712-types';
import { verifyPolicySignature } from '@/lib/eip712-verifier';

interface PolicyReviewModalProps {
  policy: PolicyStruct;
  onSuccess?: (signature: Hex) => void;
}

export function PolicyReviewModal({ policy, onSuccess }: PolicyReviewModalProps) {
  const { address: userAddress, isConnected } = useAccount();
  const { signTypedDataAsync, isPending } = useSignTypedData();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);

  const handleSignPolicy = async () => {
    setErrorMsg(null);
    setIsVerified(false);

    if (!isConnected || !userAddress) {
      setErrorMsg('Wallet belum terhubung. Silakan hubungkan wallet Anda.');
      return;
    }

    try {
      // 1. Tanda tangani EIP-712 Typed Data via Wallet (Wagmi Hook)
      const signature = await signTypedDataAsync({
        domain: EIP712_DOMAIN,
        types: EIP712_TYPES,
        primaryType: 'Policy',
        message: policy,
      });

      // 2. Verifikasi Off-Chain Signature menggunakan Viem
      const isValid = await verifyPolicySignature({
        policy,
        signature,
        userAddress,
      });

      if (isValid) {
        setIsVerified(true);
        if (onSuccess) onSuccess(signature);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal menandatangani policy';
      setErrorMsg(message);
    }
  };

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-900 p-6 shadow-xl text-slate-100 max-w-md w-full">
      <h3 className="text-lg font-bold text-emerald-400 mb-4">IntentShield — Policy Authorization</h3>

      {/* Ringkasan Policy */}
      <div className="space-y-2 text-sm bg-slate-800 p-4 rounded-md mb-4 font-mono">
        <div><span className="text-slate-400">Action:</span> {policy.action}</div>
        <div><span className="text-slate-400">Max Amount:</span> {policy.maxAmountIn.toString()}</div>
        <div><span className="text-slate-400">Agent:</span> {policy.agent.slice(0, 6)}...{policy.agent.slice(-4)}</div>
        <div><span className="text-slate-400">Target Router:</span> {policy.allowedTarget.slice(0, 6)}...{policy.allowedTarget.slice(-4)}</div>
        <div><span className="text-slate-400">Expires At:</span> {new Date(Number(policy.expiresAt) * 1000).toLocaleString()}</div>
        <div><span className="text-slate-400">Nonce:</span> {policy.nonce.toString()}</div>
      </div>

      {/* Error & Success Notice */}
      {errorMsg && (
        <div className="mb-4 rounded bg-red-950/80 p-3 text-xs text-red-400 border border-red-800">
          {errorMsg}
        </div>
      )}
      {isVerified && (
        <div className="mb-4 rounded bg-emerald-950/80 p-3 text-xs text-emerald-400 border border-emerald-800">
          ✓ Tanda tangan terverifikasi secara off-chain!
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={handleSignPolicy}
        disabled={isPending || !isConnected}
        className="w-full rounded bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-emerald-500 disabled:opacity-50"
      >
        {isPending ? 'Menunggu Tanda Tangan Wallet...' : 'Setujui & Otorisasi (Sign EIP-712)'}
      </button>
    </div>
  );
}