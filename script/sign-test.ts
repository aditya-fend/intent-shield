import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import { getAddress, type Hex } from "viem";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const USER_PRIVATE_KEY = (process.env.PRIVATE_KEY || "0xYOUR_PRIVATE_KEY") as Hex;
const ENFORCER_ADDRESS = (process.env.NEXT_PUBLIC_SMART_ACCOUNT_ENFORCER || "0x94cc041474862e38096d78297034e2730598b049") as Hex;

const account = privateKeyToAccount(USER_PRIVATE_KEY);

// Data harus 100% identik dengan request di curl
const draftPolicy = {
  agent: getAddress("0xa2d7d9C05597153b222ED0B1eA445FD5Db0F86d7"),
  action: "swap",
  tokenIn: getAddress("0x036cb527753f487a5016f79a67972650cb2ad9b9"),
  tokenOut: getAddress("0x4200000000000000000000000000000000000006"),
  maxAmountIn: BigInt("500000000"), // 500 USDC
  allowedTarget: getAddress("0x94cc041474862e38096d78297034e2730598b049"),
  maxSlippageBps: BigInt(50),
  expiresAt: BigInt(1789150988),
  nonce: BigInt(829374102),
};

const domain = {
  name: "IntentShield",
  version: "1",
  chainId: baseSepolia.id,
  verifyingContract: getAddress(ENFORCER_ADDRESS),
} as const;

const types = {
  Policy: [
    { name: "agent", type: "address" },
    { name: "action", type: "string" },
    { name: "tokenIn", type: "address" },
    { name: "tokenOut", type: "address" },
    { name: "maxAmountIn", type: "uint256" },
    { name: "allowedTarget", type: "address" },
    { name: "maxSlippageBps", type: "uint256" },
    { name: "expiresAt", type: "uint256" },
    { name: "nonce", type: "uint256" },
  ],
} as const;

async function generateSignature() {
  const signature = await account.signTypedData({
    domain,
    types,
    primaryType: "Policy",
    message: draftPolicy,
  });

  console.log("\n=================== EIP-712 SIGNATURE ===================");
  console.log(`User Address : ${account.address}`);
  console.log(`Signature    : ${signature}`);
  console.log("=========================================================\n");
}

generateSignature();