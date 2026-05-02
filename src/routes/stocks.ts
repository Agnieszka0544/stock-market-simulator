import express from "express";
import { bank } from "../store";
import { StockEntry } from "../types";

const router = express.Router();

router.get("/stocks", (_req, res) => {
  return res.status(200).json({ stocks: bank.getAllStocks() });
});

router.post("/stocks", (req, res) => {
  const body = req.body as { stocks?: StockEntry[] } | undefined;
  if (!body || !Array.isArray(body.stocks)) {
    return res.status(400).json({ error: "invalid_request" });
  }

  bank.setStocks(body.stocks);
  return res.sendStatus(200);
});

export default router;
