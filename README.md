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

- Node.js 18+ (recommended)
- npm 9+

### Install Dependencies

```bash
npm install
```

### Run in Development Mode

Starts the API with auto-reload on file changes.

```bash
npm run dev
```

Default URL: `http://localhost:3000`

### Run Tests

```bash
npm test
```

### Run in Production Mode

Build the project and start the compiled server.

```bash
npm run build
npm start
```

## Example Usage

```bash
# Initialize bank
curl -X POST http://localhost:3000/stocks \
  -H "Content-Type: application/json" \
  -d '{"stocks": [{"name": "AAPL", "quantity": 100}]}'

# Buy stock
curl -X POST http://localhost:3000/wallets/alice/stocks/AAPL \
  -H "Content-Type: application/json" \
  -d '{"type": "buy"}'

# Check wallet
curl http://localhost:3000/wallets/alice

# View audit log
curl http://localhost:3000/log
```

## Technology

- **Node.js + TypeScript**: Type-safe backend runtime
- **Express.js**: REST API framework
- **Jest + Supertest**: Automated API and behavior tests
