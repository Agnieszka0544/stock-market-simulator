import express from "express";
import { AppContext } from "../appContext";
import { StockEntry } from "../types";

const router = express.Router();

router.get("/stocks", (req, res) => {
  const appContext = req.app.locals.appContext as AppContext;
  return res.status(200).json({ stocks: appContext.getBank().getAllStocks() });
});

router.post("/stocks", (req, res) => {
  const appContext = req.app.locals.appContext as AppContext;
  const body = req.body as { stocks?: StockEntry[] } | undefined;
  if (!body || !Array.isArray(body.stocks)) {
    return res.status(400).json({ error: "invalid_request" });
  }

  appContext.getBank().setStocks(body.stocks);
  return res.sendStatus(200);
});

export default router;
