import { colors, withAlpha } from '../theme/colors';

export type DayTag = 'done' | 'today' | 'plan' | 'rest';

export type WeekDay = {
  d: string;
  focus: string;
  tag: DayTag;
  items: string[];
  summary: string;
  tagText: string;
  tagFg: string;
  tagBg: string;
  dotBg: string;
  dotFg: string;
  cardBg: string;
};

const DAY_DEFS: { d: string; focus: string; tag: DayTag; items: string[]; summary: string }[] = [
  { d: '월', focus: '유연성', tag: 'done', items: ['동적 스트레칭 10분', '앉아 앞으로 굽히기 3세트'], summary: '스트레칭 3세트' },
  { d: '화', focus: '근력', tag: 'done', items: ['푸시업 3×12', '플랭크 40초 × 3'], summary: '상체 근력' },
  { d: '수', focus: '심폐', tag: 'today', items: ['인터벌 러닝 20분'], summary: '러닝 20분' },
  { d: '목', focus: '휴식', tag: 'rest', items: ['가벼운 산책 15분'], summary: '가벼운 회복' },
  { d: '금', focus: '순발력', tag: 'plan', items: ['제자리 점프 4세트', '버피 3×10'], summary: '점프·버피' },
  { d: '토', focus: '전신', tag: 'plan', items: ['전신 서킷 25분'], summary: '서킷 25분' },
  { d: '일', focus: '휴식', tag: 'rest', items: ['스트레칭 & 회복'], summary: '회복' },
];

const TAG_META: Record<DayTag, { text: string; fg: string; bg: string; dotBg: string; dotFg: string }> = {
  done: {
    text: '완료',
    fg: colors.accentForegroundGreen,
    bg: withAlpha(colors.accentForegroundGreen, 0.12),
    dotBg: colors.accentForegroundGreen,
    dotFg: colors.staticWhite,
  },
  today: {
    text: '오늘',
    fg: colors.staticWhite,
    bg: colors.primaryNormal,
    dotBg: colors.primaryNormal,
    dotFg: colors.staticWhite,
  },
  plan: {
    text: '예정',
    fg: colors.labelNeutral,
    bg: colors.fillNormal,
    dotBg: colors.fillStrong,
    dotFg: colors.labelNeutral,
  },
  rest: {
    text: '휴식',
    fg: colors.labelAlternative,
    bg: colors.fillNormal,
    dotBg: colors.fillNormal,
    dotFg: colors.labelAlternative,
  },
};

export function getWeekDays(): WeekDay[] {
  return DAY_DEFS.map((day) => {
    const tag = TAG_META[day.tag];
    return {
      ...day,
      tagText: tag.text,
      tagFg: tag.fg,
      tagBg: tag.bg,
      dotBg: tag.dotBg,
      dotFg: tag.dotFg,
      cardBg: day.tag === 'today' ? withAlpha(colors.primaryNormal, 0.08) : colors.fillNormal,
    };
  });
}
