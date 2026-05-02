import express from "express";
import { audit } from "../store";

const router = express.Router();

router.get("/log", (_req, res) => {
  return res.status(200).json({ log: audit.getAll() });
});

router.post("/chaos", (_req, res) => {
  res.sendStatus(200);

  setImmediate(() => {
    process.exit(0);
  });
});

export default router;
