import { Bank } from "./models/bank";
import { Wallet } from "./models/wallet";
import { AuditLog } from "./models/auditLog";

export class AppContext {
  private bank: Bank;
  private wallets: Map<string, Wallet>;
  private audit: AuditLog;

  constructor() {
    this.bank = new Bank();
    this.wallets = new Map();
    this.audit = new AuditLog();
  }

  getBank(): Bank {
    return this.bank;
  }

  getWallets(): Map<string, Wallet> {
    return this.wallets;
  }

  getAudit(): AuditLog {
    return this.audit;
  }

  getOrCreateWallet(id: string): Wallet {
    let wallet = this.wallets.get(id);
    if (!wallet) {
      wallet = new Wallet();
      this.wallets.set(id, wallet);
    }
    return wallet;
  }
}
