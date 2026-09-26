"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "id";

// ponytail: single flat dict, split per-section when >200 keys
const dict = {
  "nav.home": { en: "Home", id: "Beranda" },
  "nav.problem": { en: "Problem", id: "Masalah" },
  "nav.how": { en: "How It Works", id: "Cara Kerja" },
  "nav.why": { en: "Why Us", id: "Keunggulan" },
  "nav.tech": { en: "Technology", id: "Teknologi" },
  "nav.connect": { en: "Connect Wallet", id: "Hubungkan Wallet" },
  "nav.connecting": { en: "Connecting...", id: "Menghubungkan..." },
  "nav.disconnect": { en: "Disconnect", id: "Putus" },
  "hero.t1": { en: "Full Control", id: "Kendali Penuh" },
  "hero.t2": { en: "over AI Agents,", id: "AI Agent," },
  "hero.t3": { en: "Zero Compromise", id: "Tanpa Kompromi" },
  "hero.t4": { en: "on Security.", id: "Keamanan." },
  "hero.desc": {
    en: "IntentShield is an advanced security architecture for delegating Web3 transaction execution to AI. Combining Google Gemini, L1 mathematical verification, and Account Abstraction on Base.",
    id: "IntentShield adalah arsitektur keamanan tingkat lanjut untuk mendelegasikan eksekusi transaksi Web3 kepada AI. Menggabungkan Google Gemini, verifikasi matematis L1, dan Account Abstraction di jaringan Base.",
  },
  "hero.launch": { en: "Launch Dashboard App", id: "Buka Dashboard App" },
  "hero.docs": { en: "Read GitHub Docs", id: "Baca Dokumentasi GitHub" },
  "hero.l1desc": {
    en: "Security parameters locked and verified off-chain before execution.",
    id: "Parameter keamanan dikunci dan diverifikasi secara off-chain sebelum eksekusi.",
  },
  "hero.flow": { en: "AI → Intent → Verify", id: "AI → Intent → Verify" },
  "hero.flowdesc": {
    en: "AI never holds absolute control over the wallet.",
    id: "AI tidak memegang kendali mutlak atas wallet.",
  },
  "problem.title1": { en: "The Classic", id: "Masalah Klasik" },
  "problem.title2": { en: "AI Agent Problem:", id: "AI Agent:" },
  "problem.desc": {
    en: "Handing wallet control (private keys) to an AI program is traditionally very risky. If the model hallucinates, gets hacked (prompt injection), or miscalculates,",
    id: "Memberikan kontrol dompet (`private key`) kepada program AI secara tradisional sangat berisiko. Jika model kecerdasan buatan berhalusinasi, di-hack (prompt injection), atau tidak sengaja salah perhitungan,",
  },
  "problem.strong": {
    en: "your entire crypto assets could be drained in seconds.",
    id: "seluruh aset kripto Anda bisa terkuras dalam hitungan detik.",
  },
  "problem.li1": { en: "AI swaps fake tokens on its own.", id: "AI menukar token palsu secara mandiri." },
  "problem.li2": { en: "Transactions exceed extreme slippage limits.", id: "Transaksi melampaui batas slippage ekstrem." },
  "problem.li3": {
    en: 'Intruder attacks to drain wallet balance ("Wallet Draining Event").',
    id: 'Serangan penyusup untuk menguras saldo dompet ("Wallet Draining Event").',
  },
  "problem.risk": { en: "Balance Loss Risk: Very High · No Safeguards", id: "Risiko Kehilangan Saldo: Sangat Tinggi · No Safeguards" },
  "how.title": { en: "How IntentShield Works", id: "Cara Kerja IntentShield" },
  "how.desc": {
    en: 'Flipping the security paradigm. Execution decisions are encapsulated in an "Intent Core" with parametrically locked, on-chain constraints.',
    id: 'Membalikkan paradigma keamanan. Keputusan eksekusi dienkapsulasi menggunakan "Intent Core" dengan batasan parametrik yang dikunci secara on-chain.',
  },
  "how.s1t": { en: "User Input", id: "Input Pengguna" },
  "how.s1d": {
    en: 'Users type a specific command, e.g. "Swap max 300 USDC to ETH".',
    id: 'Pengguna mengetikkan perintah spesifik, misalnya "Swap maksimal 300 USDC ke ETH".',
  },
  "how.s2t": { en: "AI Intent Compiler", id: "AI Intent Compiler" },
  "how.s2d": {
    en: "Google Gemini API and backend convert text into a quantitative Draft JSON Policy.",
    id: "Google Gemini API dan Backend mengonversi teks menjadi Draft JSON Policy kuantitatif.",
  },
  "how.s3t": { en: "EIP-712 Signature", id: "EIP-712 Signature" },
  "how.s3d": {
    en: "Users approve security parameters with a gasless wallet signature.",
    id: "Pengguna menyetujui parameter keamanan menggunakan tanda tangan wallet tanpa gas fee.",
  },
  "how.s4t": { en: "L1 Verify & L2 Execute", id: "L1 Verify & L2 Execute" },
  "how.s4d": {
    en: "The system verifies the signature. Fail = Revert. If it passes, it forwards to the Base Smart Account.",
    id: "Sistem memverifikasi tanda tangan. Gagal = Revert. Jika lolos, diteruskan ke Base Smart Account.",
  },
  "why.c1t": { en: "Security Without", id: "Keamanan Tanpa" },
  "why.c1t2": { en: "Compromise", id: "Kompromi" },
  "why.c1d": {
    en: 'Even if the agent (AI) API is compromised and tries to execute a "Swap 10 Million USDC", the L1 Verifier smart contract cryptographically reverts the transaction for exceeding the "maxAmountIn" you signed.',
    id: 'Bahkan jika API agen (AI) disusupi dan mencoba mengeksekusi "Swap 10 Juta USDC", smart contract Verifier L1 akan menggagalkan transaksi (revert) secara kriptografis karena melebihi "maxAmountIn" yang Anda tanda tangani.',
  },
  "why.badge": { en: "Cryptographic Guard", id: "Cryptographic Guard" },
  "why.c2t": { en: "Natural", id: "Natural" },
  "why.c2t2": { en: "Experience", id: "Pengalaman" },
  "why.c2d": {
    en: "Forget the hassle of entering hexadecimal contract IDs or 18-decimal wei math. Gemini AI composes the heavy operational syntax from plain human language.",
    id: "Lupakan kerumitan memasukkan ID kontrak hexadecimal atau kalkulasi token wei 18-desimal. Gemini AI menyusun sintaks operasional berat hanya dengan bahasa manusia biasa.",
  },
  "why.ex": { en: "Example", id: "Contoh" },
  "why.quote": { en: '"Swap max 300 USDC to ETH"', id: '"Swap maksimal 300 USDC ke ETH"' },
  "tech.title": { en: "Built on Web3 & AI", id: "Dibangun di atas Web3 & AI" },
  "cta.title1": { en: "Own Your AI", id: "Kendalikan Keamanan" },
  "cta.title2": { en: "Execution Security Today.", id: "Eksekusi AI Hari Ini." },
  "cta.desc": {
    en: "Don't bet your wallet on AI hallucination odds. Install an absolute cryptographic Intent Shield.",
    id: 'Jangan pertaruhkan dompet Anda pada probabilitas halusinasi AI. Pasang "Pelindung Niat" kriptografis mutlak.',
  },
  "cta.btn": { en: "Try the IntentShield Demo Now", id: "Coba Demo IntentShield Sekarang" },
  "footer.proto": { en: "IntentShield Project — Hackathon Prototype.", id: "IntentShield Project — Prototipe Hackathon." },
  "footer.built": { en: "Built with", id: "Dipersiapkan dengan kerangka kerja" },
  "dash.heroA": { en: "Control Dashboard", id: "Dashboard Kontrol" },
  "dash.heroDesc": {
    en: "Test dual-layer protection (Off-Chain Verifier & On-Chain Enforcer) against autonomous agent transaction proposals, separately and interactively.",
    id: "Uji perlindungan ganda (Off-Chain Verifier & On-Chain Enforcer) terhadap proposal transaksi agen otonom, secara terpisah dan interaktif.",
  },
  "dash.s1t": { en: "Input Intent & Lock Policy", id: "Input Intent & Kunci Policy" },
  "dash.s1d": {
    en: "Define transaction permission limits using natural language.",
    id: "Tentukan batas izin transaksi dengan bahasa natural.",
  },
  "dash.locked": { en: "✓ Policy Locked", id: "✓ Policy Terkunci" },
  "dash.hint": { en: "User sets the maximum limit rule.", id: "Pengguna menetapkan aturan batas maksimal." },
  "dash.compile": { en: "Compile & Review Policy", id: "Compile & Review Policy" },
  "dash.compiling": { en: "Compiling...", id: "Mengompilasi..." },
  "dash.s2t": { en: "Agent Proposal Playground", id: "Playground Proposal Agen" },
  "dash.s2d": {
    en: "Simulate agent transaction execution against the locked User Policy.",
    id: "Simulasikan eksekusi transaksi agen terhadap User Policy yang terkunci.",
  },
  "dash.aTag": { en: "Scenario A", id: "Skenario A" },
  "dash.aTitle": { en: "Honest Agent Test (300 USDC)", id: "Uji Agen Jujur (300 USDC)" },
  "dash.aDesc": { en: "Proposal < User Limit. Transaction should pass.", id: "Proposal < Batas User. Transaksi harus lolos." },
  "dash.bTag": { en: "Scenario B", id: "Skenario B" },
  "dash.bTitle": { en: "Malicious Agent Test (5,000 USDC)", id: "Uji Agen Jahat (5.000 USDC)" },
  "dash.bDesc": { en: "Proposal > User Limit. Must be blocked by Layer 1.", id: "Proposal > Batas User. Harus diblokir Layer 1." },
  "dash.bypass": {
    en: "Bypass L1 verifier (malicious backend simulation — still blocked by L2)",
    id: "Lewati verifier L1 (simulasi backend jahat — tetap diblokir L2)",
  },
  "dash.custom": { en: "Custom Agent Proposal Amount (USDC)", id: "Nominal Proposal Agen Kustom (USDC)" },
  "dash.send": { en: "Send Agent Proposal", id: "Kirim Proposal Agen" },
  "dash.exec": { en: "Executing...", id: "Mengeksekusi..." },
  "dash.monT": { en: "Execution Monitor", id: "Monitor Eksekusi" },
  "dash.monD": { en: "Real-time verification pipeline status.", id: "Status pipeline verifikasi real-time." },
  "dash.logCompiler": { en: "01. AI Intent Compiler", id: "01. AI Intent Compiler" },
  "dash.logSign": { en: "02. EIP-712 User Sign", id: "02. EIP-712 User Sign" },
  "dash.logProposal": { en: "03. Agent Proposal Received", id: "03. Proposal Agen Diterima" },
  "dash.logL1": { en: "04. Layer 1 Verifier (Off-Chain)", id: "04. Layer 1 Verifier (Off-Chain)" },
  "dash.logL2": { en: "05. Layer 2 Enforcer (On-Chain)", id: "05. Layer 2 Enforcer (On-Chain)" },
  "dash.logResult": { en: "06. Blockchain Result", id: "06. Hasil Blockchain" },
  "dash.l1t": { en: "Layer 1 Off-Chain Rejected", id: "Layer 1 Off-Chain Ditolak" },
  "dash.l1d": { en: "An error occurred during Layer 1 verification", id: "Terjadi kesalahan saat verifikasi Layer 1" },
  "dash.l2t": { en: "Layer 2 On-Chain Rejected", id: "Layer 2 On-Chain Ditolak" },
  "dash.l2d": { en: "An error occurred during Layer 2 verification", id: "Terjadi kesalahan saat verifikasi Layer 2" },
  "dash.mTitle": { en: "Review & Sign Draft Policy", id: "Review & Tandatangani Draft Policy" },
  "dash.mDesc": { en: "Review and lock the rules before handing off to the agent.", id: "Periksa dan kunci aturan sebelum diserahkan ke agen." },
  "dash.maxAmt": { en: "Max Amount In (USDC):", id: "Jumlah Maksimal (USDC):" },
  "dash.maxSlip": { en: "Max Slippage Bps:", id: "Slippage Maks (Bps):" },
  "dash.exp": { en: "Expires At (minutes):", id: "Kedaluwarsa (menit):" },
  "dash.cancel": { en: "Cancel", id: "Batal" },
  "dash.approve": { en: "Approve & Sign (EIP-712)", id: "Setujui & Tandatangani (EIP-712)" },
  "dash.pTitle": { en: "Intent Execution Complete", id: "Eksekusi Intent Selesai" },
  "dash.pDesc": {
    en: "Off-chain and on-chain cryptographic proofs verified. Transaction executed safely within your approved limits.",
    id: "Bukti kriptografis off-chain dan on-chain terverifikasi. Transaksi dieksekusi aman dalam batas yang Anda setujui.",
  },
  "dash.net": { en: "Network", id: "Jaringan" },
  "dash.pair": { en: "Transaction Pair", id: "Pasangan Transaksi" },
  "dash.sec": { en: "Security Method", id: "Metode Keamanan" },
  "dash.ver": { en: "Verification Result", id: "Hasil Verifikasi" },
  "dash.verOk": { en: "Passed (Within Limit)", id: "Lolos (Dalam Batas)" },
  "dash.tx": { en: "Transaction Hash", id: "Hash Transaksi" },
  "dash.onchain": { en: "On-Chain Record", id: "Catatan On-Chain" },
  "dash.close": { en: "Close & Back", id: "Tutup & Kembali" },
  "dash.home": { en: "Home", id: "Beranda" },
} as const;

export type TKey = keyof typeof dict;

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: TKey) => string }>({
  lang: "en",
  setLang: () => {},
  t: (k) => dict[k].en,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() =>
    typeof window !== "undefined" && localStorage.getItem("is-lang") === "id" ? "id" : "en",
  );
  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("is-lang", l);
    document.documentElement.lang = l === "id" ? "id" : "en";
  };
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return <Ctx.Provider value={{ lang, setLang, t: (k) => dict[k][lang] }}>{children}</Ctx.Provider>;
}

export const useLang = () => useContext(Ctx);
