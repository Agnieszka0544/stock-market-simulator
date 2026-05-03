# Stock Market Simulator

A simplified stock market service built with Express.js and TypeScript. It models a simple exchange where wallets buy and sell stocks through a central bank (the only liquidity provider), with fixed pricing and instant execution.

## Features

- **Fixed Stock Price**: Every stock costs 1 unit (no fluctuations)
- **No Balance Tracking**: Only stock holdings are tracked, not cash
- **Instant Execution**: Buy/sell operations execute immediately
- **Central Bank**: One bank provides all stock liquidity
- **Audit Trail**: Immutable log of successful wallet operations (bank operations excluded)

## API Endpoints

### Stock Management

- `GET /stocks` - Get bank inventory
- `POST /stocks` - Initialize bank stocks

### Wallet Operations

- `GET /wallets/:walletId` - Get wallet holdings
- `GET /wallets/:walletId/stocks/:stockName` - Get stock quantity
- `POST /wallets/:walletId/stocks/:stockName` - Buy/sell (body: `{ "type": "buy" | "sell" }`)

### Audit & Control

- `GET /log` - Get audit log
- `POST /chaos` - Kill process

---

## Getting Started

### Prerequisites

- Node.js 18+ (recommended) or Docker & Docker Compose (for containerized runs)
- npm 9+ (if not using Docker)

### Quick Start

Use one of the following commands to start the application on a custom port (defaults to 3000):

#### Linux/macOS (Native)

```bash
./start.sh 3000
```

#### Windows (Native)

```bash
start.bat 3000
```

#### Docker (All Platforms)

```bash
PORT=3000 docker compose up --build
```

Default URL: `http://localhost:3000`

### Native Installation

#### Install Dependencies

```bash
npm install
```

#### Run in Development Mode

Starts the API with auto-reload on file changes.

```bash
npm run dev
```

#### Run Tests

```bash
npm test
```

#### Run in Production Mode

Build the project and start the compiled server.

```bash
npm run build
npm start
```

Specify a custom port:
```bash
PORT=3000 npm start
```

### Docker

#### Build for Multiple Architectures (amd64, arm64)

Linux/macOS:
```bash
./docker.build.sh latest
```

Windows:
```bash
docker.build.bat latest
```

#### Run with Docker Compose

```bash
PORT=3000 docker compose up --build
```

#### Run Tests with Docker

```bash
docker compose run --rm --build test
```

## Example Usage

```bash
# Initialize bank
curl -X POST http://localhost:3000/stocks \
  -H "Content-Type: application/json" \
  -d '{"stocks": [{"name": "stock1", "quantity": 100}]}'

# Buy stock
curl -X POST http://localhost:3000/wallets/wallet1/stocks/stock1 \
  -H "Content-Type: application/json" \
  -d '{"type": "buy"}'

# Check wallet
curl http://localhost:3000/wallets/wallet1

# View audit log
curl http://localhost:3000/log
```

## Technology

- **Node.js + TypeScript**: Type-safe backend runtime
- **Express.js**: REST API framework
- **Jest + Supertest**: Automated API and behavior tests
