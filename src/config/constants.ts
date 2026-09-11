import { Address, parseUnits } from 'viem';

// Base Sepolia Smart Account Enforcer Contract Address
export const SMART_ACCOUNT_ENFORCER_ADDRESS = (process.env
  .NEXT_PUBLIC_SMART_ACCOUNT_ENFORCER || '0x0000000000000000000000000000000000000000') as Address;

// Base Sepolia USDC Address (Mock / Official Testnet TokenIn)
export const USDC_ADDRESS = (process.env
  .NEXT_PUBLIC_USDC_ADDRESS || '0x036Cb527753f487a5016f79A67972650cB2aD9b9') as Address;

// Base Sepolia WETH Address (TokenOut)
export const WETH_ADDRESS = (process.env
  .NEXT_PUBLIC_WETH_ADDRESS || '0x4200000000000000000000000000000000000006') as Address;

// Base Sepolia Uniswap V3 SwapRouter Address (AllowedTarget)
export const UNISWAP_V3_ROUTER_ADDRESS = (process.env
  .NEXT_PUBLIC_UNISWAP_ROUTER || '0x94cc041474862E38096D78297034E2730598b049') as Address;

// Chain Configuration
export const BASE_SEPOLIA_CHAIN_ID = 84532;

// Policy Default Parameters
export const DEFAULT_DECIMALS_USDC = 6;
export const DEFAULT_MAX_SLIPPAGE_BPS = 100n; // 1% = 100 bps
export const DEFAULT_EXPIRATION_SECONDS = 3600n; // 1 jam expiry

/**
 * Helper function untuk mengonversi jumlah USDC nominal manusia (misal: 500 USDC)
 * menjadi BigInt desimal 6 unit (500000000n).
 */
export function parseUsdcAmount(amountUsdc: number | string): bigint {
  return parseUnits(amountUsdc.toString(), DEFAULT_DECIMALS_USDC);
}