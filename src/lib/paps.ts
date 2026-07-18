// PAPS (학생건강체력평가) domain logic — ported from the design prototype's judging rules.
export type PapsId = 'pacer' | 'flex' | 'jump' | 'grip' | 'bodyfat';

export type PapsMeta = {
  name: string;
  cat: string;
  unit: string;
  higher: boolean;
  th: [number, number, number, number];
};

export const PAPS_ORDER: PapsId[] = ['pacer', 'flex', 'jump', 'grip', 'bodyfat'];

export const PAPS_META: Record<PapsId, PapsMeta> = {
  pacer: { name: '왕복오래달리기', cat: '심폐지구력', unit: '회', higher: true, th: [95, 75, 55, 40] },
  flex: { name: '앉아윗몸앞으로굽히기', cat: '유연성', unit: 'cm', higher: true, th: [12, 7, 3, 0] },
  jump: { name: '제자리멀리뛰기', cat: '순발력', unit: 'cm', higher: true, th: [225, 195, 170, 150] },
  grip: { name: '악력', cat: '근력', unit: 'kg', higher: true, th: [42, 34, 27, 20] },
  bodyfat: { name: '체지방률', cat: '비만도', unit: '%', higher: false, th: [12, 18, 24, 30] },
};

export const GRADE_TEXT: Record<number, string> = {
  1: '매우 우수',
  2: '우수',
  3: '보통',
  4: '노력 필요',
  5: '주의',
};

export function judgeGrade(id: PapsId, value: number): number {
  const meta = PAPS_META[id];
  for (let g = 1; g <= 4; g++) {
    const pass = meta.higher ? value >= meta.th[g - 1] : value <= meta.th[g - 1];
    if (pass) return g;
  }
  return 5;
}

export function overallGrade(records: Record<PapsId, { grade: number }>): number {
  const grades = PAPS_ORDER.map((id) => records[id].grade);
  return Math.round(grades.reduce((a, b) => a + b, 0) / grades.length);
}
