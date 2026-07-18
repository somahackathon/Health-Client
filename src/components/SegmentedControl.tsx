import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius } from '../theme/colors';

type Item = { label: string; value: string };

type Props = {
  items: Item[];
  value: string;
  onChange: (value: string) => void;
};

export default function SegmentedControl({ items, value, onChange }: Props) {
  return (
    <View style={styles.track}>
      {items.map((item) => {
        const active = item.value === value;
        return (
          <Pressable
            key={item.value}
            onPress={() => onChange(item.value)}
            style={[styles.segment, active && styles.segmentActive]}
          >
            <Text style={[styles.text, active && styles.textActive]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    height: 32,
    borderRadius: radius.field,
    backgroundColor: colors.fillNormal,
    padding: 2,
  },
  segment: {
    flex: 1,
    borderRadius: radius.field - 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentActive: {
    backgroundColor: colors.backgroundNormal,
    shadowColor: '#17191C',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  text: { fontSize: 12, fontWeight: '600', color: colors.labelAlternative },
  textActive: { color: colors.labelNormal },
});
