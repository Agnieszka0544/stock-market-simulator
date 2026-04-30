export class Wallet {
  private stocks: Map<string, number> = new Map();

  getQuantity(name: string): number {
    return this.stocks.get(name) ?? 0;
  }

  addOne(name: string): void {
    const cur = this.stocks.get(name) ?? 0;
    this.stocks.set(name, cur + 1);
  }

  removeOne(name: string): void {
    const cur = this.stocks.get(name) ?? 0;
    if (cur <= 0) throw new Error('insufficient');
    if (cur === 1) this.stocks.delete(name);
    else this.stocks.set(name, cur - 1);
  }
}
