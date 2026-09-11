# Security Model & Rules

## Trust Matrix

| Komponen | Status Trust | Peran / Boundary |
| :--- | :--- | :--- |
| **User Signature (EIP-712)** | TRUSTED | Membuktikan persetujuan manusia atas kebijakan tertentu[cite: 1]. |
| **Smart Account (Solidity)** | TRUSTED | Penegak batas otorisasi akhir sebelum transaksi dieksekusi[cite: 1]. |
| **Base Sepolia Blockchain** | TRUSTED | Konsensus state dan eksekusi transaksi terdecentralisasi[cite: 1]. |
| **Gemini AI** | UNTRUSTED | Parser penerjemah bahasa alami ke draft JSON policy[cite: 1]. |
| **AI Agent Runner** | UNTRUSTED | Pembuat proposal transaksi (bisa saja terkompromi)[cite: 1]. |
| **Frontend & Backend / Supabase**| UNTRUSTED | UI dan penyimpanan metadata audit trail saja[cite: 1]. |

[cite: 1]

## Core Security Property
*An authorized autonomous agent cannot successfully execute a supported blockchain swap through the IntentShield Smart Account when the swap violates the user's signed policy.*[cite: 1]