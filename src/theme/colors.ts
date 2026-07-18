// Color values transcribed from the Wanted Design System tokens (fig-tokens.css, light theme).
export function withAlpha(rgb: string, alpha: number): string {
  const [r, g, b] = rgb.match(/\d+/g)!.map(Number);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const colors = {
  primaryNormal: 'rgb(51, 102, 255)',
  primaryStrong: 'rgb(0, 94, 235)',
  primaryHeavy: 'rgb(0, 84, 209)',

  labelNormal: 'rgb(23, 23, 23)',
  labelNeutral: 'rgba(46, 47, 51, 0.88)',
  labelAlternative: 'rgba(55, 56, 60, 0.61)',
  labelAssistive: 'rgba(55, 56, 60, 0.28)',
  labelDisable: 'rgba(55, 56, 60, 0.16)',

  backgroundNormal: 'rgb(255, 255, 255)',
  backgroundAlternative: 'rgb(247, 247, 248)',
  backgroundElevated: 'rgb(255, 255, 255)',

  fillAlternative: 'rgba(112, 115, 124, 0.05)',
  fillNormal: 'rgba(112, 115, 124, 0.08)',
  fillStrong: 'rgba(112, 115, 124, 0.16)',

  lineAlternative: 'rgba(112, 115, 124, 0.08)',
  lineNeutral: 'rgba(112, 115, 124, 0.16)',
  lineNormal: 'rgba(112, 115, 124, 0.22)',
  lineSolidStrong: 'rgb(174, 176, 182)',

  staticWhite: 'rgb(255, 255, 255)',
  staticBlack: 'rgb(0, 0, 0)',

  accentForegroundGreen: 'rgb(0, 150, 50)',
  accentForegroundBlue: 'rgb(0, 94, 235)',
  accentForegroundViolet: 'rgb(91, 55, 237)',
  accentForegroundOrange: 'rgb(209, 118, 0)',
  accentForegroundRed: 'rgb(229, 34, 34)',
  accentForegroundCyan: 'rgb(0, 152, 178)',

  accentBackgroundGreen: 'rgb(0, 191, 64)',
  accentBackgroundBlue: 'rgb(0, 102, 255)',
  accentBackgroundViolet: 'rgb(101, 65, 242)',
  accentBackgroundOrange: 'rgb(255, 146, 0)',
  accentBackgroundRed: 'rgb(255, 66, 66)',
  accentBackgroundCyan: 'rgb(0, 189, 222)',
} as const;

export const radius = {
  field: 12,
  button: 10,
  card: 16,
  cardLarge: 18,
  cardXLarge: 20,
  pill: 100,
};

export type GradeColorKey = 'green' | 'blue' | 'violet' | 'orange' | 'red';

const GRADE_ACCENT: Record<GradeColorKey, { fg: string; bg: string }> = {
  green: { fg: colors.accentForegroundGreen, bg: colors.accentBackgroundGreen },
  blue: { fg: colors.accentForegroundBlue, bg: colors.accentBackgroundBlue },
  violet: { fg: colors.accentForegroundViolet, bg: colors.accentBackgroundViolet },
  orange: { fg: colors.accentForegroundOrange, bg: colors.accentBackgroundOrange },
  red: { fg: colors.accentForegroundRed, bg: colors.accentBackgroundRed },
};

export const GRADE_COLOR_KEY: Record<number, GradeColorKey> = {
  1: 'green',
  2: 'blue',
  3: 'violet',
  4: 'orange',
  5: 'red',
};

export function gradeColor(grade: number): { fg: string; bg: string } {
  const key = GRADE_COLOR_KEY[grade] ?? 'red';
  const accent = GRADE_ACCENT[key];
  return { fg: accent.fg, bg: withAlpha(accent.bg, 0.14) };
}
