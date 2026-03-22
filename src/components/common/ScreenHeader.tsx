import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../theme';

interface Props {
  title: string;
  onBack?: () => void;
  rightAction?: { label: string; onPress: () => void };
}

export function ScreenHeader({ title, onBack, rightAction }: Props) {
  return (
    <View style={styles.header}>
      {onBack
        ? <TouchableOpacity onPress={onBack} style={styles.back}>
            <Text style={styles.backText}>← Voltar</Text>
          </TouchableOpacity>
        : <View style={styles.back} />
      }
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
      {rightAction
        ? <TouchableOpacity onPress={rightAction.onPress} style={styles.right}>
            <Text style={styles.rightText}>{rightAction.label}</Text>
          </TouchableOpacity>
        : <View style={styles.right} />
      }
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  back: { width: 80 },
  backText: { color: colors.primary, fontSize: 14, fontWeight: '500' },
  title: { flex: 1, textAlign: 'center', fontSize: 17, fontWeight: '700', color: colors.text },
  right: { width: 80, alignItems: 'flex-end' },
  rightText: { color: colors.primary, fontSize: 14, fontWeight: '600' },
});
