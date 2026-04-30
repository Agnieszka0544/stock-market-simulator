import express from "express";
import wallets from "./wallets";

const router = express.Router();

router.use("/", wallets);

export default router;
