import { db } from './client';
import { Gender } from '../api/types';

export type Profile = {
  birthDate: string; // YYYY-MM-DD
  gender: Gender;
  heightCm: number;
  weightKg: number;
};

type ProfileRow = {
  birth_date: string;
  gender: Gender;
  height_cm: number;
  weight_kg: number;
};

export function getProfile(): Profile | null {
  const row = db.getFirstSync<ProfileRow>(
    'SELECT birth_date, gender, height_cm, weight_kg FROM profile WHERE id = 1'
  );
  if (!row) return null;
  return {
    birthDate: row.birth_date,
    gender: row.gender,
    heightCm: row.height_cm,
    weightKg: row.weight_kg,
  };
}

export function saveProfile(profile: Profile): void {
  db.runSync(
    `INSERT INTO profile (id, birth_date, gender, height_cm, weight_kg, updated_at)
     VALUES (1, ?, ?, ?, ?, ?)
     ON CONFLICT (id) DO UPDATE SET
       birth_date = excluded.birth_date,
       gender = excluded.gender,
       height_cm = excluded.height_cm,
       weight_kg = excluded.weight_kg,
       updated_at = excluded.updated_at`,
    [profile.birthDate, profile.gender, profile.heightCm, profile.weightKg, new Date().toISOString()]
  );
}
