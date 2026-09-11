# System Architecture & Technical Flow

Dokumen ini menjelaskan arsitektur teknis end-to-end, pemisahan layer _untrusted_ vs _trusted_, alur data transaksi, dan mekanisme _defense-in-depth_ pada IntentShield MVP v2[cite: 1].

---

## 1. System Architecture Diagram

USER
│
│ Natural Language Intent
▼
GEMINI (Untrusted Parser)
│
│ Draft Policy (JSON)
▼
USER REVIEW & EDIT (Frontend / Wallet)
│
│ Approved Final Policy
▼
EIP-712 TYPED SIGNATURE (User Private Key)
│
│ Signature & Policy Commitment
▼
SMART ACCOUNT (On-Chain Policy Commitment)
│
│ Bounded Delegation Authority
▼
AI AGENT (Untrusted Runner)
│
│ Transaction Proposal (Calldata & Target)
▼
OFF-CHAIN VERIFIER (Layer 1 Check for UX)
│
┌─────┴─────┐
│ │
REJECT PASS
│ │
│ ▼
│ SMART ACCOUNT (Layer 2 On-Chain Enforcement)
│ │
│ ON-CHAIN CHECK (Signature, Calldata, Limits)
│ │
│ ┌────┴────┐
│ │ │
│ REJECT PASS
│ │ │
│ │ ▼
│ │ BLOCKCHAIN EXECUTION (Base Sepolia)
│ │ │
└──────┴─────────┴─────────► AUDIT TRAIL / PROOF PAGE

---

## 2. Separation of Responsibility & Trust Boundaries

IntentShield menerapkan prinsip ketat **Separation of Responsibility**[cite: 1]. Setiap komponen dikategorikan berdasarkan batas kepercayaannya (_trust boundary_)[cite: 1]:

┌─────────────────────────────────────────────────────────┐
│ UNTRUSTED │
│ │
│ Gemini API ──► AI Agent ──► Backend API ──► Frontend │
│ │
└──────────────────────────┬──────────────────────────────┘
│ Transaction Proposal
▼
┌─────────────────────────────────────────────────────────┐
│ OFF-CHAIN CHECK │
│ │
│ Layer 1 Off-Chain Verifier │
└──────────────────────────┬──────────────────────────────┘
│ Validated Calldata
▼
┌─────────────────────────────────────────────────────────┐
│ TRUSTED │
│ │
│ Smart Account ──► User EIP-712 Signature ──► Base Chain│
│ │
└─────────────────────────────────────────────────────────┘

### UNTRUSTED Components (Tidak Boleh Menjadi Security Boundary Final)

- **Gemini (AI Model)**: Hanya bertugas merespons dan mengonversi _natural language_ menjadi _draft policy_ JSON[cite: 1]. Tidak memiliki otoritas membuat keputusan akhir[cite: 1].
- **AI Agent Runner**: Bertugas mencari quote (misal via Uniswap) dan menyusun _transaction proposal_[cite: 1]. Mengingat agent bisa mengalami _prompt injection_ atau _hack_, output agent selalu dianggap berpotensi _malicious_[cite: 1].
- **Backend API & Supabase**: Hanya berfungsi menyimpan metadata, mendengarkan event, dan memfasilitasi komunikasi UX[cite: 1]. Perubahan data di Supabase tidak pernah menambah hak akses on-chain[cite: 1].
- **Frontend UI**: Media interaksi user[cite: 1]. User selalu memverifikasi parameter mentah via modal approval wallet sebelum menandatangani[cite: 1].

### TRUSTED Components (Otoritas Keamanan Utama)

- **User EIP-712 Signature**: Bukti otorisasi langsung dari _private key_ pengguna atas struktur kebijakan yang jelas[cite: 1].
- **Smart Account (Solidity Enforcer)**: Kontrak _smart contract_ yang memegang aset dan mengeksekusi _on-chain policy enforcement_ secara deterministik sebelum memanggil target protocol[cite: 1].
- **Base Sepolia Blockchain**: Lapisan konsensus eksekusi transaksi yang mutlak dan _immutable_[cite: 1].

---

## 3. Defense-In-Depth: Dual-Layer Verification

IntentShield mengeksekusi dua tingkatan verifikasi transaksi untuk mengoptimalkan biaya _gas fee_ sekaligus menjaga tingkat keamanan mutlak[cite: 1]:

Transaction Proposal (Calldata, Target, Value)
│
▼
┌─────────────────────────────────────┐
│ Layer 1: Off-Chain Verifier │
│ - Fast UX Feedback │
│ - Early Error Detection │
│ - Saves Gas Fees on Rejections │
└──────────────────┬──────────────────┘
│
┌────────┴────────┐
│ │
REJECT PASS
│ │
(Stop Submission) ▼
┌─────────────────────────────────────┐
│ Layer 2: On-Chain Smart Account │
│ - Cryptographic Signature Verification│
│ - Calldata Inspection & Parsing │
│ - Deterministic Constraint Checking │
└──────────────────┬──────────────────┘
│
┌────────┴────────┐
│ │
REVERT EXECUTE

1. **Layer 1 (Off-Chain Verifier)**:
   - **Lokasi**: Node.js / Next.js Server Subsystem[cite: 1].
   - **Fungsi**: Membedah (_decode_) calldata yang diajukan oleh AI Agent dan membandingkannya secara off-chain dengan policy pengguna[cite: 1].
   - **Tujuan**: Mencegah pengiriman transaksi gagal ke jaringan (_early reject_) guna menghemat biaya _gas_ dan memberikan feedback visual secara cepat[cite: 1].

2. **Layer 2 (On-Chain Enforcer / Smart Account)**:
   - **Lokasi**: Smart Contract di Base Sepolia[cite: 1].
   - **Fungsi**: Menerima _payload_, memverifikasi Tanda Tangan EIP-712 User, membongkar parameter calldata swap langsung di EVM, dan mematikan eksekusi (`revert`) jika terjadi pelanggaran[cite: 1].
   - **Tujuan**: Menjadi benteng keamanan utama (_ultimate security boundary_) yang tidak dapat dibypass oleh backend yang terkompromi maupun agent yang nakal[cite: 1].

---

## 4. End-to-End Execution Flow Summary

[User Input Intent]
│
▼
[Gemini Parse to Draft Policy]
│
▼
[User Review & Edit in UI]
│
▼
[User Sign Typed Data (EIP-712)]
│
▼
[Commit Policy On-Chain / Session]
│
▼
[Agent Receives Limited Auth & Fetches Quote]
│
▼
[Agent Generates Tx Proposal (Uniswap Calldata)]
│
▼
[Off-Chain Pre-Check] ──(If Violates)──► [REJECT: Logged & Stopped]
│
(If Passed)
│
▼
[Submit Tx to Smart Account]
│
▼
[On-Chain Validation Logic] ──(If Violates)──► [REVERT: Tx Failed On-Chain]
│
(If Valid)
│
▼
[Execute Swap on Uniswap V3 Router]
│
▼
[Emit Event & Update Proof Page Audit Trail]
