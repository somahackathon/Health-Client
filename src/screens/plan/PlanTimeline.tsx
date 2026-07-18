import { StyleSheet, Text, View } from 'react-native';

import { WeekDay } from '../../lib/planWeek';
import { colors } from '../../theme/colors';

type Props = { weekDays: WeekDay[] };

export default function PlanTimeline({ weekDays }: Props) {
  return (
    <View>
      <Text style={styles.title}>이번 주 운동 계획</Text>
      {weekDays.map((day, index) => (
        <View key={day.d} style={styles.row}>
          <View style={styles.dotColumn}>
            <View style={[styles.dot, { backgroundColor: day.dotBg }]}>
              <Text style={[styles.dotText, { color: day.dotFg }]}>{day.d}</Text>
            </View>
            {index < weekDays.length - 1 && <View style={styles.connector} />}
          </View>
          <View style={styles.content}>
            <View style={styles.contentHeader}>
              <Text style={styles.focus}>{day.focus}</Text>
              <View style={[styles.tag, { backgroundColor: day.tagBg }]}>
                <Text style={[styles.tagText, { color: day.tagFg }]}>{day.tagText}</Text>
              </View>
            </View>
            {day.items.map((item) => (
              <Text key={item} style={styles.item}>
                · {item}
              </Text>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 16, fontWeight: '700', color: colors.labelNormal, marginBottom: 6 },
  row: { flexDirection: 'row', gap: 14 },
  dotColumn: { width: 34, alignItems: 'center' },
  dot: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  dotText: { fontSize: 14, fontWeight: '700' },
  connector: { flex: 1, width: 2, backgroundColor: colors.lineNormal, marginVertical: 2 },
  content: { flex: 1, paddingBottom: 16 },
  contentHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  focus: { fontSize: 14, fontWeight: '700', color: colors.labelNormal },
  tag: { paddingVertical: 2, paddingHorizontal: 7, borderRadius: 6 },
  tagText: { fontSize: 10, fontWeight: '600' },
  item: { fontSize: 13, fontWeight: '500', color: colors.labelNeutral, lineHeight: 18, marginTop: 2 },
});
