import { useState } from 'react';
import { ActivityIndicator, Animated, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

import { colors, radius } from '../theme/colors';

type Props = {
  title: string;
  onPress?: () => void;
  variant?: 'solid' | 'outlined';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
};

export default function Button({
  title,
  onPress,
  variant = 'solid',
  disabled = false,
  loading = false,
  fullWidth = true,
  style,
}: Props) {
  const isOutlined = variant === 'outlined';
  const isDisabled = disabled || loading;
  const [scale] = useState(() => new Animated.Value(1));

  const animateTo = (toValue: number) => {
    Animated.spring(scale, { toValue, useNativeDriver: true, speed: 40, bounciness: 6 }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => !isDisabled && animateTo(0.97)}
      onPressOut={() => animateTo(1)}
      disabled={isDisabled}
      style={fullWidth && styles.fullWidth}
    >
      <Animated.View
        style={[
          styles.base,
          isOutlined ? styles.outlined : styles.solid,
          fullWidth && styles.fullWidth,
          isDisabled && (isOutlined ? styles.outlinedDisabled : styles.solidDisabled),
          { transform: [{ scale }] },
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={isOutlined ? colors.labelNeutral : colors.staticWhite} />
        ) : (
          <Text
            style={[
              styles.text,
              isOutlined ? styles.outlinedText : styles.solidText,
              isDisabled && styles.disabledText,
            ]}
          >
            {title}
          </Text>
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 48,
    borderRadius: radius.button,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  fullWidth: { width: '100%' },
  solid: { backgroundColor: colors.primaryNormal },
  solidDisabled: { backgroundColor: colors.fillStrong },
  outlined: { backgroundColor: colors.backgroundNormal, borderWidth: 1, borderColor: colors.lineNormal },
  outlinedDisabled: { borderColor: colors.lineAlternative },
  text: { fontSize: 15, fontWeight: '700' },
  solidText: { color: colors.staticWhite },
  outlinedText: { color: colors.labelNeutral },
  disabledText: { color: colors.labelAssistive },
});
