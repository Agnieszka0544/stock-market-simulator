import express from "express";
import wallets from "./wallets";
import stocks from "./stocks";

const router = express.Router();

router.use("/", wallets);
router.use("/", stocks);

export default router;
