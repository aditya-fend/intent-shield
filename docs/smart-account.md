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
```
See `src/lib/eip712-types.ts` for the canonical domain, types, and `PolicyStruct`.

## Smart Contract Checks (Solidity Logic)
When `executeWithPolicy(Policy policy, bytes signature, ExactInputSingleParams swapParams)` is called (`contracts/IntentShieldEnforcer.sol`):
1. Verify `msg.sender == policy.agent`.
2. Check `block.timestamp <= expiresAt`, else `PolicyExpired`.
3. Check `usedNonces[nonce]` is false (replay protection), else `NonceAlreadyUsed`.
4. Verify owner EIP-712 signature, else `InvalidSignature`.
5. Enforce hard constraints: `action == "swap"`, `tokenIn`/`tokenOut` match, `amountIn <= maxAmountIn`, `recipient` is the enforcer or `allowedTarget`. Else revert.
6. Mark nonce used, `approve` + `exactInputSingle` on the router, emit `PolicyExecuted`.
