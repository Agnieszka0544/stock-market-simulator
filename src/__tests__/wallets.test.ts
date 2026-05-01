import express from "express";
import request from "supertest";
import walletsRouter from "../routes/wallets";
import { bank, wallets } from "../store";

describe("POST /wallets/:walletId/stocks/:stockName", () => {
  let app: express.Application;
  const bankStocks = (bank as unknown as { stocks: Map<string, number> })
    .stocks;

  beforeEach(() => {
    wallets.clear();
    bankStocks.clear();
    app = express();
    app.use(express.json());
    app.use(walletsRouter);
  });

  it("should return stock_not_found and keep wallets empty when bank has no stock", async () => {
    const response = await request(app)
      .post("/wallets/wallet1/stocks/stock1")
      .send({ type: "buy" });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "stock_not_found" });
    expect(wallets.has("wallet1")).toBe(false);
  });

  it("should create wallet, buy one stock, and decrement bank quantity", async () => {
    bankStocks.set("stock1", 2);

    const response = await request(app)
      .post("/wallets/new-wallet/stocks/stock1")
      .send({ type: "buy" });

    expect(response.status).toBe(200);
    expect(wallets.has("new-wallet")).toBe(true);
    expect(wallets.get("new-wallet")?.getQuantity("stock1")).toBe(1);
    expect(bank.getQuantity("stock1")).toBe(1);
  });

  it("should fail with wallet_out_of_stock on sell when wallet has none and keep bank unchanged", async () => {
    bankStocks.set("stock1", 3);

    const response = await request(app)
      .post("/wallets/seller/stocks/stock1")
      .send({ type: "sell" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "wallet_out_of_stock" });
    expect(wallets.has("seller")).toBe(true);
    expect(wallets.get("seller")?.getQuantity("stock1")).toBe(0);
    expect(bank.getQuantity("stock1")).toBe(3);
  });

  it("should return current state of a wallet", async () => {
    bankStocks.set("stock1", 3);
    bankStocks.set("stock2", 2);

    await request(app)
      .post("/wallets/w12/stocks/stock1")
      .send({ type: "buy" })
      .expect(200);

    await request(app)
      .post("/wallets/w12/stocks/stock1")
      .send({ type: "buy" })
      .expect(200);

    await request(app)
      .post("/wallets/w12/stocks/stock2")
      .send({ type: "buy" })
      .expect(200);

    const response = await request(app).get("/wallets/w12");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: "w12",
      stocks: expect.arrayContaining([
        { name: "stock1", quantity: 2 },
        { name: "stock2", quantity: 1 },
      ]),
    });
    expect(response.body.stocks).toHaveLength(2);
  });

  it("should return wallet_not_found when requested wallet does not exist", async () => {
    const response = await request(app).get("/wallets/missing-wallet");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "wallet_not_found" });
  });

  it("should return stock quantity for a wallet", async () => {
    bankStocks.set("stock1", 3);

    await request(app)
      .post("/wallets/qty-wallet/stocks/stock1")
      .send({ type: "buy" })
      .expect(200);

    await request(app)
      .post("/wallets/qty-wallet/stocks/stock1")
      .send({ type: "buy" })
      .expect(200);

    const response = await request(app).get(
      "/wallets/qty-wallet/stocks/stock1",
    );

    expect(response.status).toBe(200);
    expect(Number(response.text)).toBe(2);
  });

  it("should return wallet_not_found for quantity request when wallet does not exist", async () => {
    const response = await request(app).get(
      "/wallets/missing-wallet/stocks/stock1",
    );

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "wallet_not_found" });
  });

  it("should return 0 when requested stock does not exist in the wallet", async () => {
    bankStocks.set("stock1", 1);

    await request(app)
      .post("/wallets/empty-wallet/stocks/stock1")
      .send({ type: "buy" })
      .expect(200);

    const response = await request(app).get(
      "/wallets/empty-wallet/stocks/stock2",
    );

    expect(response.status).toBe(200);
    expect(Number(response.text)).toBe(0);
  });
});
