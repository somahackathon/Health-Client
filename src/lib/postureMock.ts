import { colors, withAlpha } from '../theme/colors';

export type SegmentType = 'good' | 'warn' | 'bad';

const SEGMENT_META: Record<SegmentType, { icon: string; label: string; fg: string; bg: string }> = {
  good: { icon: 'check', label: '좋은 자세', fg: colors.accentForegroundGreen, bg: withAlpha(colors.accentForegroundGreen, 0.14) },
  warn: {
    icon: 'triangle-exclamation',
    label: '주의',
    fg: colors.accentForegroundOrange,
    bg: withAlpha(colors.accentForegroundOrange, 0.14),
  },
  bad: { icon: 'close', label: '교정 필요', fg: colors.accentForegroundRed, bg: withAlpha(colors.accentForegroundRed, 0.14) },
};

const SEGMENT_DEFS: { t: string; type: SegmentType; text: string }[] = [
  { t: '0:02', type: 'good', text: '시작 자세가 안정적이에요. 발 간격이 어깨너비로 적절합니다.' },
  { t: '0:05', type: 'warn', text: '무릎이 발끝보다 앞으로 나왔어요. 엉덩이를 더 뒤로 빼보세요.' },
  { t: '0:08', type: 'bad', text: '허리가 굽었어요. 가슴을 펴고 시선을 정면으로 두세요.' },
  { t: '0:12', type: 'good', text: '하강 깊이가 적절해요. 허벅지가 바닥과 수평을 이뤘습니다.' },
];

export function getSegments() {
  return SEGMENT_DEFS.map((s) => ({ ...s, ...SEGMENT_META[s.type] }));
}

type CheckpointGrade = 'good' | 'warn' | 'bad';

const CHECKPOINT_META: Record<CheckpointGrade, { fg: string; icon: string }> = {
  good: { fg: colors.accentForegroundGreen, icon: 'circle-check-fill' },
  warn: { fg: colors.accentForegroundOrange, icon: 'circle-exclamation-fill' },
  bad: { fg: colors.accentForegroundRed, icon: 'circle-close-fill' },
};

const CHECKPOINT_DEFS: { name: string; score: number; grade: CheckpointGrade }[] = [
  { name: '무릎 정렬', score: 70, grade: 'warn' },
  { name: '허리 중립', score: 55, grade: 'bad' },
  { name: '하강 깊이', score: 92, grade: 'good' },
  { name: '발 간격', score: 95, grade: 'good' },
  { name: '상체 각도', score: 78, grade: 'warn' },
];

export function getCheckpoints() {
  return CHECKPOINT_DEFS.map((c) => ({ ...c, ...CHECKPOINT_META[c.grade] }));
}

export const POSTURE_SCORE = 82;
export const CORRECT_COUNT = 2;
export const POSTURE_VERDICT = '전반적으로 양호해요';
export const EXERCISES = ['스쿼트', '푸시업', '런지', '플랭크'];
