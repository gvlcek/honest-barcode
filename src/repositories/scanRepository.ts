import type { SQLiteDatabase } from "expo-sqlite";
import type { Scan } from "@/models/Scan";

interface ScanRow {
  scanned_at: string;
  value: string;
  type: string;
}

export async function getScans(database: SQLiteDatabase): Promise<Scan[]> {
  const rows = await database.getAllAsync<ScanRow>(
    "SELECT scanned_at, value, type FROM scans ORDER BY scanned_at DESC"
  );

  return rows.map((row) => ({
    value: row.value,
    type: row.type,
    scannedAt: new Date(row.scanned_at),
  }));
}

export async function saveScan(
  database: SQLiteDatabase,
  scan: Scan
): Promise<void> {
  await database.runAsync(
    `INSERT INTO scans (scanned_at, value, type)
     VALUES (?, ?, ?)`,
    scan.scannedAt.toISOString(),
    scan.value,
    scan.type
  );
}
