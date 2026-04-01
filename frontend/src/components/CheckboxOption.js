import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export function CheckboxOption({ label, checked, onPress }) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
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
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  box: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#666",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  boxChecked: {
    backgroundColor: "#1e88e5",
    borderColor: "#1e88e5",
  },
  check: {
    color: "white",
    fontWeight: "700",
  },
  label: {
    flex: 1,
    fontSize: 15,
  },
});
