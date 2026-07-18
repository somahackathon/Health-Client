import { create } from 'zustand';

import { PapsId, judgeGrade, overallGrade } from '../lib/paps';

export type PapsRecord = { value: number; grade: number };

export type SubmitResult = {
  id: PapsId;
  value: number;
  grade: number;
  prev: number;
  improved: boolean;
  same: boolean;
};

type ProfileRow = { label: string; value: string };

type FitnessState = {
  profile: ProfileRow[];
  records: Record<PapsId, PapsRecord>;
  measuredDate: string;
  homeLayout: 'a' | 'b' | 'c';
  planVariant: 'a' | 'b';
  postureVariant: 'a' | 'b';
  selectedCategory: PapsId | null;
  inputValue: string;
  lastResult: SubmitResult | null;
  overall: () => number;
  setHomeLayout: (v: 'a' | 'b' | 'c') => void;
  setPlanVariant: (v: 'a' | 'b') => void;
  setPostureVariant: (v: 'a' | 'b') => void;
  selectCategory: (id: PapsId) => void;
  setInputValue: (v: string) => void;
  submitRecord: () => void;
  closeResult: () => void;
};

export const useFitnessStore = create<FitnessState>((set, get) => ({
  profile: [
    { label: '생년월일', value: '2010.03.14' },
    { label: '성별 / 나이', value: '남 · 16세' },
    { label: '키', value: '172 cm' },
    { label: '체중', value: '61 kg' },
  ],
  records: {
    pacer: { value: 78, grade: 2 },
    flex: { value: 9, grade: 3 },
    jump: { value: 198, grade: 2 },
    grip: { value: 32, grade: 3 },
    bodyfat: { value: 18, grade: 2 },
  },
  measuredDate: '2026.06.24',
  homeLayout: 'a',
  planVariant: 'a',
  postureVariant: 'a',
  selectedCategory: null,
  inputValue: '',
  lastResult: null,

  overall: () => overallGrade(get().records),

  setHomeLayout: (v) => set({ homeLayout: v }),
  setPlanVariant: (v) => set({ planVariant: v }),
  setPostureVariant: (v) => set({ postureVariant: v }),

  selectCategory: (id) =>
    set((state) => ({
      selectedCategory: state.selectedCategory === id ? null : id,
      inputValue: '',
    })),

  setInputValue: (v) => set({ inputValue: v }),

  submitRecord: () => {
    const { selectedCategory, inputValue, records } = get();
    if (!selectedCategory) return;
    const value = parseFloat(inputValue);
    if (Number.isNaN(value)) return;

    const grade = judgeGrade(selectedCategory, value);
    const prev = records[selectedCategory].grade;

    set({
      records: { ...records, [selectedCategory]: { value, grade } },
      lastResult: { id: selectedCategory, value, grade, prev, improved: grade < prev, same: grade === prev },
      selectedCategory: null,
      inputValue: '',
      measuredDate: formatToday(),
    });
  },

  closeResult: () => set({ lastResult: null }),
}));

function formatToday(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}.${mm}.${dd}`;
}
