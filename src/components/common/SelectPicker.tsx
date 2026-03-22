import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import { colors } from '../../theme';

interface Props {
  label: string;
  value: string;
  options: readonly string[] | string[];
  onChange: (val: string) => void;
  error?: string;
}

export function SelectPicker({ label, value, options, onChange, error }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={[styles.input, error ? styles.inputError : null]} onPress={() => setOpen(true)}>
        <Text style={value ? styles.valueText : styles.placeholder}>
          {value || 'Selecionar...'}
        </Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Modal visible={open} transparent animationType="fade">
        <TouchableOpacity style={styles.overlay} onPress={() => setOpen(false)}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>{label}</Text>
            <FlatList
              data={options as string[]}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.option, item === value && styles.optionSelected]}
                  onPress={() => { onChange(item); setOpen(false); }}
                >
                  <Text style={[styles.optionText, item === value && styles.optionTextSelected]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
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
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputError: { borderColor: colors.error },
  valueText: { fontSize: 15, color: colors.text },
  placeholder: { fontSize: 15, color: colors.textSecondary },
  arrow: { color: colors.textSecondary, fontSize: 12 },
  error: { fontSize: 12, color: colors.error, marginTop: 4 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 24 },
  modal: { backgroundColor: '#fff', borderRadius: 16, maxHeight: 360, overflow: 'hidden' },
  modalTitle: { fontSize: 16, fontWeight: '700', color: colors.text, padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  option: { paddingVertical: 14, paddingHorizontal: 16 },
  optionSelected: { backgroundColor: colors.primary + '15' },
  optionText: { fontSize: 15, color: colors.text },
  optionTextSelected: { color: colors.primary, fontWeight: '600' },
});
