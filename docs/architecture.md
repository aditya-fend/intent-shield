# System Architecture & Technical Flow

End-to-end architecture, untrusted vs trusted separation, transaction data flow, and defense-in-depth for IntentShield MVP v2.

---

## 1. System Architecture Diagram

```
USER
│ Natural Language Intent
▼
GEMINI (Untrusted Parser)
│ Draft Policy (JSON)
▼
USER REVIEW & EDIT (Frontend / Wallet)
│ Approved Final Policy
▼
EIP-712 TYPED SIGNATURE (User Private Key)
│ Signature & Policy Commitment
▼
SMART ACCOUNT (On-Chain Policy Commitment)
│ Bounded Delegation Authority
▼
AI AGENT (Untrusted Runner)
│ Transaction Proposal (Calldata & Target)
▼
OFF-CHAIN VERIFIER (Layer 1 Check for UX)
│
┌─────┴─────┐
│           │
REJECT      PASS
│           │
│           ▼
│           SMART ACCOUNT (Layer 2 On-Chain Enforcement)
│           │ ON-CHAIN CHECK (Signature, Calldata, Limits)
│           │ ┌────┴────┐
│           │ │         │
│           │ REJECT    PASS
│           │ │         │
│           │ │         ▼
│           │ │         BLOCKCHAIN EXECUTION (Base Sepolia)
└───────────┴─────────┴───► AUDIT TRAIL / PROOF PAGE
```

---

## 2. Separation of Responsibility & Trust Boundaries

Strict **Separation of Responsibility**. Every component is classified by its trust boundary:

### UNTRUSTED (must never be the final security boundary)

- **Gemini (AI model)**: converts natural language into draft policy JSON only. No final authority.
- **AI Agent Runner**: fetches quotes (e.g. via Uniswap) and builds transaction proposals. Output is always treated as potentially malicious (prompt injection / hack).
- **Backend API & Supabase**: stores metadata, listens to events, serves UX. A Supabase row change never grants on-chain rights.
- **Frontend UI**: user interaction only. The user verifies raw parameters in the wallet approval modal before signing.

### TRUSTED (final security authority)

- **User EIP-712 Signature**: direct authorization proof from the user's private key over an explicit policy struct.
- **Smart Account (Solidity Enforcer)**: holds assets and runs deterministic on-chain policy enforcement before calling the target protocol.
- **Base Sepolia Blockchain**: immutable consensus and execution layer.

---

## 3. Defense-in-Depth: Dual-Layer Verification

Two verification layers: save gas with fast off-chain rejection, guarantee security on-chain.

```
Transaction Proposal (Calldata, Target, Value)
│
▼
┌─────────────────────────────────────┐
│ Layer 1: Off-Chain Verifier         │
│ - Fast UX feedback                  │
│ - Early error detection             │
│ - Saves gas on rejections           │
└──────────────────┬──────────────────┘
│
┌────────┴────────┐
│                 │
REJECT            PASS (Stop submission vs continue)
                  ▼
┌─────────────────────────────────────┐
│ Layer 2: On-Chain Smart Account     │
│ - Signature verification            │
│ - Calldata inspection & parsing     │
│ - Deterministic constraint checks   │
└──────────────────┬──────────────────┘
│
┌────────┴────────┐
│                 │
REVERT            EXECUTE
```

1. **Layer 1 (Off-Chain Verifier)** — `src/lib/offchain-verifier.ts`, invoked from `src/app/api/agent/route.ts`. Decodes agent-submitted calldata and compares it off-chain against the user policy. Early reject saves gas and gives fast visual feedback.
2. **Layer 2 (On-Chain Enforcer)** — `contracts/IntentShieldEnforcer.sol` on Base Sepolia. Verifies the user EIP-712 signature, unpacks swap params in the EVM, and `revert`s on any violation. This is the ultimate security boundary: neither a compromised backend nor a rogue agent can bypass it.

---

## 4. End-to-End Execution Flow

```
[User Input Intent]
▼
[Gemini Parses to Draft Policy]
▼
[User Reviews & Edits in UI]
▼
[User Signs Typed Data (EIP-712)]
▼
[Commit Policy On-Chain / Session]
▼
[Agent Receives Limited Auth & Fetches Quote]
▼
[Agent Generates Tx Proposal (Uniswap Calldata)]
▼
[Off-Chain Pre-Check] ──(violates)──► [REJECT: Logged & Stopped]
│ (passes)
▼
[Submit Tx to Smart Account]
▼
[On-Chain Validation] ──(violates)──► [REVERT: Tx Failed On-Chain]
│ (valid)
▼
[Execute Swap on Uniswap V3 Router]
▼
[Emit Event & Update Proof Page Audit Trail]
```
