# Smart Account & EIP-712 Specification

## EIP-712 Typed Data Structure
```typescript
const domain = {
  name: 'IntentShield',
  version: '1',
  chainId: 84532,
  verifyingContract: '0x...SmartAccountEnforcer'
};

const types = {
  Policy: [
    { name: 'agent', type: 'address' },
    { name: 'action', type: 'string' },
    { name: 'tokenIn', type: 'address' },
    { name: 'tokenOut', type: 'address' },
    { name: 'maxAmountIn', type: 'uint256' },
    { name: 'allowedTarget', type: 'address' },
    { name: 'maxSlippageBps', type: 'uint256' },
    { name: 'expiresAt', type: 'uint256' },
    { name: 'nonce', type: 'uint256' }
  ]
};
```[cite: 1]

## Smart Contract Checks (Solidity Logic)
Saat `executeWithPolicy(bytes calldata policy, bytes calldata signature, bytes calldata txCalldata)` dipanggil[cite: 1]:
1. Verifikasi `signature` terhadap `policy` (harus berasal dari User/Owner)[cite: 1].
2. Cek `msg.sender` / `agent` identity[cite: 1].
3. Cek `block.timestamp <= expiresAt`[cite: 1].
4. Decode `txCalldata` Uniswap: Cek apakah `amountIn <= maxAmountIn` dan `recipient == SmartAccount`[cite: 1].
5. Eksekusi swap jika semua lolos, atau `revert("PolicyViolation")` jika ada yang melanggar[cite: 1].