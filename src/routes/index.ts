import express from "express";
import wallets from "./wallets";
import stocks from "./stocks";
import logAndChaos from "./logAndChaos";

const router = express.Router();

router.use("/", wallets);
router.use("/", stocks);
router.use("/", logAndChaos);

export default router;
