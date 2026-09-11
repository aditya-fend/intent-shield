# Agent Workflow & Demo Scenarios

## Workflow Normal (Demo A)
1. User input: "Swap max 500 USDC ke ETH"[cite: 1].
2. Gemini hasilkan policy: `maxAmountIn: 500000000` (500 USDC)[cite: 1].
3. User meninjau dan Sign EIP-712[cite: 1].
4. Agent menerima otorisasi, mengambil quote Uniswap sebesar 300 USDC[cite: 1].
5. Off-chain verifier PASS -> Smart Account Validasi PASS -> **SUCCESS EXECUTED**[cite: 1].

## Workflow Malicious / Attack (Demo B)
1. Agent terkompromi/mencoba bertindak nakal dengan mengajukan swap 5,000 USDC (melebihi limit 500 USDC)[cite: 1].
2. Off-chain verifier mendeteksi pelanggaran dan merespons `REJECT`[cite: 1].
3. Agent mencoba melakukan bypass terhadap Off-chain Verifier dan mengirim transaksi langsung ke Smart Account[cite: 1].
4. Smart Account memvalidasi calldata terhadap policy -> **REVERTED ON-CHAIN**[cite: 1].