import { Bank } from "./models/bank";
import { Wallet } from "./models/wallet";
import { AuditLog } from "./models/auditLog";

export const bank = new Bank();
export const wallets: Map<string, Wallet> = new Map();
export const audit = new AuditLog();

export function getOrCreateWallet(id: string): Wallet {
  let wallet = wallets.get(id);
  if (!wallet) {
    wallet = new Wallet();
    wallets.set(id, wallet);
  }
  return wallet;
}
