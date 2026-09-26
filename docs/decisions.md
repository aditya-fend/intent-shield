# Architecture Decision Records (ADR)

## ADR 001: Use Base Sepolia
* **Status**: Accepted
* **Context**: Need a fast, cheap EVM testnet supported by modern infra.
* **Decision**: Base Sepolia is the sole official testnet for the MVP.

## ADR 002: Drop Laptop / Web2 Asset Purchase
* **Status**: Accepted
* **Context**: Real-world assets (e.g. a laptop) have no native on-chain verification and rely on weak external oracles/APIs.
* **Decision**: Replace with a crypto-native swap (USDC → ETH) that is 100% blockchain-verifiable.

## ADR 003: Split Off-Chain Verifier & On-Chain Enforcer
* **Status**: Accepted
* **Context**: Executing policy-violating transactions on-chain wastes gas.
* **Decision**: Off-chain verifier as the early UX filter, Smart Account as the final defense (*defense-in-depth*).
