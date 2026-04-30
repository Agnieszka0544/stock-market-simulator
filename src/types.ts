export type OperationType = "buy" | "sell";

export interface OperationRequest {
  type: OperationType;
}

export interface StockEntry {
  name: string;
  quantity: number;
}

export interface AuditRecord {
  wallet_id: string;
  stock_name: string;
  type: OperationType;
}
