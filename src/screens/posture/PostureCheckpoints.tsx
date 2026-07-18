import { StyleSheet, Text, View } from 'react-native';

import Icon from '../../components/Icon';
import { getCheckpoints } from '../../lib/postureMock';
import { colors, radius } from '../../theme/colors';

export default function PostureCheckpoints() {
  const checkpoints = getCheckpoints();
  return (
    <View>
      <Text style={styles.title}>항목별 점수</Text>
      <View style={{ gap: 16 }}>
        {checkpoints.map((cp) => (
          <View key={cp.name}>
            <View style={styles.header}>
              <Icon name={cp.icon} size={17} color={cp.fg} />
              <Text style={styles.name}>{cp.name}</Text>
              <Text style={[styles.score, { color: cp.fg }]}>{cp.score}</Text>
            </View>
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${cp.score}%`, backgroundColor: cp.fg }]} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 16, fontWeight: '700', color: colors.labelNormal, marginBottom: 12 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 7 },
  name: { flex: 1, fontSize: 13, fontWeight: '600', color: colors.labelNormal },
  score: { fontSize: 13, fontWeight: '700' },
  track: { height: 8, borderRadius: radius.pill, backgroundColor: colors.fillNormal, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: radius.pill },
});
