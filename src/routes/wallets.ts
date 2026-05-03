import express from "express";
import { AppContext } from "../appContext";
import {
  parseOperationRequest,
  parsePathIdentifier,
} from "../validation/requestValidation";
import {
  getWalletStockQuantity,
  getWalletStocks,
  tradeStock,
} from "../services/marketService";

const router = express.Router();

function invalidRequest(res: express.Response) {
  return res.status(400).json({ error: "invalid_request" });
}

router.post("/wallets/:walletId/stocks/:stockName", (req, res) => {
  const appContext = req.app.locals.appContext as AppContext;
  const walletId = parsePathIdentifier(req.params.walletId);
  const stockName = parsePathIdentifier(req.params.stockName);
  const body = parseOperationRequest(req.body);

  if (!walletId.success || !stockName.success || !body.success) {
    return invalidRequest(res);
  }

  const result = tradeStock(
    appContext,
    walletId.data,
    stockName.data,
    body.data.type,
  );

  if (!result.success) {
    if (result.error === "stock_not_found") {
      return res.status(404).json({ error: result.error });
    }

    return res.status(400).json({ error: result.error });
  }

  return res.sendStatus(200);
});

router.get("/wallets/:walletId", (req, res) => {
  const appContext = req.app.locals.appContext as AppContext;
  const walletId = parsePathIdentifier(req.params.walletId);
  if (!walletId.success) {
    return invalidRequest(res);
  }

  const walletStocks = getWalletStocks(appContext, walletId.data);
  if (!walletStocks) {
    return res.status(404).json({ error: "wallet_not_found" });
  }

  return res.status(200).json({ id: walletId.data, stocks: walletStocks });
});

router.get("/wallets/:walletId/stocks/:stockName", (req, res) => {
  const appContext = req.app.locals.appContext as AppContext;
  const walletId = parsePathIdentifier(req.params.walletId);
  const stockName = parsePathIdentifier(req.params.stockName);

  if (!walletId.success || !stockName.success) {
    return invalidRequest(res);
  }

  const quantity = getWalletStockQuantity(
    appContext,
    walletId.data,
    stockName.data,
  );
  if (quantity === null) {
    return res.status(404).json({ error: "wallet_not_found" });
  }

  return res.status(200).send(String(quantity));
});

export default router;
