import express from "express";
import { OperationRequest } from "../types";
import { bank, getOrCreateWallet, audit, wallets } from "../store";

const router = express.Router();

router.post("/wallets/:walletId/stocks/:stockName", (req, res) => {
  const { walletId, stockName } = req.params;
  const body = req.body as OperationRequest | undefined;
  if (!body || (body.type !== "buy" && body.type !== "sell")) {
    return res.status(400).json({ error: "invalid_request" });
  }

  if (!bank.hasStock(stockName))
    return res.status(404).json({ error: "stock_not_found" });

  const wallet = getOrCreateWallet(walletId);
  if (body.type === "buy") {
    if (bank.getQuantity(stockName) <= 0)
      return res.status(400).json({ error: "bank_out_of_stock" });
    bank.withdrawOne(stockName);
    wallet.addOne(stockName);
  } else {
    if (wallet.getQuantity(stockName) <= 0)
      return res.status(400).json({ error: "wallet_out_of_stock" });
    wallet.removeOne(stockName);
    bank.depositOne(stockName);
  }

  audit.log({ wallet_id: walletId, stock_name: stockName, type: body.type });
  return res.sendStatus(200);
});

export default router;
