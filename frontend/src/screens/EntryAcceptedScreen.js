import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAppState } from "../../App";

export function EntryAcceptedScreen({ navigation, route }) {
  const { entryReference, submittedAt } = route.params || {};
  const { appTheme } = useAppState();
  const themeBgColors = appTheme === "blue" ? ["#0B101A", "#152E4D"] : appTheme === "green" ? ["#0A1A0D", "#15401E"] : appTheme === "orange" ? ["#1A0C0B", "#421A0F"] : ["#0B091A", "#1D1B38"];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={themeBgColors} style={StyleSheet.absoluteFill} />

      <View style={styles.body}>
        <View style={styles.checkCircle}>
           <Text style={styles.checkIcon}>✓</Text>
        </View>

        <View style={styles.badgeAccepted}>
           <Text style={styles.badgeText}>✔️ Entry Accepted!</Text>
        </View>

        <Text style={styles.title}>Entry Accepted!</Text>
        <Text style={styles.subtitle}>
          Your entry has been successfully submitted and recorded.
        </Text>

        <View style={styles.infoCard}>
           <View style={styles.row}>
             <Text style={styles.label}>Word Count</Text>
             <Text style={styles.value}>25 / 25 ✓</Text>
           </View>
           <View style={styles.row}>
             <Text style={styles.label}>Entry Reference</Text>
             <Text style={styles.value}>{entryReference || "TBSC-2026-004521"}</Text>
           </View>
           <View style={styles.row}>
             <Text style={styles.label}>Submitted</Text>
             <Text style={styles.value}>{submittedAt || "18 Mar 2026, 14:32 UTC"}</Text>
           </View>
           <View style={[styles.row, { borderBottomWidth: 0 }]}>
             <Text style={styles.label}>Status</Text>
             <Text style={[styles.value, { color: '#4CAF50' }]}>Entry Recorded ✓</Text>
           </View>
        </View>

        <Text style={styles.emailNotice}>
          A confirmation email has been sent to your registered email address.
        </Text>

        <TouchableOpacity 
          style={styles.mainBtn} 
          onPress={() => navigation.navigate("Dashboard")}
        >
          <Text style={styles.mainBtnText}>Return to Dashboard</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.themeRow}>
        <Text style={styles.themeLabel}>THEME</Text>
        <View style={styles.themeIconActive} />
        <View style={styles.themeIcon} />
        <View style={styles.themeIcon} />
        <View style={styles.themeIcon} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B091A" },
  body: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 30 },
  checkCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: "#4CAF50", alignItems: "center", justifyContent: "center", marginBottom: 20 },
  checkIcon: { color: "#fff", fontSize: 50, fontWeight: "900" },

  badgeAccepted: { backgroundColor: "rgba(76,175,80,0.1)", paddingHorizontal: 15, paddingVertical: 6, borderRadius: 20, marginBottom: 20, borderWidth: 1, borderColor: "rgba(76,175,80,0.3)" },
  badgeText: { color: "#4CAF50", fontWeight: "bold", fontSize: 13 },

  title: { color: "#fff", fontSize: 30, fontWeight: "900", marginBottom: 15 },
  subtitle: { color: "#8a8ea8", fontSize: 14, textAlign: "center", marginBottom: 40 },

  infoCard: { backgroundColor: "rgba(255,255,255,0.03)", width: "100%", borderRadius: 20, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", padding: 20 },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.05)" },
  label: { color: "#8a8ea8", fontSize: 13 },
  value: { color: "#fff", fontSize: 13, fontWeight: "bold" },

  emailNotice: { color: "#5c5c7d", fontSize: 12, textAlign: "center", marginTop: 30, lineHeight: 18, paddingHorizontal: 20 },

  mainBtn: { width: "100%", backgroundColor: "#FF6600", padding: 18, borderRadius: 30, alignItems: "center", marginTop: 40, shadowColor: "#FF6600", shadowOffset: {width:0, height:0}, shadowOpacity: 0.8, shadowRadius: 10 },
  mainBtnText: { color: "#fff", fontWeight: "900", fontSize: 16 },

  themeRow: { flexDirection: "row", alignItems: "center", alignSelf: "center", backgroundColor: "rgba(0,0,0,0.6)", paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, position: "absolute", bottom: 20 },
  themeLabel: { color: "#8a8ea8", fontSize: 10, fontWeight: "bold", marginRight: 10 },
  themeIcon: { width: 14, height: 14, borderRadius: 7, backgroundColor: "#333", marginLeft: 8 },
  themeIconActive: { width: 14, height: 14, borderRadius: 7, backgroundColor: "#fff", borderWidth: 2, borderColor: "#8C52FF", marginLeft: 8 }
});
