# IntentShield - AI Coding Agent Guidelines

Dokumen ini adalah panduan utama untuk AI Coding Agent (Cursor, Claude, Windsurf, Copilot, dll.) dalam memahami arsitektur, batasan keamanan, dan aturan pengodean project IntentShield.

## 📌 Indeks Dokumentasi (`docs/`)

1. **[Product Specification](docs/product.md)** — Definisi produk, masalah yang diselesaikan, use case MVP v2, dan cakupan fitur.
2. **[System Architecture](docs/architecture.md)** — Diagram alur data end-to-end, pemisahan layer untrusted vs trusted, dan komponen sistem.
3. **[Security Model & Rules](docs/security-model.md)** — Batasan ketat apa yang BISA dan TIDAK BISA dilakukan oleh AI, backend, dan smart account.
4. **[Blockchain & Protocol Details](docs/blockchain.md)** — Spesifikasi Base Sepolia, Smart Account, USDC, WETH, dan Uniswap Router.
5. **[Agent Workflow](docs/agent-workflow.md)** — Alur eksekusi agent, pembentukan transaction proposal, dan mekanisme demo serangan (*malicious agent*).
6. **[Smart Account & Contracts](docs/smart-account.md)** — Spesifikasi Solidity, skema EIP-712, on-chain enforcement logic, dan state management.
7. **[Threat Model & Attack Scenarios](docs/threat-model.md)** — Pemodelan ancaman (compromised agent, prompt injection, backend hack) dan penanganannya.
8. **[Architecture Decision Records (ADR)](docs/decisions.md)** — Keputusan teknis penting dan alasan di baliknya.

---

## ⛔ CRITICAL CODING RULES FOR AI AGENTS

1. **Prinsip Separation of Responsibility**:
   - **Gemini / AI Agent / Backend / Frontend** = `UNTRUSTED` (Tidak boleh menjadi otoritas keamanan final)[cite: 1].
   - **Smart Account / Cryptographic Signature / On-Chain Verification** = `TRUSTED` (Otoritas keamanan final)[cite: 1].
2. **Aturan EIP-712**:
   - Dilarang keras menganggap database (Supabase) sebagai sumber kebenaran otorisasi[cite: 1]. Otorisasi HANYA sah melalui EIP-712 signature pengguna[cite: 1].
3. **Cakupan MVP yang Diizinkan**:
   - **HANYA** mendukung 1 jenis transaksi: Swap **USDC → ETH (WETH)** via **Uniswap** di network **Base Sepolia**[cite: 1].
   - Dilarang menambahkan jenis transaksi lain (lending, NFT, bridge, dll.) untuk MVP[cite: 1].