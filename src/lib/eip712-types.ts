import { Address } from 'viem';

// Environment variable Smart Account Enforcer contract address
export const ENFORCER_CONTRACT_ADDRESS = (process.env
  .NEXT_PUBLIC_SMART_ACCOUNT_ENFORCER || '0x0000000000000000000000000000000000000000') as Address;

// EIP-712 Domain Definition untuk IntentShield di Base Sepolia (Chain ID: 84532)
export const EIP712_DOMAIN = {
  name: 'IntentShield',
  version: '1',
  chainId: 84532,
  verifyingContract: ENFORCER_CONTRACT_ADDRESS,
} as const;

// EIP-712 Types Struct untuk IntentShield Policy
export const EIP712_TYPES = {
  Policy: [
    { name: 'agent', type: 'address' },
    { name: 'action', type: 'string' },
    { name: 'tokenIn', type: 'address' },
    { name: 'tokenOut', type: 'address' },
    { name: 'maxAmountIn', type: 'uint256' },
    { name: 'allowedTarget', type: 'address' },
    { name: 'maxSlippageBps', type: 'uint256' },
    { name: 'expiresAt', type: 'uint256' },
    { name: 'nonce', type: 'uint256' },
  ],
} as const;

// Interface TypeScript untuk EIP-712 Policy Payload
export interface PolicyStruct {
  agent: Address;
  action: string;
  tokenIn: Address;
  tokenOut: Address;
  maxAmountIn: bigint;
  allowedTarget: Address;
  maxSlippageBps: bigint;
  expiresAt: bigint;
  nonce: bigint;
}

// Helper Function untuk menyusun Typed Data Payload EIP-712
export function getEIP712TypedData(policy: PolicyStruct) {
  return {
    domain: EIP712_DOMAIN,
    types: EIP712_TYPES,
    primaryType: 'Policy',
    message: policy,
  } as const;
}