import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

export function ScreenContainer({ title, subtitle, children }) {
  return (
    <View style={styles.safe}>
      <LinearGradient colors={[colors.bg1, colors.bg2]} style={StyleSheet.absoluteFill} />
      <View style={styles.glow1} />
      <View style={styles.glow2} />
      <SafeAreaView style={styles.safeInner}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <BlurView intensity={50} tint="dark" style={styles.card}>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            <View style={styles.body}>{children}</View>
          </BlurView>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg1 },
  safeInner: { flex: 1 },
  scroll: {
    flexGrow: 1,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "100%",
    maxWidth: 400,
    padding: 24,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderColor: colors.surfaceBorder,
    borderWidth: 1,
    overflow: "hidden",
  },
  glow1: {
    position: "absolute",
    top: -50,
    left: -50,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "rgba(0,229,255,0.15)",
  },
  glow2: {
    position: "absolute",
    bottom: -50,
    right: -50,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "rgba(140,82,255,0.15)",
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 14,
    marginBottom: 24,
  },
  body: { gap: 12, width: "100%" },
});
