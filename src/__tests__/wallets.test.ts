import express from "express";
import request from "supertest";
import walletsRouter from "../routes/wallets";

describe("POST /wallets/:walletId/stocks/:stockName", () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use(walletsRouter);
  });

  it("should buy a stock", async () => {
    const response = await request(app)
      .post("/wallets/wallet1/stocks/APPLE")
      .send({ type: "buy" });

    expect(response.status).toBe(404);
  });
});
