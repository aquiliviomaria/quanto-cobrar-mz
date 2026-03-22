import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { colors } from '../../theme';

interface Props extends TextInputProps {
  label: string;
  error?: string;
}

export function CustomInput({ label, error, style, ...props }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error ? styles.inputError : null, style]}
        placeholderTextColor={colors.textSecondary}
        {...props}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '500', color: colors.text, marginBottom: 6 },
  input: {
    backgroundColor: colors.inputBg,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputError: { borderColor: colors.error },
  error: { fontSize: 12, color: colors.error, marginTop: 4 },
});
