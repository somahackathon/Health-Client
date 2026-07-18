import { GRADE_TEXT, PAPS_META, PAPS_ORDER, PapsId } from '../lib/paps';
import { useFitnessStore } from '../store/useFitnessStore';
import { gradeColor } from '../theme/colors';

export type PapsEventVM = {
  id: PapsId;
  name: string;
  cat: string;
  unit: string;
  value: number;
  grade: number;
  gradeText: string;
  fg: string;
  bg: string;
};

export function usePapsEvents(): PapsEventVM[] {
  const records = useFitnessStore((s) => s.records);
  return PAPS_ORDER.map((id) => {
    const record = records[id];
    const meta = PAPS_META[id];
    const { fg, bg } = gradeColor(record.grade);
    return {
      id,
      name: meta.name,
      cat: meta.cat,
      unit: meta.unit,
      value: record.value,
      grade: record.grade,
      gradeText: GRADE_TEXT[record.grade],
      fg,
      bg,
    };
  });
}
