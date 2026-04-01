import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

export function ScreenContainer({ title, subtitle, children }) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        <View style={styles.body}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f7f7f8" },
  content: { padding: 16 },
  title: { fontSize: 26, fontWeight: "700", marginBottom: 6 },
  subtitle: { color: "#666", marginBottom: 16 },
  body: { gap: 10 },
});
