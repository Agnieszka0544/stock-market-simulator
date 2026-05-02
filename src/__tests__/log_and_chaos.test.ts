import express from "express";
import request from "supertest";
import routes from "../routes";
import { bank, wallets, audit } from "../store";

describe("GET /log", () => {
  let app: express.Application;
  const bankStocks = (bank as unknown as { stocks: Map<string, number> })
    .stocks;

  beforeEach(() => {
    wallets.clear();
    bankStocks.clear();
    (audit as unknown as { records: any[] }).records = [];
    app = express();
    app.use(express.json());
    app.use(routes);
  });

  it("returns entire audit log in order and only successful operations", async () => {
    bankStocks.set("s1", 2);

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
    bankStocks.set("s2", 1);

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
  const bankStocks = (bank as unknown as { stocks: Map<string, number> })
    .stocks;

  beforeEach(() => {
    wallets.clear();
    bankStocks.clear();
    (audit as unknown as { records: any[] }).records = [];
    app = express();
    app.use(express.json());
    app.use(routes);
  });

  it("triggers process.exit to kill the instance", async () => {
    const originalExit = process.exit;
    let exitCalled = false;
    (process as any).exit = (code?: number) => {
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
