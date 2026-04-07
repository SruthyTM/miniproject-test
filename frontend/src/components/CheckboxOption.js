import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

export function CheckboxOption({ label, checked, onPress }) {
  return (
    <Pressable style={[styles.row, checked && styles.rowChecked]} onPress={onPress}>
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked ? <Text style={styles.check}>✓</Text> : null}
      </View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    borderRadius: 14,
    backgroundColor: colors.surface,
  },
  rowChecked: {
    borderColor: colors.primary,
    backgroundColor: "rgba(0,229,255,0.05)",
  },
  box: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: colors.textMuted,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  boxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  check: {
    color: "#000",
    fontWeight: "900",
  },
  label: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
  },
});
