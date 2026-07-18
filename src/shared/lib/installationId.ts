import { randomUUID } from 'expo-crypto';

import { db } from '../db/client';

const KEY = 'installation_id';

let cached: string | null = null;

export function getInstallationId(): string {
  if (cached) return cached;

  const row = db.getFirstSync<{ value: string }>('SELECT value FROM app_meta WHERE key = ?', [KEY]);
  if (row) {
    cached = row.value;
    return cached;
  }

  const id = randomUUID();
  db.runSync('INSERT INTO app_meta (key, value) VALUES (?, ?)', [KEY, id]);
  cached = id;
  return id;
}
