import express from "express";
import request from "supertest";
import { createApp } from "../createApp";
import { AppContext } from "../appContext";

describe("GET /log", () => {
  let app: express.Application;
  let appContext: AppContext;

  beforeEach(() => {
    app = createApp();
    appContext = app.locals.appContext as AppContext;
  });

  it("returns entire audit log in order and only successful operations", async () => {
    appContext.getBank().setStocks([{ name: "s1", quantity: 2 }]);

    const r1 = await request(app)
      .post("/wallets/w1/stocks/s1")
      .send({ type: "buy" });
    expect(r1.status).toBe(200);

    const r2 = await request(app)
      .post("/wallets/w1/stocks/s1")
      .send({ type: "sell" });
    expect(r2.status).toBe(200);

    const response = await request(app).get("/log");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      log: [
        { type: "buy", wallet_id: "w1", stock_name: "s1" },
        { type: "sell", wallet_id: "w1", stock_name: "s1" },
      ],
    });
  });

  it("does not log failed operations", async () => {
    appContext.getBank().setStocks([{ name: "s2", quantity: 1 }]);

    const r1 = await request(app)
      .post("/wallets/w2/stocks/s2")
      .send({ type: "sell" });
    expect(r1.status).toBe(400);

    const response = await request(app).get("/log");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ log: [] });
  });
});

describe("POST /chaos", () => {
  let app: express.Application;

  beforeEach(() => {
    app = createApp();
  });

  it("triggers process.exit to kill the instance", async () => {
    const originalExit = process.exit;
    let exitCalled = false;
    (process as any).exit = (_code?: number) => {
      exitCalled = true;
    };

    try {
      const response = await request(app).post("/chaos").send();
      expect(response.status).toBe(200);
      expect(exitCalled).toBe(true);
    } finally {
      process.exit = originalExit;
    }
  });
});
