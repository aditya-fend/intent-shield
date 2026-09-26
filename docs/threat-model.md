# Threat Model & Mitigation

## 1. Compromised / Rogue AI Agent
* **Threat**: agent builds a transaction draining funds to an attacker wallet or inflating the swap amount.
* **Mitigation**: the Smart Account only executes calldata whose target is the registered `allowedTarget` and whose `amountIn` is within `maxAmountIn`.

## 2. Prompt Injection on the Gemini Compiler
* **Threat**: attacker crafts a prompt tricking Gemini into producing a policy with a giant limit.
* **Mitigation**: mandatory **User Review** layer — the user reads and approves exact parameters before signing.

## 3. Malicious Backend / Supabase Compromise
* **Threat**: attacker edits a Supabase row from 500 USDC to 5,000 USDC.
* **Mitigation**: the Smart Account validates the EIP-712 signature, NOT Supabase data. Forged rows fail Layer 1 and always fail Layer 2.
