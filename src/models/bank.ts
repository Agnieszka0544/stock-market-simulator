export class Bank {
  private stocks: Map<string, number> = new Map();

  hasStock(name: string): boolean {
    return this.stocks.has(name);
  }

  getQuantity(name: string): number {
    return this.stocks.get(name) ?? 0;
  }

  withdrawOne(name: string): void {
    const q = this.stocks.get(name);
    if (q === undefined) throw new Error("not_found");
    if (q <= 0) throw new Error("insufficient");
    this.stocks.set(name, q - 1);
  }

  depositOne(name: string): void {
    const current = this.stocks.get(name);
    if (current === undefined) throw new Error("not_found");
    this.stocks.set(name, current + 1);
  }
}
