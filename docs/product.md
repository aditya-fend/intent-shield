# Product Specification

## Definition
IntentShield is a policy enforcement layer for autonomous blockchain agents. It translates human natural-language intent into a user-signed authorization policy, then enforces it exactly against the actual on-chain transaction.

## Problem
**Authorization ≠ Intent.** Giving an AI agent wallet access does not mean it will only do what the user intended. If the agent suffers prompt injection or gets compromised, it can execute oversized amounts or call malicious targets.

## Core Formula
`HUMAN INTENT` → `STRUCTURED POLICY` → `USER SIGNATURE` → `POLICY COMMITMENT` → `LIMITED AGENT AUTHORITY` → `ACTUAL TRANSACTION` → `ON-CHAIN POLICY ENFORCEMENT` → `BLOCKCHAIN EXECUTION`

## MVP Use Case (Base Sepolia)
* **Intent**: "Swap up to 500 USDC to ETH on Uniswap with max 1% slippage for 1 hour."
* **Valid execution**: 300 USDC → ETH (slippage <= 1%)
* **Invalid execution**: 5,000 USDC → ETH (violates policy limit)
