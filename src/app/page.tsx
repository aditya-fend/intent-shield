'use client';

import { useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { Hex, parseUnits } from 'viem';
import { PolicyStruct, ENFORCER_CONTRACT_ADDRESS } from '@/lib/eip712-types';
import { verifyPolicySignature } from '@/lib/eip712-verifier';
import { publicClient } from '@/lib/viem';

export default function Home() {
  const { address: userAddress, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  // State Intent & UI
  const [intentInput, setIntentInput] = useState<string>(
    'Swap maksimal 500 USDC ke ETH di Uniswap dengan maksimal 1% slippage selama 1 jam.'
  );
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [draftPolicy, setDraftPolicy] = useState<PolicyStruct | null>(null);
  const [userSignature, setUserSignature] = useState<Hex | null>(null);
  const [statusLog, setStatusLog] = useState<string[]>([]);
  
  // State Eksekusi Transaksi
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [executionResult, setExecutionResult] = useState<{
    txHash?: string;
    error?: string;
    stage?: 'OFF_CHAIN_REJECT' | 'ON_CHAIN_REVERT' | 'SUCCESS';
  } | null>(null);

  const addLog = (msg: string) => {
    setStatusLog((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  // 1. Simulasi Parse Intent via Gemini (Untrusted Compiler)
  const handleParseIntent = async () => {
    setIsParsing(true);
    setDraftPolicy(null);
    setUserSignature(null);
    setExecutionResult(null);
    setStatusLog([]);
    addLog('Mengirim intent ke Gemini AI Compiler...');

    setTimeout(() => {
      // Mock hasil kompilasi Gemini berdasarkan input intent
      const mockCompiledPolicy: PolicyStruct = {
        agent: '0x1234567890123456789012345678901234567890' as `0x${string}`, // Demo Agent Address
        action: 'swap',
        tokenIn: '0x036Cb527753f487a5016f79A67972650cB2aD9b9' as `0x${string}`, // Mock USDC Base Sepolia
        tokenOut: '0x4200000000000000000000000000000000000006' as `0x${string}`, // WETH Base Sepolia
        maxAmountIn: parseUnits('500', 6), // 500 USDC (6 decimals)
        allowedTarget: '0x94cc041474862E38096D78297034E2730598b049' as `0x${string}`, // Uniswap Router
        maxSlippageBps: 100n, // 1% = 100 bps
        expiresAt: BigInt(Math.floor(Date.now() / 1000) + 3600), // 1 Jam ke depan
        nonce: BigInt(Math.floor(Math.random() * 100000)),
      };

      setDraftPolicy(mockCompiledPolicy);
      setIsParsing(false);
      addLog('Draft Policy berhasil dibuat. Menunggu peninjauan & otorisasi user.');
    }, 1200);
  };

  // 2. Eksekusi Proposal Transaksi Agent (Demo A: Valid 300 USDC vs Demo B: Malicious 5,000 USDC)
  const handleExecuteProposal = async (amountUsdc: number, bypassVerifier = false) => {
    if (!draftPolicy || !userSignature || !userAddress) return;

    setIsExecuting(true);
    setExecutionResult(null);
    addLog(`Agent mengusulkan transaksi swap ${amountUsdc} USDC...`);

    const proposedAmountIn = parseUnits(amountUsdc.toString(), 6);

    // LAYER 1: Off-Chain Policy Verification (Optimistic Pre-Check)
    if (!bypassVerifier) {
      addLog('Layer 1: Melakukan Off-Chain Policy Verification...');
      try {
        const isSigValid = await verifyPolicySignature({
          policy: draftPolicy,
          signature: userSignature,
          userAddress,
        });

        if (!isSigValid || proposedAmountIn > draftPolicy.maxAmountIn) {
          addLog('❌ Layer 1: OFF-CHAIN VERIFIER REJECTED — Amount melebihi Signed Policy Limit!');
          setExecutionResult({
            stage: 'OFF_CHAIN_REJECT',
            error: `Off-Chain Pre-Check Failed: Proposal amount (${amountUsdc} USDC) > Policy Limit (500 USDC)`,
          });
          setIsExecuting(false);
          return;
        }
        addLog('✅ Layer 1: Off-Chain Verification PASSED.');
      } catch (err: unknown) {
        const error = err as Error;
        addLog(`❌ Layer 1 REJECTED: ${error.message}`);
        setExecutionResult({ stage: 'OFF_CHAIN_REJECT', error: error.message });
        setIsExecuting(false);
        return;
      }
    } else {
      addLog('⚠️ WARNING: Off-Chain Verifier DI-BYPASS! Transaksi langsung dikirim ke Smart Account...');
    }

    // LAYER 2: On-Chain Enforcement Check (Smart Account Boundary)
    addLog('Layer 2: Menghubungi Smart Account Enforcer di Base Sepolia...');
    try {
      // Pengecekan On-Chain Simulasi via Viem
      if (proposedAmountIn > draftPolicy.maxAmountIn) {
        throw new Error('AmountExceedsPolicyLimit() — On-Chain Smart Account Reverted Transaction!');
      }

      const blockNumber = await publicClient.getBlockNumber();
      const mockTxHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

      addLog(`✅ Layer 2: ON-CHAIN ENFORCEMENT PASSED (Block #${blockNumber})`);
      setExecutionResult({
        stage: 'SUCCESS',
        txHash: mockTxHash,
      });
    } catch (err: unknown) {
      const error = err as Error;
      addLog(`❌ Layer 2: ON-CHAIN ENFORCER REVERTED — ${error.message}`);
      setExecutionResult({
        stage: 'ON_CHAIN_REVERT',
        error: error.message,
      });
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-emerald-400">IntentShield MVP v2</h1>
            <p className="text-xs text-slate-400">Intent-Bound Authorization Layer for Autonomous Agents</p>
          </div>
          <div>
            {isConnected ? (
              <div className="flex items-center gap-3">
                <span className="text-xs bg-slate-800 px-3 py-1.5 rounded-full font-mono text-emerald-300">
                  {userAddress?.slice(0, 6)}...{userAddress?.slice(-4)}
                </span>
                <button
                  onClick={() => disconnect()}
                  className="text-xs bg-red-950/60 text-red-400 hover:bg-red-900 border border-red-800 px-3 py-1.5 rounded"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={() => connect({ connector: injected() })}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs px-4 py-2 rounded"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </header>

        {/* STEP 1: Natural Language Intent */}
        <section className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Step 1: Natural Language Intent
            </h2>
            <span className="text-xs bg-slate-800 text-slate-400 px-2.5 py-1 rounded">Untrusted Gemini Input</span>
          </div>
          <textarea
            value={intentInput}
            onChange={(e) => setIntentInput(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
            rows={2}
          />
          <button
            onClick={handleParseIntent}
            disabled={isParsing || !intentInput}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold px-4 py-2.5 rounded transition"
          >
            {isParsing ? 'Compiling via Gemini AI...' : 'Compile Intent to Policy Draft'}
          </button>
        </section>

        {/* STEP 2: Policy Review & Wallet EIP-712 Sign */}
        {draftPolicy && (
          <section className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                Step 2: Human Review & EIP-712 Signing
              </h2>
              <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded">
                Trusted Boundary
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono bg-slate-950 p-4 rounded border border-slate-800">
              <div><span className="text-slate-500">Action:</span> {draftPolicy.action}</div>
              <div><span className="text-slate-500">Max Amount:</span> 500 USDC</div>
              <div><span className="text-slate-500">Target Router:</span> {draftPolicy.allowedTarget.slice(0, 10)}...</div>
              <div><span className="text-slate-500">Max Slippage:</span> 1% (100 bps)</div>
              <div><span className="text-slate-500">Expires In:</span> 1 Hour</div>
              <div><span className="text-slate-500">Smart Enforcer:</span> {ENFORCER_CONTRACT_ADDRESS.slice(0, 8)}...</div>
            </div>

            {!userSignature ? (
              <button
                onClick={() => setUserSignature('0xmocksignature1234567890abcdef' as Hex)}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3 rounded"
              >
                Sign EIP-712 Typed Authorization (Wallet)
              </button>
            ) : (
              <div className="bg-emerald-950/40 border border-emerald-800/60 p-3 rounded text-xs text-emerald-400 font-mono flex justify-between items-center">
                <span>✓ Policy signed by owner. EIP-712 Commitment active!</span>
                <span className="text-[10px] bg-emerald-900/50 px-2 py-1 rounded">Signed</span>
              </div>
            )}
          </section>
        )}

        {/* STEP 3: Execution Demo (Valid vs Malicious Attack) */}
        {userSignature && (
          <section className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Step 3: Autonomous Agent Execution Sandbox
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Demo A: Normal Execution */}
              <div className="border border-slate-800 bg-slate-950 p-4 rounded space-y-3">
                <h3 className="text-xs font-bold text-emerald-400">DEMO A: Normal Execution</h3>
                <p className="text-[11px] text-slate-400">Agent mengusulkan 300 USDC swap (memenuhi signed policy).</p>
                <button
                  onClick={() => handleExecuteProposal(300, false)}
                  disabled={isExecuting}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-emerald-400 font-mono text-xs py-2 rounded border border-emerald-900"
                >
                  Execute 300 USDC Swap
                </button>
              </div>

              {/* Demo B: Malicious Attack Execution */}
              <div className="border border-red-950 bg-red-950/10 p-4 rounded space-y-3">
                <h3 className="text-xs font-bold text-red-400">DEMO B: Malicious Over-budget Attack</h3>
                <p className="text-[11px] text-slate-400">Agent mencoba menguras 5,000 USDC (melanggar policy).</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleExecuteProposal(5000, false)}
                    disabled={isExecuting}
                    className="flex-1 bg-red-950 hover:bg-red-900 text-red-200 font-mono text-xs py-2 rounded border border-red-800"
                  >
                    Test 5,000 USDC (Verifier Check)
                  </button>
                  <button
                    onClick={() => handleExecuteProposal(5000, true)}
                    disabled={isExecuting}
                    className="flex-1 bg-red-900 hover:bg-red-800 text-white font-mono text-xs py-2 rounded border border-red-700"
                  >
                    Bypass Verifier (On-Chain Revert)
                  </button>
                </div>
              </div>
            </div>

            {/* Status Execution Display */}
            {executionResult && (
              <div
                className={`p-4 rounded border font-mono text-xs ${
                  executionResult.stage === 'SUCCESS'
                    ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                    : executionResult.stage === 'OFF_CHAIN_REJECT'
                    ? 'bg-amber-950/60 border-amber-800 text-amber-300'
                    : 'bg-red-950/60 border-red-800 text-red-300'
                }`}
              >
                <div className="font-bold">Execution Result: {executionResult.stage}</div>
                {executionResult.txHash && (
                  <div className="mt-1 text-[11px] break-all">
                    Tx Hash: <span className="underline">{executionResult.txHash}</span>
                  </div>
                )}
                {executionResult.error && <div className="mt-1 text-[11px]">{executionResult.error}</div>}
              </div>
            )}
          </section>
        )}

        {/* Audit Trail Logs */}
        {statusLog.length > 0 && (
          <section className="bg-slate-900 border border-slate-800 rounded-lg p-4 font-mono text-xs">
            <h3 className="text-slate-400 mb-2 font-bold uppercase text-[10px]">Execution Audit Trail Log</h3>
            <div className="space-y-1 max-h-40 overflow-y-auto text-slate-300">
              {statusLog.map((log, index) => (
                <div key={index}>{log}</div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}