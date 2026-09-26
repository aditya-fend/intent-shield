# IntentShield

Policy enforcement layer for autonomous blockchain agents: human intent → user-signed policy → on-chain enforcement. MVP scope is one transaction type only: **USDC → ETH (WETH) swap via Uniswap V3 on Base Sepolia (chain 84532)**.

Core property: *an authorized agent cannot execute a supported swap through the Smart Account when it violates the user's signed policy.*

## Problem

**Authorization ≠ Intent.** Wallet access is not intent. A prompt-injected or compromised agent can overspend or call a malicious target. IntentShield bounds delegation so the agent proposes, but the signed policy disposes.

## How It Works

```
Intent (NL) → Gemini draft JSON → User review → EIP-712 sign
→ Agent proposal (calldata) → L1 off-chain check → L2 on-chain enforce → Uniswap execution
```

1. User types intent, e.g. "Swap up to 500 USDC to ETH, max 1% slippage, 1 hour".
2. `POST /api/compile-intent` (Gemini, `action` forced to `"swap"`) returns draft policy.
3. User edits exact values in the modal and signs EIP-712 (`IntentShield v1`, 9-field `Policy`).
4. `POST /api/agent` builds `exactInputSingle` params, runs **L1** `verifyPolicyOffChain`, then **L2** `IntentShieldEnforcer.executeWithPolicy`.
5. Result is logged to Supabase `executions` and shown on the dashboard proof view.

## Trust Boundary

| Component | Status | Rule |
|---|---|---|
| EIP-712 signature, `IntentShieldEnforcer.sol`, Base Sepolia | TRUSTED | Final authority |
| Gemini, agent runner, Next.js API, Supabase, frontend | UNTRUSTED | Never authorize; Supabase rows never grant rights |

Defense-in-depth: L1 (`src/lib/offchain-verifier.ts`) rejects fast to save gas and improve UX; L2 (Solidity: signature, agent, expiry, nonce, `amountIn <= maxAmountIn`, target/recipient) reverts what L1 misses.

## MVP Scope

Allowed: `exactInputSingle` USDC → WETH through the registered router. Not allowed: anything else (lending, NFT, bridge, arbitrary calls). See `docs/product.md`, `docs/blockchain.md`.

## Tech Stack

Next.js 16 + React 19, Foundry (Solidity `^0.8.24`), viem/wagmi + RainbowKit, Gemini (`@google/genai`), Supabase (`executions` audit trail). Package manager: `pnpm`.

## Repo Layout

```
contracts/IntentShieldEnforcer.sol  # L2 enforcer, EIP-712, nonce, swap checks
src/app/api/compile-intent/route.ts # Gemini intent → draft policy
src/app/api/agent/route.ts          # L1 check → L2 execute → Supabase log
src/app/api/verify/route.ts         # verification helper
src/lib/eip712-types.ts             # domain, types, PolicyStruct
src/lib/offchain-verifier.ts        # L1 verifier
src/config/constants.ts             # chain, token, router addresses + defaults
src/app/dashboard/page.tsx          # demo UI (Demo A/B + bypass toggle)
docs/                               # full spec (8 files)
```

## Quickstart

```bash
pnpm install
cp .env.example .env  # ponytail: create this file if missing; needs the 7 vars below
pnpm dev               # http://localhost:3000, open /dashboard
```

Required env:

```
NEXT_PUBLIC_SMART_ACCOUNT_ENFORCER=0x...
NEXT_PUBLIC_USDC_ADDRESS=0x036Cb527753f487a5016f79A67972650cB2aD9b9
NEXT_PUBLIC_WETH_ADDRESS=0x4200000000000000000000000000000000000006
NEXT_PUBLIC_UNISWAP_ROUTER=0x94cc041474862E38096D78297034E2730598b049
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
GEMINI_API_KEY=...
AGENT_PRIVATE_KEY=...  # server-only, funds the L2 submission testnet wallet
```

Contract (Base Sepolia):

```bash
forge build
forge test
forge script script/Deploy.s.sol --rpc-url $RPC_URL --broadcast
```

## Demo

- **Demo A (valid):** policy max 500 USDC → propose 300 USDC → L1 PASS → L2 PASS → `SUCCESS_ONCHAIN`.
- **Demo B (attack):** propose 5,000 USDC → L1 `REJECTED_OFFCHAIN`. Toggle bypass → L2 `REVERTED_ONCHAIN` (`AmountExceedsPolicyLimit`).

## Docs Index

1. [Product](docs/product.md) — definition, formula, MVP case.
2. [Architecture](docs/architecture.md) — diagrams, trust split, L1/L2, flow.
3. [Security Model](docs/security-model.md) — trust matrix, core property.
4. [Blockchain](docs/blockchain.md) — network, addresses, limits.
5. [Agent Workflow](docs/agent-workflow.md) — Demo A/B.
6. [Smart Account](docs/smart-account.md) — EIP-712 struct, Solidity checks.
7. [Threat Model](docs/threat-model.md) — rogue agent, prompt injection, backend compromise.
8. [Decisions](docs/decisions.md) — ADR 001–003.
