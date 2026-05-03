import { AppContext } from "../appContext";
import { OperationType, StockEntry } from "../types";

export type TradeStockResult =
  | { success: true }
  | {
      success: false;
      error: "stock_not_found" | "bank_out_of_stock" | "wallet_out_of_stock";
    };

export function getBankStocks(appContext: AppContext): StockEntry[] {
  return appContext.getBank().getAllStocks();
}

export function replaceBankStocks(
  appContext: AppContext,
  stocks: StockEntry[],
): void {
  appContext.getBank().setStocks(stocks);
}

export function getWalletStocks(
  appContext: AppContext,
  walletId: string,
): StockEntry[] | null {
  const wallet = appContext.findWallet(walletId);
  return wallet ? wallet.getAllStocks() : null;
}

export function getWalletStockQuantity(
  appContext: AppContext,
  walletId: string,
  stockName: string,
): number | null {
  const wallet = appContext.findWallet(walletId);
  return wallet ? wallet.getQuantity(stockName) : null;
}

export function tradeStock(
  appContext: AppContext,
  walletId: string,
  stockName: string,
  type: OperationType,
): TradeStockResult {
  const bank = appContext.getBank();

  if (!bank.hasStock(stockName)) {
    return { success: false, error: "stock_not_found" };
  }

  const wallet = appContext.getOrCreateWallet(walletId);

  if (type === "buy") {
    if (bank.getQuantity(stockName) <= 0) {
      return { success: false, error: "bank_out_of_stock" };
    }

    bank.withdrawOne(stockName);
    wallet.addOne(stockName);
  } else {
    if (wallet.getQuantity(stockName) <= 0) {
      return { success: false, error: "wallet_out_of_stock" };
    }

    wallet.removeOne(stockName);
    bank.depositOne(stockName);
  }

  appContext
    .getAudit()
    .log({ wallet_id: walletId, stock_name: stockName, type });
  return { success: true };
}
