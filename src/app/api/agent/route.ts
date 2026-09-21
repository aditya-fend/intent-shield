import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { 
  createWalletClient, 
  createPublicClient, 
  http, 
  getAddress,
  type Address, 
  type Hex 
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import { verifyPolicyOffChain, type PolicyStruct } from "@/lib/offchain-verifier";

// Smart Contract ABI Minimal untuk IntentShieldEnforcer
const ENFORCER_ABI = [
  {
    type: "function",
    name: "executeWithPolicy",
    inputs: [
      {
        name: "policy",
        type: "tuple",
        components: [
          { name: "agent", type: "address" },
          { name: "action", type: "string" },
          { name: "tokenIn", type: "address" },
          { name: "tokenOut", type: "address" },
          { name: "maxAmountIn", type: "uint256" },
          { name: "allowedTarget", type: "address" },
          { name: "maxSlippageBps", type: "uint256" },
          { name: "expiresAt", type: "uint256" },
          { name: "nonce", type: "uint256" },
        ],
      },
      { name: "signature", type: "bytes" },
      {
        name: "swapParams",
        type: "tuple",
        components: [
          { name: "tokenIn", type: "address" },
          { name: "tokenOut", type: "address" },
          { name: "fee", type: "uint24" },
          { name: "recipient", type: "address" },
          { name: "deadline", type: "uint256" },
          { name: "amountIn", type: "uint256" },
          { name: "amountOutMinimum", type: "uint256" },
          { name: "sqrtPriceLimitX96", type: "uint160" },
        ],
      },
    ],
    outputs: [{ name: "amountOut", type: "uint256" }],
    stateMutability: "nonpayable",
  },
] as const;

// Inisialisasi Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      policy, 
      signature, 
      userAddress, 
      proposedAmountUsdc, 
      bypassVerifier = false 
    }: {
      policy: PolicyStruct;
      signature: Hex;
      userAddress: Address;
      proposedAmountUsdc: number;
      bypassVerifier?: boolean;
    } = body;

    const rawEnforcerAddress = process.env.NEXT_PUBLIC_SMART_ACCOUNT_ENFORCER;
    const agentPrivateKey = (process.env.AGENT_PRIVATE_KEY || process.env.PRIVATE_KEY) as Hex;

    if (!rawEnforcerAddress || !agentPrivateKey) {
      return NextResponse.json(
        { success: false, error: "Server missing contract environment configuration." },
        { status: 500 }
      );
    }

    // --- Sanitasi Alamat (EIP-55 Checksum formatting) ---
    const formattedUserAddress = getAddress(userAddress);
    const enforcerAddress = getAddress(rawEnforcerAddress);

    const formattedPolicy: PolicyStruct = {
      ...policy,
      agent: getAddress(policy.agent),
      tokenIn: getAddress(policy.tokenIn),
      tokenOut: getAddress(policy.tokenOut),
      allowedTarget: getAddress(policy.allowedTarget),
    };

    // 1. Hitung amountIn aktual yang diajukan oleh Autonomous Agent (USDC = 6 desimal)
    const proposedAmountInBig = BigInt(Math.round(proposedAmountUsdc * 1000000));

    // 2. Susun Proposal Swap Parameters
    const swapParams = {
      tokenIn: formattedPolicy.tokenIn,
      tokenOut: formattedPolicy.tokenOut,
      fee: 3000, // Fee tier 0.3%
      recipient: enforcerAddress,
      deadline: BigInt(formattedPolicy.expiresAt),
      amountIn: proposedAmountInBig,
      amountOutMinimum: BigInt(0), // Diatur 0 untuk simplifikasi pengujian testnet
      sqrtPriceLimitX96: BigInt(0),
    };

    const proposal = {
      targetContract: formattedPolicy.allowedTarget,
      amountIn: proposedAmountInBig,
      tokenIn: formattedPolicy.tokenIn,
      tokenOut: formattedPolicy.tokenOut,
    };

    // --- LAYER 1: OFF-CHAIN PRE-CHECK ---
    if (!bypassVerifier) {
      const verifierResult = await verifyPolicyOffChain(
        formattedPolicy,
        signature,
        formattedUserAddress,
        proposal,
        enforcerAddress
      );

      if (!verifierResult.valid) {
        // Log penolakan ke Supabase Audit Trail
        await supabase.from("executions").insert([
          {
            user_address: formattedUserAddress,
            agent_address: formattedPolicy.agent,
            action: formattedPolicy.action,
            proposed_amount: proposedAmountUsdc.toString(),
            max_limit: (Number(BigInt(formattedPolicy.maxAmountIn)) / 1000000).toString(),
            status: "REJECTED_OFFCHAIN",
            stage: "LAYER_1_OFFCHAIN",
            reason: verifierResult.reason,
            nonce: formattedPolicy.nonce,
            created_at: new Date().toISOString(),
          },
        ]);

        return NextResponse.json({
          success: false,
          stage: "OFF_CHAIN_REJECT",
          reason: verifierResult.reason,
        });
      }
    }

    // --- LAYER 2: ON-CHAIN ENFORCEMENT EXECUTION ---
    const agentAccount = privateKeyToAccount(agentPrivateKey);
    const publicClient = createPublicClient({
      chain: baseSepolia,
      transport: http(),
    });
    const walletClient = createWalletClient({
      account: agentAccount,
      chain: baseSepolia,
      transport: http(),
    });

    try {
      // Simulasikan panggilan kontrak untuk memastikan apakah transaksi akan Revert di Smart Contract
      const { request } = await publicClient.simulateContract({
        account: agentAccount,
        address: enforcerAddress,
        abi: ENFORCER_ABI,
        functionName: "executeWithPolicy",
        args: [
          {
            agent: formattedPolicy.agent,
            action: formattedPolicy.action,
            tokenIn: formattedPolicy.tokenIn,
            tokenOut: formattedPolicy.tokenOut,
            maxAmountIn: BigInt(formattedPolicy.maxAmountIn),
            allowedTarget: formattedPolicy.allowedTarget,
            maxSlippageBps: BigInt(formattedPolicy.maxSlippageBps),
            expiresAt: BigInt(formattedPolicy.expiresAt),
            nonce: BigInt(formattedPolicy.nonce),
          },
          signature,
          swapParams,
        ],
      });

      // Kirim transaksi ke Base Sepolia
      const txHash = await walletClient.writeContract(request);

      // Log sukses ke Supabase Audit Trail
      await supabase.from("executions").insert([
        {
          user_address: formattedUserAddress,
          agent_address: formattedPolicy.agent,
          action: formattedPolicy.action,
          proposed_amount: proposedAmountUsdc.toString(),
          max_limit: (Number(BigInt(formattedPolicy.maxAmountIn)) / 1000000).toString(),
          status: "SUCCESS_ONCHAIN",
          stage: "LAYER_2_ONCHAIN",
          tx_hash: txHash,
          nonce: formattedPolicy.nonce,
          created_at: new Date().toISOString(),
        },
      ]);

      return NextResponse.json({
        success: true,
        stage: "ON_CHAIN_SUCCESS",
        txHash,
      });

    } catch (onChainError: any) {
      const errorReason = onChainError?.shortMessage || onChainError?.message || "On-Chain Execution Reverted";

      // Log Revert Smart Contract ke Supabase Audit Trail
      await supabase.from("executions").insert([
        {
          user_address: formattedUserAddress,
          agent_address: formattedPolicy.agent,
          action: formattedPolicy.action,
          proposed_amount: proposedAmountUsdc.toString(),
          max_limit: (Number(BigInt(formattedPolicy.maxAmountIn)) / 1000000).toString(),
          status: "REVERTED_ONCHAIN",
          stage: "LAYER_2_ONCHAIN",
          reason: errorReason,
          nonce: formattedPolicy.nonce,
          created_at: new Date().toISOString(),
        },
      ]);

      return NextResponse.json({
        success: false,
        stage: "ON_CHAIN_REVERT",
        reason: `Reverted by IntentShieldEnforcer contract: ${errorReason}`,
      });
    }

  } catch (error: any) {
    console.error("Error in Agent Runner API:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Internal server error running agent proposal.",
      },
      { status: 500 }
    );
  }
}