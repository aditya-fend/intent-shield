# Security Model & Rules

## Trust Matrix

| Component | Trust status | Role / Boundary |
| :--- | :--- | :--- |
| **User Signature (EIP-712)** | TRUSTED | Proves human approval of a specific policy. |
| **Smart Account (Solidity)** | TRUSTED | Final authorization boundary before execution. |
| **Base Sepolia Blockchain** | TRUSTED | Decentralized state consensus and execution. |
| **Gemini AI** | UNTRUSTED | Natural-language to draft-JSON policy parser. |
| **AI Agent Runner** | UNTRUSTED | Transaction proposal builder (may be compromised). |
| **Frontend & Backend / Supabase** | UNTRUSTED | UI and audit-trail metadata storage only. |

Rule: Supabase is never a source of authorization truth. Only a user EIP-712 signature authorizes. Only on-chain verification enforces.

## Core Security Property
*An authorized autonomous agent cannot successfully execute a supported blockchain swap through the IntentShield Smart Account when the swap violates the user's signed policy.*
