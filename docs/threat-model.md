# Threat Model & Mitigation

## 1. Compromised / Rogue AI Agent
* **Threat**: Agent membuat transaksi yang mengalirkan dana ke wallet attacker atau jumlah swap yang membengkak[cite: 1].
* **Mitigation**: Smart Account hanya mengeksekusi calldata yang `target`-nya terdaftar (`allowedTarget`) dan `amountIn`-nya berada di bawah limit `maxAmountIn`[cite: 1].

## 2. Prompt Injection pada Gemini Compiler
* **Threat**: User/Penyerang mencoba memasukkan prompt jebakan agar Gemini membuat policy dengan limit raksasa[cite: 1].
* **Mitigation**: Layer **User Review** mewajibkan user membaca dan menyetujui parameter persis sebelum menandatangani[cite: 1].

## 3. Malicious Backend / Supabase Compromise
* **Threat**: Attacker mengubah record di Supabase dari 500 USDC menjadi 5,000 USDC[cite: 1].
* **Mitigation**: Smart Account mengecek keabsahan dari EIP-712 signature, BUKAN dari data Supabase[cite: 1].