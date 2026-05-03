import express from "express";
import request from "supertest";
import { createApp } from "../createApp";
import { AppContext } from "../appContext";

describe("GET /stocks", () => {
  let app: express.Application;
  let appContext: AppContext;

  beforeEach(() => {
    app = createApp();
    appContext = app.locals.appContext as AppContext;
  });

  it("should return current state of the bank", async () => {
    appContext.getBank().setStocks([
      { name: "stock1", quantity: 99 },
      { name: "stock2", quantity: 1 },
    ]);

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
  let appContext: AppContext;

  beforeEach(() => {
    app = createApp();
    appContext = app.locals.appContext as AppContext;
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
    expect(appContext.getBank().getQuantity("stock1")).toBe(99);
    expect(appContext.getBank().getQuantity("stock2")).toBe(1);
  });

  it("should replace previous bank state", async () => {
    appContext.getBank().setStocks([{ name: "old-stock", quantity: 7 }]);

    const response = await request(app)
      .post("/stocks")
      .send({
        stocks: [{ name: "stock1", quantity: 99 }],
      });

    expect(response.status).toBe(200);
    expect(appContext.getBank().hasStock("old-stock")).toBe(false);
    expect(appContext.getBank().getQuantity("stock1")).toBe(99);
    expect(appContext.getBank().getAllStocks().length).toBe(1);
  });

  it("should reject malformed stock collections", async () => {
    const response = await request(app)
      .post("/stocks")
      .send({
        stocks: [{ name: "stock1", quantity: -1 }],
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "invalid_request" });
    expect(appContext.getBank().getAllStocks()).toEqual([]);
  });

  it("should reject non-integer quantities", async () => {
    const response = await request(app)
      .post("/stocks")
      .send({
        stocks: [{ name: "stock1", quantity: 1.5 }],
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "invalid_request" });
  });

  it("should reject empty stock name", async () => {
    const response = await request(app)
      .post("/stocks")
      .send({
        stocks: [{ name: "", quantity: 100 }],
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "invalid_request" });
  });

  it("should reject POST /stocks with missing stocks field", async () => {
    const response = await request(app).post("/stocks").send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "invalid_request" });
  });

  it("should reject stock entry with extra fields", async () => {
    const response = await request(app)
      .post("/stocks")
      .send({
        stocks: [{ name: "stock1", quantity: 100, extra: "field" }],
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "invalid_request" });
  });
});
