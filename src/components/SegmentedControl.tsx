import { useEffect, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius } from '../theme/colors';

type Item = { label: string; value: string };

type Props = {
  items: Item[];
  value: string;
  onChange: (value: string) => void;
};

export default function SegmentedControl({ items, value, onChange }: Props) {
  const [trackWidth, setTrackWidth] = useState(0);
  const activeIndex = Math.max(
    0,
    items.findIndex((item) => item.value === value),
  );
  const [anim] = useState(() => new Animated.Value(activeIndex));

  useEffect(() => {
    Animated.spring(anim, { toValue: activeIndex, useNativeDriver: true, speed: 20, bounciness: 6 }).start();
  }, [activeIndex, anim]);

  const thumbWidth = trackWidth > 0 ? (trackWidth - 4) / items.length : 0;
  const translateX = anim.interpolate({
    inputRange: items.map((_, i) => i),
    outputRange: items.map((_, i) => i * thumbWidth),
  });

  return (
    <View style={styles.track} onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}>
      {trackWidth > 0 && (
        <Animated.View style={[styles.thumb, { width: thumbWidth, transform: [{ translateX }] }]} />
      )}
      {items.map((item) => {
        const active = item.value === value;
        return (
          <Pressable key={item.value} onPress={() => onChange(item.value)} style={styles.segment}>
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
  thumb: {
    position: 'absolute',
    top: 2,
    bottom: 2,
    left: 2,
    borderRadius: radius.field - 2,
    backgroundColor: colors.backgroundNormal,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { fontSize: 12, fontWeight: '600', color: colors.labelAlternative },
  textActive: { color: colors.labelNormal },
});
