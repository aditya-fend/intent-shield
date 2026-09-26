# Agent Workflow & Demo Scenarios

## Normal Workflow (Demo A)
1. User input: "Swap max 500 USDC to ETH".
2. Gemini produces policy: `maxAmountIn: 500000000` (500 USDC, 6 decimals).
3. User reviews and signs EIP-712.
4. Agent receives authorization, fetches a Uniswap quote for 300 USDC.
5. Off-chain verifier PASS → Smart Account validation PASS → **SUCCESS EXECUTED**.

## Malicious / Attack Workflow (Demo B)
1. Compromised agent proposes a 5,000 USDC swap (exceeds the 500 USDC limit).
2. Off-chain verifier detects the violation and returns `REJECT`.
3. Agent tries to bypass the off-chain verifier and submits directly to the Smart Account.
4. Smart Account validates calldata against the signed policy → **REVERTED ON-CHAIN**.
