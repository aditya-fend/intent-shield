# Architecture Decision Records (ADR)

## ADR 001: Penggunaan Base Sepolia
* **Status**: Accepted[cite: 1]
* **Context**: Membutuhkan lingkungan EVM testnet cepat dan murah yang didukung oleh ekosistem infrastruktur modern[cite: 1].
* **Decision**: Menggunakan Base Sepolia sebagai satu-satunya testnet resmi untuk MVP[cite: 1].

## ADR 002: Mengeliminasi Pembelian Laptop / Web2 Asset
* **Status**: Accepted[cite: 1]
* **Context**: Aset dunia nyata (seperti laptop) tidak memiliki verifikasi native on-chain, mempercayai oracle/API luar yang lemah[cite: 1].
* **Decision**: Mengganti use-case laptop dengan Crypto-Native Swap (USDC → ETH) yang 100% dapat diverifikasi di blockchain[cite: 1].

## ADR 003: Pemisahan Layer Off-Chain Verifier & On-Chain Enforcer
* **Status**: Accepted[cite: 1]
* **Context**: Mengeksekusi transaksi yang melanggar policy di blockchain akan membuang gas fee[cite: 1].
* **Decision**: Menggunakan verifier off-chain sebagai penyaring awal untuk UX, serta Smart Account sebagai benteng akhir pertahanan (*Defense-in-Depth*)[cite: 1].