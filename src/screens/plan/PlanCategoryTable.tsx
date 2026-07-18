import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { WeekDay } from '../../lib/planWeek';
import { colors, radius } from '../../theme/colors';

type CategoryBar = { cat: string; grade: number; fg: string; pct: number };

type Props = { categoryBars: CategoryBar[]; weekDays: WeekDay[] };

export default function PlanCategoryTable({ categoryBars, weekDays }: Props) {
  return (
    <View>
      <Text style={styles.title}>종목별 현재 수준</Text>
      <View style={{ gap: 14, marginBottom: 22 }}>
        {categoryBars.map((c) => (
          <View key={c.cat}>
            <View style={styles.barHeader}>
              <Text style={styles.barLabel}>{c.cat}</Text>
              <Text style={[styles.barGrade, { color: c.fg }]}>{c.grade}등급</Text>
            </View>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: `${c.pct}%`, backgroundColor: c.fg }]} />
            </View>
          </View>
        ))}
      </View>

      <Text style={styles.title}>주간 스케줄</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        {weekDays.map((day) => (
          <View key={day.d} style={[styles.dayCard, { backgroundColor: day.cardBg }]}>
            <View style={[styles.dot, { backgroundColor: day.dotBg }]}>
              <Text style={[styles.dotText, { color: day.dotFg }]}>{day.d}</Text>
            </View>
            <Text style={styles.focus}>{day.focus}</Text>
            <Text style={styles.summary} numberOfLines={2}>
              {day.summary}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 16, fontWeight: '700', color: colors.labelNormal, marginBottom: 12 },
  barHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  barLabel: { fontSize: 13, fontWeight: '600', color: colors.labelNormal },
  barGrade: { fontSize: 12, fontWeight: '600' },
  barTrack: { height: 9, borderRadius: radius.pill, backgroundColor: colors.fillNormal, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: radius.pill },
  dayCard: { width: 92, padding: 12, paddingHorizontal: 10, borderRadius: radius.card, alignItems: 'center' },
  dot: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  dotText: { fontSize: 12, fontWeight: '700' },
  focus: { fontSize: 12, fontWeight: '700', color: colors.labelNormal, marginBottom: 4 },
  summary: { fontSize: 10, fontWeight: '500', color: colors.labelAlternative, height: 26, textAlign: 'center' },
});
