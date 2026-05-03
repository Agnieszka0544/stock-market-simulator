import { z } from "zod";
import { OperationType, StockEntry } from "../types";

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false };

const identifierSchema = z.string().refine((s: string) => s.trim().length > 0);

const opSchema = z.object({ type: z.enum(["buy", "sell"]) }).strict();

const stockEntrySchema = z
  .object({ name: z.string().min(1), quantity: z.number().int().min(0) })
  .strict();

const stockListSchema = z
  .object({ stocks: z.array(stockEntrySchema) })
  .strict();

export function parsePathIdentifier(value: unknown): ValidationResult<string> {
  const parsed = identifierSchema.safeParse(value);
  if (!parsed.success) return { success: false };
  return { success: true, data: parsed.data.trim() };
}

export function parseOperationRequest(
  body: unknown,
): ValidationResult<{ type: OperationType }> {
  const parsed = opSchema.safeParse(body);
  if (!parsed.success) return { success: false };
  return { success: true, data: { type: parsed.data.type as OperationType } };
}

export function parseStockListRequest(
  body: unknown,
): ValidationResult<{ stocks: StockEntry[] }> {
  const parsed = stockListSchema.safeParse(body);
  if (!parsed.success) return { success: false };
  return {
    success: true,
    data: { stocks: parsed.data.stocks as StockEntry[] },
  };
}
