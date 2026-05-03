import { AuditRecord } from "../types";

export class AuditLog {
  private records: AuditRecord[] = [];

  log(record: AuditRecord) {
    this.records.push({ ...record });
  }

  getAll(): AuditRecord[] {
    return [...this.records];
  }
}
