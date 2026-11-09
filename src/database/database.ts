import type { SQLiteDatabase } from "expo-sqlite";

export async function initializeDatabase(
  database: SQLiteDatabase
): Promise<void> {
  await database.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS scans (
      scanned_at TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL,
      type TEXT NOT NULL,
      thumbnail_base64 TEXT
    );
  `);
  const columns = await database.getAllAsync<{ name: string }>("PRAGMA table_info(scans)");
  if (!columns.some(({ name }) => name === "thumbnail_base64")) {
    await database.execAsync("ALTER TABLE scans ADD COLUMN thumbnail_base64 TEXT");
  }
}
