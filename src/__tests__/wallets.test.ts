import express from "express";
import request from "supertest";
import { createApp } from "../createApp";
import { AppContext } from "../appContext";
import { Wallet } from "../models/wallet";

describe("POST /wallets/:walletId/stocks/:stockName", () => {
  let app: express.Application;
  let appContext: AppContext;

  beforeEach(() => {
    app = createApp();
    appContext = app.locals.appContext as AppContext;
  });

  it("should return stock_not_found and keep wallets empty when bank has no stock", async () => {
    const response = await request(app)
      .post("/wallets/wallet1/stocks/stock1")
      .send({ type: "buy" });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "stock_not_found" });
    expect(appContext.getWallets().has("wallet1")).toBe(false);
  });

  it("should create wallet, buy one stock, and decrement bank quantity", async () => {
    appContext.getBank().setStocks([{ name: "stock1", quantity: 2 }]);

    const response = await request(app)
      .post("/wallets/new-wallet/stocks/stock1")
      .send({ type: "buy" });

    expect(response.status).toBe(200);
    expect(appContext.getWallets().has("new-wallet")).toBe(true);
    expect(
      appContext.getWallets().get("new-wallet")?.getQuantity("stock1"),
    ).toBe(1);
    expect(appContext.getBank().getQuantity("stock1")).toBe(1);
  });

  it("should fail with wallet_out_of_stock on sell when wallet has none and keep bank unchanged", async () => {
    appContext.getBank().setStocks([{ name: "stock1", quantity: 3 }]);

    const response = await request(app)
      .post("/wallets/seller/stocks/stock1")
      .send({ type: "sell" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "wallet_out_of_stock" });
    expect(appContext.getWallets().has("seller")).toBe(true);
    expect(appContext.getWallets().get("seller")?.getQuantity("stock1")).toBe(
      0,
    );
    expect(appContext.getBank().getQuantity("stock1")).toBe(3);
  });

  it("should reject malformed trade payloads without mutating state", async () => {
    appContext.getBank().setStocks([{ name: "stock1", quantity: 2 }]);

    const response = await request(app)
      .post("/wallets/new-wallet/stocks/stock1")
      .send({ type: "buy", unexpected: true });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "invalid_request" });
    expect(appContext.getWallets().has("new-wallet")).toBe(false);
    expect(appContext.getBank().getQuantity("stock1")).toBe(2);
  });

  it("should fail buy when bank stock is empty", async () => {
    appContext.getBank().setStocks([{ name: "stock1", quantity: 0 }]);

    const response = await request(app)
      .post("/wallets/buyer/stocks/stock1")
      .send({ type: "buy" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "bank_out_of_stock" });
  });

  it("should reject trade with invalid operation type", async () => {
    appContext.getBank().setStocks([{ name: "stock1", quantity: 2 }]);

    const response = await request(app)
      .post("/wallets/wallet1/stocks/stock1")
      .send({ type: "invalid_op" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "invalid_request" });
  });
});

describe("GET /wallets/:walletId", () => {
  let app: express.Application;
  let appContext: AppContext;

  beforeEach(() => {
    app = createApp();
    appContext = app.locals.appContext as AppContext;
  });

  it("should return current state of a wallet", async () => {
    const wallet = new Wallet();
    wallet.addOne("stock1");
    wallet.addOne("stock1");
    wallet.addOne("stock2");
    appContext.getWallets().set("w12", wallet);

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

  it("should reject blank wallet identifiers", async () => {
    const response = await request(app).get("/wallets/%20");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "invalid_request" });
  });
});

describe("GET /wallets/:walletId/stocks/:stockName", () => {
  let app: express.Application;
  let appContext: AppContext;

  beforeEach(() => {
    app = createApp();
    appContext = app.locals.appContext as AppContext;
  });

  it("should return stock quantity for a wallet", async () => {
    const wallet = new Wallet();
    wallet.addOne("stock1");
    wallet.addOne("stock1");
    appContext.getWallets().set("qty-wallet", wallet);

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
    const wallet = new Wallet();
    wallet.addOne("stock1");
    appContext.getWallets().set("missing-stock-wallet", wallet);

    const response = await request(app).get(
      "/wallets/missing-stock-wallet/stocks/stock2",
    );

    expect(response.status).toBe(200);
    expect(Number(response.text)).toBe(0);
  });

  it("should reject blank stock name in quantity query", async () => {
    const wallet = new Wallet();
    wallet.addOne("stock1");
    appContext.getWallets().set("qty-wallet", wallet);

    const response = await request(app).get("/wallets/qty-wallet/stocks/%20");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "invalid_request" });
  });
});
