# Product Specification

## Definisi
IntentShield adalah layer keamanan (*policy enforcement layer*) untuk autonomous blockchain agents yang menerjemahkan intent bahasa alami manusia menjadi *authorization policy* yang ditandatangani oleh user, kemudian ditegakkan secara akurat terhadap transaksi blockchain aktual[cite: 1].

## Masalah yang Diseleksi
**Authorization ≠ Intent**[cite: 1]. Memberikan akses wallet ke AI Agent bukan berarti AI hanya akan melakukan apa yang dimaksudkan user[cite: 1]. Jika agent mengalami prompt injection atau terkompromi, agent bisa mengeksekusi transaksi dengan jumlah berlebih atau ke target berbahaya[cite: 1].

## Formula Utama
`HUMAN INTENT` → `STRUCTURED POLICY` → `USER SIGNATURE` → `POLICY COMMITMENT` → `LIMITED AGENT AUTHORITY` → `ACTUAL TRANSACTION` → `ON-CHAIN POLICY ENFORCEMENT` → `BLOCKCHAIN EXECUTION`[cite: 1]

## MVP Use Case (Base Sepolia)
* **Intent**: "Swap maksimal 500 USDC ke ETH di Uniswap dengan maksimal 1% slippage selama 1 jam."[cite: 1]
* **Valid Execution**: 300 USDC → ETH (Slippage <= 1%)[cite: 1]
* **Invalid Execution**: 5,000 USDC → ETH (Melanggar batas policy)[cite: 1]