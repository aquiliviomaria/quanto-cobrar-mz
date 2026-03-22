import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { colors } from '../../theme';

interface Props {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export function CustomButton({ title, onPress, variant = 'primary', loading, disabled, style }: Props) {
  const bg = variant === 'primary' ? colors.primary : variant === 'danger' ? colors.error : 'transparent';
  const textColor = variant === 'secondary' ? colors.primary : '#fff';
  const borderColor = variant === 'secondary' ? colors.primary : 'transparent';

  return (
    <TouchableOpacity
      style={[styles.btn, { backgroundColor: bg, borderColor, borderWidth: variant === 'secondary' ? 1.5 : 0 }, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading
        ? <ActivityIndicator color={textColor} />
        : <Text style={[styles.text, { color: textColor }]}>{title}</Text>
      }
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 15,
    fontWeight: '600',
  },
});
