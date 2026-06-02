# GravoEdge

> **A Stellar-native leveraged DeFi protocol enabling automated capital looping strategies to maximize yield efficiency.**

[![CI Workflow](https://github.com/gravoedge-protocol/gravoedge/actions/workflows/ci.yml/badge.svg)](https://github.com/gravoedge-protocol/gravoedge/actions/workflows/ci.yml)

---

## Overview

**GravoEdge** is a professional-grade DeFi protocol built for the **Stellar ecosystem** that allows users to amplify their asset positions through automated leverage looping. By depositing collateral into lending protocols, borrowing stablecoins, swapping through AMMs, and re-depositing, GravoEdge enables up to **~5x leverage** on supported assets.

Originally engineered for Starknet-based protocols (ZkLend, Ekubo, Nostra), GravoEdge has been restructured for **Stellar ecosystem compatibility** with clean abstraction layers and modular architecture.

### Core Concepts

1. **Deposit Collateral** → Users deposit assets (XLM, ETH, USDC) into Stellar-native lending protocols
2. **Borrow Stablecoins** → Borrow against deposited collateral at optimal rates
3. **Swap via AMMs** → Swap borrowed assets via Stellar AMMs
4. **Re-Deposit & Loop** → Re-deposit swapped assets to borrow more, increasing leverage
5. **Manage Position** → Monitor health ratio, add collateral, or close position

---

## Architecture

```
gravoedge/
├── soroban/                  # Soroban smart contract layer (Stellar)
│   ├── adapters/             # Blockchain abstraction interfaces
│   │   ├── LendingAdapter    → Lending protocol abstraction
│   │   ├── AMMAdapter        → AMM/DEX abstraction
│   │   └── CollateralManager → Collateral & risk management
│   └── contracts/            → Soroban contract stubs (Rust)
├── web_app/                  # Python/FastAPI backend
│   ├── api/                  → REST API endpoints
│   ├── db/                   → Database models & CRUD
│   ├── contract_tools/       → Blockchain interaction layer
│   └── telegram/             → Telegram mini-app bot
├── frontend/                 # React frontend application
│   ├── src/                  → React components, hooks, services
│   └── public/               → Static assets
└── devops/                   # Docker & deployment configs
```

### Smart Contract Abstraction

GravoEdge uses an **adapter pattern** to abstract blockchain interactions:

| Adapter | Purpose | Starknet Original | Stellar Equivalent |
|---------|---------|------------------|--------------------|
| `LendingAdapter` | Lending/borrowing operations | ZkLend | Stellar lending protocols (via SAC) |
| `AMMAdapter` | Token swapping/liquidity | Ekubo | Stellar AMM/DEX protocols |
| `CollateralManager` | Risk & collateral management | In-house | Protocol-agnostic |

---

## Why GravoEdge?

### Problem

DeFi users lack access to **capital-efficient leverage tools** in the Stellar ecosystem. Traditional perpetual contracts introduce volatility and high costs, while manual looping is complex and gas-inefficient.

### Solution

GravoEdge provides an **automated leverage engine** that:

- **Maximizes capital efficiency** through intelligent looping
- **Reduces complexity** with one-click leverage positions
- **Lowers risk** with automated health ratio monitoring
- **Enables composability** through protocol adapters
- **Provides institutional-grade** risk management

---

## Quick Start

### Prerequisites

- Docker (v24.0+) & Docker Compose (v2.0+)
- Port **5433** available for PostgreSQL

### Development

```bash
# Clone the repository
git clone <repository-url>
cd gravoedge

# Start full development environment
make dev

# Or start backend only
make back
```

### Services

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | `http://localhost:3000` | React SPA |
| **Backend API** | `http://localhost:8000` | FastAPI REST API |
| **PostgreSQL** | `localhost:5433` | Database |

### Commands

| Command | Description |
|---------|-------------|
| `make dev` | Start development environment |
| `make back` | Start backend services only |
| `make prod` | Start production environment |
| `make windows` | Start development on Windows |

---

## Development Guide

### Running Tests

```bash
# Python backend tests
cd gravoedge && poetry run pytest web_app/tests

# Frontend tests
cd gravoedge/frontend && yarn test
```

### Database Migrations

```bash
# Start services
docker compose -f devops/docker-compose.gravoedge.dev.yaml up --build

# Run migrations
docker exec backend_dev alembic -c web_app/alembic.ini upgrade head

# Create new migration
docker exec backend_dev alembic -c web_app/alembic.ini revision --autogenerate -m "description"
```

### Adding Test Data

```bash
docker compose -f devops/docker-compose.gravoedge.dev.yaml up --build

# Seed the database
docker exec -ti backend_dev python -m web_app.db.seed_data
```

---

## Stellar Integration

GravoEdge is being actively migrated to the **Stellar ecosystem**. Current status:

- ✅ **Python backend** — Adapted with Stellar-compatible abstraction layers
- ✅ **Frontend** — Rebranded and Starknet wallet references identified
- ✅ **Adapters** — Lending, AMM, and CollateralManager interfaces defined
- 🔄 **Soroban Contracts** — In development (Rust-based Soroban smart contracts)
- 🔄 **Wallet Integration** — Stellar-compatible wallet flow (Freighter, WalletConnect)
- 🔄 **Protocol Adapters** — Specific Stellar lending/AMM protocol implementations
- ❌ **Stellar-native AMM** — Pending ecosystem partner integration

### Environment Variables

```
STELLAR_NETWORK=testnet              # testnet | mainnet | futurenet
STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
STELLAR_NODE_URL=<soroban-rpc-url>
```

---

## Project Status

GravoEdge is a **production-grade DeFi protocol** currently in active development for the Stellar ecosystem. The codebase has been professionally rebranded from the original Starknet-based Spotnet protocol with:

- ✅ Complete rebrand (Spotnet → **GravoEdge**)
- ✅ Architecture cleanup with modular design
- ✅ Soroban adapter abstraction layers
- ✅ Updated DevOps & CI/CD pipelines
- ✅ Professional documentation
- ✅ Docker-based development environment

---

## License

MIT License — see [LICENSE](LICENSE) for details.
