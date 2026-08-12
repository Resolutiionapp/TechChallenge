import { Injectable } from '@nestjs/common';

interface AuditEntry {
  actorId: string;
  action: string;
  targetId: string;
  at: string;
}

const ENTRIES: AuditEntry[] = [];

@Injectable()
export class AuditLogRepository {
  async record(entry: Omit<AuditEntry, 'at'>): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 5));
    ENTRIES.push({ ...entry, at: new Date().toISOString() });
  }

  async findByTarget(targetId: string): Promise<AuditEntry[]> {
    return ENTRIES.filter((entry) => entry.targetId === targetId);
  }
}
