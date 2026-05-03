import express from "express";
import { AppContext } from "../appContext";
import { getBankStocks, replaceBankStocks } from "../services/marketService";
import { parseStockListRequest } from "../validation/requestValidation";

const router = express.Router();

function invalidRequest(res: express.Response) {
  return res.status(400).json({ error: "invalid_request" });
}

router.get("/stocks", (req, res) => {
  const appContext = req.app.locals.appContext as AppContext;
  return res.status(200).json({ stocks: getBankStocks(appContext) });
});

router.post("/stocks", (req, res) => {
  const appContext = req.app.locals.appContext as AppContext;
  const body = parseStockListRequest(req.body);
  if (!body.success) {
    return invalidRequest(res);
  }

  replaceBankStocks(appContext, body.data.stocks);
  return res.sendStatus(200);
});

export default router;
