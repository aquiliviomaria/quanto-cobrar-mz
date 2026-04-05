import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme';

interface Props {
  title: string;
  onBack?: () => void;
  rightAction?: { icon?: string; label?: string; onPress: () => void };
}

export function ScreenHeader({ title, onBack, rightAction }: Props) {
  return (
    <View style={styles.header}>
      {onBack ? (
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
      {rightAction ? (
        <TouchableOpacity onPress={rightAction.onPress} style={styles.rightBtn}>
          {rightAction.icon
            ? <Ionicons name={rightAction.icon as any} size={22} color={colors.primary} />
            : <Text style={styles.rightText}>{rightAction.label}</Text>
          }
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14,
    backgroundColor: colors.surface,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: colors.inputBg,
    alignItems: 'center', justifyContent: 'center',
  },
  placeholder: { width: 40 },
  title: { flex: 1, textAlign: 'center', fontSize: 17, fontWeight: '700', color: colors.text },
  rightBtn: { width: 40, alignItems: 'flex-end' },
  rightText: { color: colors.primary, fontSize: 14, fontWeight: '600' },
});
