# Quantara Soroban Smart Contracts

This directory contains the **Soroban smart contract** abstractions for the Quantara protocol on the Stellar network.

## Architecture

Quantara uses abstraction layers to interface with Stellar ecosystem components:

```
quantara/soroban/
├── adapters/           # Blockchain abstraction interfaces
│   ├── LendingAdapter    → Lending protocol integration (replaces ZkLend)
│   ├── AMMAdapter        → AMM/Swap integration (replaces Ekubo)
│   └── CollateralManager → Collateral management logic
├── contracts/          # Soroban smart contracts (Rust)
│   ├── looping/         → Leverage loop engine contract
│   ├── vault/           → Vault/collateral management
│   └── rewards/         → Reward distribution
└── tests/              # Contract tests
```

## Network Support

- **Stellar Testnet** (`https://horizon-testnet.stellar.org`)
- **Stellar Mainnet** (`https://horizon.stellar.org`)
- **Future SCP testnets**

## Development

Prerequisites:
- Rust with `wasm32-unknown-unknown` target
- Soroban CLI (`cargo install --locked stellar-cli`)

## Current Status

⚠️ **Work in Progress** - These contracts are being migrated from the original Starknet/Cairo implementation.
The abstraction layers define the interfaces needed for Stellar ecosystem compatibility.
