import { verifyTypedData, Hex, Address } from 'viem';
import { EIP712_DOMAIN, EIP712_TYPES, PolicyStruct } from './eip712-types';

export interface VerifySignatureParams {
  policy: PolicyStruct;
  signature: Hex;
  userAddress: Address;
}

/**
 * Memverifikasi EIP-712 Signature secara off-chain (Layer 1 Pre-Check)
 * Memastikan tanda tangan valid dan berasal dari wallet address User yang sah.
 */
export async function verifyPolicySignature({
  policy,
  signature,
  userAddress,
}: VerifySignatureParams): Promise<boolean> {
  try {
    const isValid = await verifyTypedData({
      address: userAddress,
      domain: EIP712_DOMAIN,
      types: EIP712_TYPES,
      primaryType: 'Policy',
      message: policy,
      signature: signature,
    });

    if (!isValid) {
      throw new Error('EIP-712 Signature validation failed: Signer address mismatch.');
    }

    return true;
  } catch (error) {
    console.error('Failed off-chain EIP-712 signature verification:', error);
    throw new Error(
      `Signature Verification Error: ${error instanceof Error ? error.message : 'Invalid or compromised signature'}`
    );
  }
}