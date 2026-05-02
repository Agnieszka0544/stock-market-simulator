import express from "express";
import request from "supertest";
import routes from "../routes";
import { bank, wallets } from "../store";

describe("GET /stocks", () => {
  let app: express.Application;
  const bankStocks = (bank as unknown as { stocks: Map<string, number> })
    .stocks;

  beforeEach(() => {
    wallets.clear();
    bankStocks.clear();
    app = express();
    app.use(express.json());
    app.use(routes);
  });

  it("should return current state of the bank", async () => {
    bankStocks.set("stock1", 99);
    bankStocks.set("stock2", 1);

    const response = await request(app).get("/stocks");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      stocks: expect.arrayContaining([
        { name: "stock1", quantity: 99 },
        { name: "stock2", quantity: 1 },
      ]),
    });
    expect(response.body.stocks).toHaveLength(2);
  });

  it("should return an empty list when bank has no stocks", async () => {
    const response = await request(app).get("/stocks");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ stocks: [] });
  });
});

describe("POST /stocks", () => {
  let app: express.Application;
  const bankStocks = (bank as unknown as { stocks: Map<string, number> })
    .stocks;

  beforeEach(() => {
    wallets.clear();
    bankStocks.clear();
    app = express();
    app.use(express.json());
    app.use(routes);
  });

  it("should set bank state and return 200", async () => {
    const response = await request(app)
      .post("/stocks")
      .send({
        stocks: [
          { name: "stock1", quantity: 99 },
          { name: "stock2", quantity: 1 },
        ],
      });

    expect(response.status).toBe(200);
    expect(bank.getQuantity("stock1")).toBe(99);
    expect(bank.getQuantity("stock2")).toBe(1);
  });

  it("should replace previous bank state", async () => {
    bankStocks.set("old-stock", 7);

    const response = await request(app)
      .post("/stocks")
      .send({
        stocks: [{ name: "stock1", quantity: 99 }],
      });

    expect(response.status).toBe(200);
    expect(bank.hasStock("old-stock")).toBe(false);
    expect(bank.getQuantity("stock1")).toBe(99);
    expect(bankStocks.size).toBe(1);
  });
});
