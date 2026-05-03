import express from "express";
import { AppContext } from "../appContext";

const router = express.Router();

router.get("/log", (req, res) => {
  const appContext = req.app.locals.appContext as AppContext;
  return res.status(200).json({ log: appContext.getAudit().getAll() });
});

router.post("/chaos", (_req, res) => {
  res.sendStatus(200);

  setImmediate(() => {
    process.exit(0);
  });
});

export default router;
