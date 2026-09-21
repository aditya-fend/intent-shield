import { NextResponse } from "next/server";
import { ai, GEMINI_MODEL } from "@/lib/gemini";
import { Type, Schema } from "@google/genai";

// Alamat Default Base Sepolia Testnet
const DEFAULT_AGENT_ADDRESS = "0x1234567890123456789012345678901234567890";
const BASE_SEPOLIA_USDC = "0x036Cb527753f487a5016f79A67972650cB2aD9b9";
const BASE_SEPOLIA_WETH = "0x4200000000000000000000000000000000000006";
const UNISWAP_V3_ROUTER = "0x94cc041474862E38096D78297034E2730598b049";

// Definisi JSON Schema untuk responseSchema Gemini
const policySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    agent: {
      type: Type.STRING,
      description: "Alamat Ethereum agent",
    },
    action: {
      type: Type.STRING,
      description: "Aksi transaksi (harus 'swap')",
    },
    tokenIn: {
      type: Type.STRING,
      description: "Alamat kontrak token asal (default USDC)",
    },
    tokenOut: {
      type: Type.STRING,
      description: "Alamat kontrak token tujuan (default WETH)",
    },
    maxAmountIn: {
      type: Type.STRING,
      description: "Batas maksimal token asal dalam unit dasar (6 desimal untuk USDC). Misal: 50 USDC = 50000000",
    },
    allowedTarget: {
      type: Type.STRING,
      description: "Alamat target DEX / Swap Router yang diizinkan",
    },
    maxSlippageBps: {
      type: Type.INTEGER,
      description: "Batas toleransi slippage dalam basis points (1% = 100, 0.5% = 50)",
    },
    expiresAt: {
      type: Type.INTEGER,
      description: "Unix timestamp dalam detik kapan policy ini kedaluwarsa",
    },
    nonce: {
      type: Type.INTEGER,
      description: "Angka acak unik (nonce) untuk mencegah replay attack",
    },
  },
  required: [
    "agent",
    "action",
    "tokenIn",
    "tokenOut",
    "maxAmountIn",
    "allowedTarget",
    "maxSlippageBps",
    "expiresAt",
    "nonce",
  ],
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, userAddress } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { success: false, error: "Prompt is required and must be a string." },
        { status: 400 }
      );
    }

    const currentTimestamp = Math.floor(Date.now() / 1000);
    const defaultExpiresAt = currentTimestamp + 3600; // Default 1 jam dari sekarang
    const randomNonce = Math.floor(Math.random() * 1000000000);

    const systemInstruction = `
Kamu adalah Intent Compiler cerdas untuk infrastruktur IntentShield di Base Sepolia.
Tugas utama kamu adalah mengekstrak niat (intent) transaksi dari instruksi teks pengguna menjadi objek JSON "Draft Policy" yang presisi.

ATURAN STRICT:
1. 'action' HANYA BOLEH bernilai 'swap'.
2. Default 'agent' adalah: "${DEFAULT_AGENT_ADDRESS}".
3. Default 'tokenIn' (USDC Base Sepolia) adalah: "${BASE_SEPOLIA_USDC}".
4. Default 'tokenOut' (WETH Base Sepolia) adalah: "${BASE_SEPOLIA_WETH}".
5. Default 'allowedTarget' (Uniswap Router) adalah: "${UNISWAP_V3_ROUTER}".
6. 'maxAmountIn' HARUS berupa string angka konversi desimal token (USDC menggunakan 6 desimal). 
   - Contoh: 500 USDC -> "500000000" (500 * 10^6).
   - Contoh: 10 USDC -> "10000000" (10 * 10^6).
7. 'maxSlippageBps' dihitung dalam basis points (1% = 100, 0.5% = 50). Jika pengguna tidak menyebutkan, gunakan default 100 (1%).
8. 'expiresAt' berupa Unix Timestamp detik. Jika pengguna menyebutkan waktu (misal "dalam 2 jam"), hitung dari waktu sekarang (${currentTimestamp}). Jika tidak ada, gunakan default: ${defaultExpiresAt}.
9. 'nonce' HARUS berisi angka acak unik integer, contoh: ${randomNonce}.
10. Pengguna yang meminta policy ini memiliki address: "${userAddress || '0x0000000000000000000000000000000000000000'}".

Kembalikan HANYA data JSON sesuai dengan schema tanpa teks tambahan atau penjelasan markdown.
`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: policySchema,
        temperature: 0.1, // Rendah agar hasil deterministic
      },
    });

    const responseText = response.text;

    if (!responseText) {
      throw new Error("Empty response received from Gemini API");
    }

    const draftPolicy = JSON.parse(responseText);

    return NextResponse.json({
      success: true,
      draftPolicy,
    });

  } catch (error: any) {
    console.error("Error in compile-intent API Route:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to compile intent using Gemini API",
      },
      { status: 500 }
    );
  }
}