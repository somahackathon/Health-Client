// Grading itself always comes from the server (POST /api/v1/paps/evaluations).
// This module only holds presentation helpers shared across screens.

export const GRADE_TEXT: Record<number, string> = {
  1: '매우 우수',
  2: '우수',
  3: '보통',
  4: '노력 필요',
  5: '주의',
};

export function overallGrade(grades: number[]): number | null {
  if (grades.length === 0) return null;
  return Math.round(grades.reduce((a, b) => a + b, 0) / grades.length);
}
