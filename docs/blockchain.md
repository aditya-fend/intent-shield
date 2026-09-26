# Blockchain & Protocol Details

## Target Network
* **Network name**: Base Sepolia Testnet
* **Chain ID**: `84532`

## Contract Addresses & Assets
* **USDC (TokenIn)**: `0x036Cb527753f487a5016f79A67972650cB2aD9b9` (6 decimals)
* **WETH / ETH (TokenOut)**: `0x4200000000000000000000000000000000000006`
* **Target protocol**: Uniswap V3 SwapRouter `0x94cc041474862E38096D78297034E2730598b049`
* **Enforcer**: `IntentShieldEnforcer.sol` address via `NEXT_PUBLIC_SMART_ACCOUNT_ENFORCER`

Defaults (see `src/config/constants.ts`): 1% max slippage (`100` bps), 1-hour expiry (`3600`s).

## Transaction Type Limits
* Only `exactInputSingle` (or related Uniswap V3 router swap entrypoint).
* No arbitrary contract calls.
