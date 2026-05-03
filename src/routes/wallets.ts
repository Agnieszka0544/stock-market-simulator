import express from "express";
import { OperationRequest } from "../types";
import { AppContext } from "../appContext";

const router = express.Router();

router.post("/wallets/:walletId/stocks/:stockName", (req, res) => {
  const appContext = req.app.locals.appContext as AppContext;
  const { walletId, stockName } = req.params;
  const body = req.body as OperationRequest | undefined;
  if (!body || (body.type !== "buy" && body.type !== "sell")) {
    return res.status(400).json({ error: "invalid_request" });
  }

  if (!appContext.getBank().hasStock(stockName))
    return res.status(404).json({ error: "stock_not_found" });

  const wallet = appContext.getOrCreateWallet(walletId);
  if (body.type === "buy") {
    if (appContext.getBank().getQuantity(stockName) <= 0)
      return res.status(400).json({ error: "bank_out_of_stock" });
    appContext.getBank().withdrawOne(stockName);
    wallet.addOne(stockName);
  } else {
    if (wallet.getQuantity(stockName) <= 0)
      return res.status(400).json({ error: "wallet_out_of_stock" });
    wallet.removeOne(stockName);
    appContext.getBank().depositOne(stockName);
  }

  appContext
    .getAudit()
    .log({ wallet_id: walletId, stock_name: stockName, type: body.type });
  return res.sendStatus(200);
});

router.get("/wallets/:walletId", (req, res) => {
  const appContext = req.app.locals.appContext as AppContext;
  const { walletId } = req.params;
  if (!appContext.getWallets().has(walletId))
    return res.status(404).json({ error: "wallet_not_found" });

  const wallet = appContext.getWallets().get(walletId)!;
  return res.status(200).json({ id: walletId, stocks: wallet.getAllStocks() });
});

router.get("/wallets/:walletId/stocks/:stockName", (req, res) => {
  const appContext = req.app.locals.appContext as AppContext;
  const { walletId, stockName } = req.params;
  if (!appContext.getWallets().has(walletId))
    return res.status(404).json({ error: "wallet_not_found" });

  const wallet = appContext.getWallets().get(walletId)!;
  const quantity = wallet.getQuantity(stockName);
  return res.status(200).send(String(quantity));
});

export default router;
