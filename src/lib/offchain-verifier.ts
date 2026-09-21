import { verifyTypedData, getAddress, type Address, type Hex } from "viem";
import { baseSepolia } from "viem/chains";

export interface PolicyStruct {
  agent: Address;
  action: string;
  tokenIn: Address;
  tokenOut: Address;
  maxAmountIn: string; // BigInt uint256 string
  allowedTarget: Address;
  maxSlippageBps: number;
  expiresAt: number;
  nonce: number;
}

export interface ProposalPayload {
  targetContract: Address;
  amountIn: bigint;
  tokenIn: Address;
  tokenOut: Address;
}

export interface VerificationResult {
  valid: boolean;
  reason?: string;
}

// Konfigurasi EIP-712 Domain Separator sesuai Smart Contract IntentShieldEnforcer
const getEip712Domain = (verifyingContract: Address) => ({
  name: "IntentShield",
  version: "1",
  chainId: baseSepolia.id, // 84532
  verifyingContract,
});

// EIP-712 Types Struct Definition
const eip712Types = {
  Policy: [
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
} as const;

export async function verifyPolicyOffChain(
  policy: PolicyStruct,
  signature: Hex,
  userAddress: Address,
  proposal: ProposalPayload,
  enforcerContractAddress: Address
): Promise<VerificationResult> {
  try {
    // Sanitasi dan format seluruh address ke bentuk EIP-55 Checksum yang valid
    const formattedUserAddress = getAddress(userAddress);
    const formattedEnforcerAddress = getAddress(enforcerContractAddress);

    const formattedPolicy: PolicyStruct = {
      ...policy,
      agent: getAddress(policy.agent),
      tokenIn: getAddress(policy.tokenIn),
      tokenOut: getAddress(policy.tokenOut),
      allowedTarget: getAddress(policy.allowedTarget),
    };

    const formattedProposal: ProposalPayload = {
      ...proposal,
      targetContract: getAddress(proposal.targetContract),
      tokenIn: getAddress(proposal.tokenIn),
      tokenOut: getAddress(proposal.tokenOut),
    };

    // 1. Check Expiration Timestamp
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (currentTimestamp > formattedPolicy.expiresAt) {
      return { valid: false, reason: "OFFCHAIN_REJECT: Policy has expired." };
    }

    // 2. Check Action Constraints
    if (formattedPolicy.action !== "swap") {
      return { valid: false, reason: "OFFCHAIN_REJECT: Invalid policy action." };
    }

    // 3. Check Target Router Constraint
    if (formattedProposal.targetContract !== formattedPolicy.allowedTarget) {
      return {
        valid: false,
        reason: `OFFCHAIN_REJECT: Target contract (${formattedProposal.targetContract}) is not allowed by policy (${formattedPolicy.allowedTarget}).`,
      };
    }

    // 4. Check Token Constraints
    if (formattedProposal.tokenIn !== formattedPolicy.tokenIn) {
      return { valid: false, reason: "OFFCHAIN_REJECT: TokenIn mismatch." };
    }
    if (formattedProposal.tokenOut !== formattedPolicy.tokenOut) {
      return { valid: false, reason: "OFFCHAIN_REJECT: TokenOut mismatch." };
    }

    // 5. Check Amount Limit Constraint
    const maxAmountInBig = BigInt(formattedPolicy.maxAmountIn);
    if (formattedProposal.amountIn > maxAmountInBig) {
      return {
        valid: false,
        reason: `OFFCHAIN_REJECT: Amount (${formattedProposal.amountIn.toString()}) exceeds policy limit (${maxAmountInBig.toString()}).`,
      };
    }

    // 6. Verify EIP-712 User Signature using Viem
    const isValidSignature = await verifyTypedData({
      address: formattedUserAddress,
      domain: getEip712Domain(formattedEnforcerAddress),
      types: eip712Types,
      primaryType: "Policy",
      message: {
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
    });

    if (!isValidSignature) {
      return { valid: false, reason: "OFFCHAIN_REJECT: Invalid EIP-712 user signature." };
    }

    return { valid: true };
  } catch (error: any) {
    console.error("Error during off-chain policy verification:", error);
    return {
      valid: false,
      reason: `OFFCHAIN_REJECT: Verification error - ${error?.message || "Unknown error"}`,
    };
  }
}