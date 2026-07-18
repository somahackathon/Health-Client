import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from '../components/Button';
import Icon from '../components/Icon';
import SegmentedControl from '../components/SegmentedControl';
import { usePapsEvents } from '../hooks/usePapsEvents';
import { getWeekDays } from '../lib/planWeek';
import { useFitnessStore } from '../store/useFitnessStore';
import { colors, radius, withAlpha } from '../theme/colors';
import PlanCategoryTable from './plan/PlanCategoryTable';
import PlanTimeline from './plan/PlanTimeline';

const PLAN_VARIANT_ITEMS = [
  { label: '요일 타임라인', value: 'a' },
  { label: '주간 표', value: 'b' },
];

const ANALYZE_DELAY_MS = 2600;

export default function PlanScreen() {
  const papsEvents = usePapsEvents();
  const planVariant = useFitnessStore((s) => s.planVariant);
  const setPlanVariant = useFitnessStore((s) => s.setPlanVariant);
  const [planStatus, setPlanStatus] = useState<'analyzing' | 'done'>('done');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const reanalyze = () => {
    setPlanStatus('analyzing');
    timerRef.current = setTimeout(() => setPlanStatus('done'), ANALYZE_DELAY_MS);
  };

  const strengths = papsEvents.filter((e) => e.grade <= 2).map((e) => e.cat);
  const weaknesses = papsEvents.filter((e) => e.grade >= 3).map((e) => e.cat);
  const categoryBars = papsEvents.map((e) => ({
    cat: e.cat,
    grade: e.grade,
    fg: e.fg,
    pct: Math.round(((6 - e.grade) / 5) * 100),
  }));
  const weekDays = getWeekDays();

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={[styles.aiBadge, { backgroundColor: withAlpha(colors.accentForegroundViolet, 0.12) }]}>
            <Icon name="sparkle-fill" size={14} color={colors.accentForegroundViolet} />
            <Text style={[styles.aiBadgeText, { color: colors.accentForegroundViolet }]}>AI 맞춤 분석</Text>
          </View>
          <Text style={styles.title}>주간 체력 향상 계획</Text>
        </View>

        {planStatus === 'analyzing' && (
          <View style={styles.analyzing}>
            <ActivityIndicator size="large" color={colors.primaryNormal} />
            <Text style={styles.analyzingTitle}>AI가 계획을 다시 짜고 있어요</Text>
            <Text style={styles.analyzingCaption}>최신 기록을 분석하는 중입니다.{'\n'}보통 10~20초 정도 걸려요</Text>
          </View>
        )}

        {planStatus === 'done' && (
          <>
            <View style={styles.segmentWrap}>
              <SegmentedControl items={PLAN_VARIANT_ITEMS} value={planVariant} onChange={(v) => setPlanVariant(v as 'a' | 'b')} />
            </View>

            <View style={styles.body}>
              <View style={styles.strengthRow}>
                <View style={[styles.strengthCard, { backgroundColor: withAlpha(colors.accentForegroundGreen, 0.09) }]}>
                  <Text style={[styles.strengthTitle, { color: colors.accentForegroundGreen }]}>강점</Text>
                  <View style={styles.chipRow}>
                    {strengths.map((s) => (
                      <Text key={s} style={styles.chip}>
                        {s}
                      </Text>
                    ))}
                  </View>
                </View>
                <View style={[styles.strengthCard, { backgroundColor: withAlpha(colors.accentForegroundOrange, 0.1) }]}>
                  <Text style={[styles.strengthTitle, { color: colors.accentForegroundOrange }]}>보완할 점</Text>
                  <View style={styles.chipRow}>
                    {weaknesses.map((w) => (
                      <Text key={w} style={styles.chip}>
                        {w}
                      </Text>
                    ))}
                  </View>
                </View>
              </View>

              <View style={[styles.goalCard, { backgroundColor: withAlpha(colors.primaryNormal, 0.07) }]}>
                <View style={styles.goalIcon}>
                  <Icon name="flag-fill" size={22} color={colors.staticWhite} />
                </View>
                <View>
                  <Text style={styles.goalEyebrow}>목표</Text>
                  <Text style={styles.goalTitle}>종합 1등급 · 예상 8주</Text>
                </View>
              </View>

              {planVariant === 'a' ? (
                <PlanTimeline weekDays={weekDays} />
              ) : (
                <PlanCategoryTable categoryBars={categoryBars} weekDays={weekDays} />
              )}

              <Button title="다시 분석하기" variant="outlined" onPress={reanalyze} />
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.backgroundNormal },
  header: { paddingHorizontal: 20, paddingTop: 22, paddingBottom: 6 },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: radius.pill,
    marginBottom: 8,
  },
  aiBadgeText: { fontSize: 11, fontWeight: '700' },
  title: { fontSize: 23, fontWeight: '700', color: colors.labelNormal },
  analyzing: { paddingVertical: 70, paddingHorizontal: 30, alignItems: 'center' },
  analyzingTitle: { fontSize: 17, fontWeight: '700', color: colors.labelNormal, marginTop: 22 },
  analyzingCaption: { fontSize: 13, fontWeight: '500', color: colors.labelAlternative, marginTop: 6, textAlign: 'center', lineHeight: 19 },
  segmentWrap: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4 },
  body: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 24, gap: 16 },
  strengthRow: { flexDirection: 'row', gap: 12 },
  strengthCard: { flex: 1, padding: 16, borderRadius: radius.card },
  strengthTitle: { fontSize: 12, fontWeight: '600', marginBottom: 8 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.labelNormal,
    backgroundColor: colors.backgroundNormal,
    paddingVertical: 4,
    paddingHorizontal: 9,
    borderRadius: 8,
    overflow: 'hidden',
  },
  goalCard: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, paddingHorizontal: 18, borderRadius: radius.card },
  goalIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primaryNormal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalEyebrow: { fontSize: 12, fontWeight: '600', color: colors.labelAlternative },
  goalTitle: { fontSize: 16, fontWeight: '700', color: colors.labelNormal, marginTop: 2 },
});
