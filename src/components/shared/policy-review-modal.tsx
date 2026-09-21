"use client";

import React, { useState } from "react";
import { 
  ShieldCheck, 
  Pencil, 
  X, 
  Check, 
  Clock, 
  ArrowRight, 
  Lock
} from "lucide-react";

export interface PolicyStruct {
  agent: string;
  action: string;
  tokenIn: string;
  tokenOut: string;
  maxAmountIn: string; // Dalam string uint256 (6 desimal untuk USDC)
  allowedTarget: string;
  maxSlippageBps: number; // Dalam Basis Points (misal 100 = 1%)
  expiresAt: number; // Unix timestamp dalam detik
  nonce: number;
}

interface PolicyReviewModalProps {
  draftPolicy: PolicyStruct;
  onApprove: (finalPolicy: PolicyStruct) => void;
  onCancel: () => void;
}

export const PolicyReviewModal: React.FC<PolicyReviewModalProps> = ({
  draftPolicy,
  onApprove,
  onCancel,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [policy, setPolicy] = useState<PolicyStruct>(draftPolicy);
  
  const [humanAmount, setHumanAmount] = useState<string>(
    (Number(BigInt(draftPolicy.maxAmountIn || "0")) / 1_000_000).toString()
  );
  
  const [slippagePercent, setSlippagePercent] = useState<number>(
    draftPolicy.maxSlippageBps / 100
  );
  
  const [durationMinutes, setDurationMinutes] = useState<number>(() => {
    const nowSec = Math.floor(Date.now() / 1000);
    return Math.max(
      1,
      Math.round((draftPolicy.expiresAt - nowSec) / 60)
    );
  });

  // Helper Potong Alamat Ethereum (0x1234...5678)
  const truncateAddress = (addr: string) => {
    if (!addr || addr.length < 10) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Handler Perubahan Form Edit
  const handleApplyChanges = () => {
    try {
      // 1. Konversi USDC Manusiawi -> 6 Desimal uint256 string
      const parsedAmount = parseFloat(humanAmount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        alert("Masukkan jumlah nominal USDC yang valid.");
        return;
      }
      const rawMaxAmountIn = BigInt(Math.round(parsedAmount * 1000000)).toString();

      // 2. Konversi Persen Slippage -> BPS
      const parsedSlippage = parseFloat(slippagePercent.toString());
      if (isNaN(parsedSlippage) || parsedSlippage < 0.1 || parsedSlippage > 50) {
        alert("Slippage harus berada di antara 0.1% hingga 50%.");
        return;
      }
      const maxSlippageBps = Math.round(parsedSlippage * 100);

      // 3. Hitung Timestamp Expiry Baru
      const newExpiresAt = Math.floor(Date.now() / 1000) + durationMinutes * 60;

      // Update State Utama Policy
      const updatedPolicy: PolicyStruct = {
        ...policy,
        maxAmountIn: rawMaxAmountIn,
        maxSlippageBps,
        expiresAt: newExpiresAt,
      };

      setPolicy(updatedPolicy);
      setIsEditing(false);
    } catch (err) {
      console.error("Gagal memperbarui policy constraints:", err);
      alert("Terjadi kesalahan saat memproses parameter policy.");
    }
  };

  // Format Tanggal Lokal dari Unix Timestamp
  const formatExpiryDate = (timestampSec: number) => {
    return new Date(timestampSec * 1000).toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // Konversi maxAmountIn Aktif ke USDC Manusiawi untuk Tampilan Review
  const currentUsdcDisplay = (
    Number(BigInt(policy.maxAmountIn || "0")) / 1000000
  ).toLocaleString("en-US", { maximumFractionDigits: 2 });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 text-slate-100 shadow-2xl transition-all">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/50">
          <div className="flex items-center space-x-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-white">Draft Policy Review</h3>
              <p className="text-xs text-slate-400">Verifikasi Hard Constraints sebelum EIP-712 Signing</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Header Action & Agent */}
          <div className="grid grid-cols-2 gap-3 rounded-xl bg-slate-950/60 p-3.5 border border-slate-800/80 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Action</span>
              <span className="font-mono font-medium text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 inline-block">
                {policy.action}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Authorized Agent</span>
              <span className="font-mono text-slate-200" title={policy.agent}>
                {truncateAddress(policy.agent)}
              </span>
            </div>
          </div>

          {/* Token Flow Display */}
          <div className="flex items-center justify-between rounded-xl bg-slate-800/40 p-4 border border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center font-bold text-blue-400 text-xs">
                USDC
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Token In</span>
                <span className="text-sm font-semibold text-white">USDC</span>
              </div>
            </div>

            <ArrowRight className="h-5 w-5 text-slate-500" />

            <div className="flex items-center space-x-3 text-right">
              <div>
                <span className="text-xs text-slate-400 block">Token Out</span>
                <span className="text-sm font-semibold text-white">WETH</span>
              </div>
              <div className="h-10 w-10 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center font-bold text-purple-400 text-xs">
                WETH
              </div>
            </div>
          </div>

          {/* Mode Tampilan vs Mode Edit */}
          {!isEditing ? (
            /* --- REVIEW VIEW MODE --- */
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Enforced Limits
                </span>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-1 text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  <span>Edit Constraints</span>
                </button>
              </div>

              <div className="rounded-xl bg-slate-950/40 border border-slate-800 divide-y divide-slate-800/60 text-sm">
                <div className="flex justify-between p-3.5">
                  <span className="text-slate-400">Max Swap Amount</span>
                  <span className="font-semibold text-white">{currentUsdcDisplay} USDC</span>
                </div>
                <div className="flex justify-between p-3.5">
                  <span className="text-slate-400">Max Slippage</span>
                  <span className="font-semibold text-white">{policy.maxSlippageBps / 100}% ({policy.maxSlippageBps} bps)</span>
                </div>
                <div className="flex justify-between p-3.5">
                  <span className="text-slate-400">Expires At</span>
                  <span className="font-medium text-slate-200 text-xs flex items-center space-x-1">
                    <Clock className="h-3.5 w-3.5 text-slate-400 inline mr-1" />
                    {formatExpiryDate(policy.expiresAt)}
                  </span>
                </div>
                <div className="flex justify-between p-3.5 text-xs">
                  <span className="text-slate-400">Allowed Target</span>
                  <span className="font-mono text-slate-300" title={policy.allowedTarget}>
                    Uniswap Router ({truncateAddress(policy.allowedTarget)})
                  </span>
                </div>
                <div className="flex justify-between p-3.5 text-xs">
                  <span className="text-slate-400">Replay Protection Nonce</span>
                  <span className="font-mono text-slate-400">#{policy.nonce}</span>
                </div>
              </div>
            </div>
          ) : (
            /* --- USER OVERRIDE / EDIT FORM --- */
            <div className="space-y-4 rounded-xl bg-slate-950/80 p-4 border border-emerald-500/30">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center space-x-1">
                  <Pencil className="h-3.5 w-3.5 mr-1" /> Override Constraints
                </span>
              </div>

              {/* Input Nominal USDC */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Max Swap Amount (USDC)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={humanAmount}
                    onChange={(e) => setHumanAmount(e.target.value)}
                    placeholder="500"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">
                    USDC
                  </span>
                </div>
              </div>

              {/* Input Slippage */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Max Slippage Tolerance (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={slippagePercent}
                  onChange={(e) => setSlippagePercent(parseFloat(e.target.value))}
                  placeholder="1.0"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Pilihan Durasi Expiry */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Policy Expiry Duration
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "30 Mins", min: 30 },
                    { label: "1 Hour", min: 60 },
                    { label: "2 Hours", min: 120 },
                  ].map((option) => (
                    <button
                      key={option.min}
                      type="button"
                      onClick={() => setDurationMinutes(option.min)}
                      className={`rounded-lg py-2 text-xs font-medium border transition-colors ${
                        durationMinutes === option.min
                          ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                          : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tombol Simpan/Batal Edit */}
              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={handleApplyChanges}
                  className="flex-1 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-500 flex items-center justify-center space-x-1 transition-colors"
                >
                  <Check className="h-3.5 w-3.5 mr-1" /> Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-lg bg-slate-800 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Security Notice */}
          <div className="flex items-start space-x-2 rounded-lg bg-amber-500/10 p-3 border border-amber-500/20 text-amber-200/90 text-xs">
            <Lock className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <p>
              Menandatangani policy ini memberikan izin terbatas kepada <strong>Agent</strong> untuk mengeksekusi swap sesuai batas di atas secara deterministic melalui <code>IntentShieldEnforcer</code>.
            </p>
          </div>

        </div>

        {/* Modal Footer / Action Buttons */}
        <div className="flex items-center justify-end space-x-3 border-t border-slate-800 bg-slate-950/60 px-6 py-4">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            Reject / Cancel
          </button>
          
          <button
            type="button"
            disabled={isEditing}
            onClick={() => onApprove(policy)}
            className={`rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-950 flex items-center space-x-2 shadow-lg transition-all ${
              isEditing
                ? "bg-slate-700 cursor-not-allowed opacity-50"
                : "bg-emerald-400 hover:bg-emerald-300 shadow-emerald-500/20"
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Approve & Sign Policy (EIP-712)</span>
          </button>
        </div>

      </div>
    </div>
  );
};