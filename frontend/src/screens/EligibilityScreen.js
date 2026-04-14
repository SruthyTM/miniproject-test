import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAppState } from "../../App";
import { api } from "../api/client";

export function EligibilityScreen({ navigation }) {
  const { token, appTheme, setAppTheme } = useAppState();
  const themeBgColors = appTheme === "blue" ? ["#0B101A", "#152E4D"] : appTheme === "green" ? ["#0A1A0D", "#15401E"] : appTheme === "orange" ? ["#1A0C0B", "#421A0F"] : ["#0B091A", "#1D1B38"];

  const [checkedItems, setCheckedItems] = useState([false, false, false]);

  const toggleCheck = (index) => {
    const next = [...checkedItems];
    next[index] = !next[index];
    setCheckedItems(next);
  };

  const count = checkedItems.filter(Boolean).length;
  const allChecked = count === 3;

  async function onContinue() {
    if (!allChecked) return;
    try {
      // Mapping to match backend EXPECTATION of dict
      // id 1, 2, 3 from questions.py
      const answers = {
        "1": [0],
        "2": [0],
        "3": [0]
      };
      await api.submitEligibility(answers, token);
      navigation.replace("Quiz");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={themeBgColors} style={StyleSheet.absoluteFill} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={{ color: "#fff", fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <View style={styles.logoBadge}>
          <Text style={styles.logoL}>L</Text>
          <Text style={styles.logoE}>E</Text>
          <View style={{ marginLeft: 6 }}>
            <Text style={{ fontSize: 6, color: "#fff" }}>Powered by</Text>
            <Text style={{ fontSize: 9, color: "#00E5FF", fontWeight: "bold" }}>Lucid Engine AI</Text>
          </View>
        </View>
      </View>

      <View style={styles.stepperRow}>
        <View style={styles.stepCircleDone}><Text style={styles.checkmark}>✓</Text></View>
        <View style={styles.line} />
        <View style={styles.stepCircleDone}><Text style={styles.checkmark}>✓</Text></View>
        <View style={styles.line} />
        <View style={styles.stepCircleActive}><Text style={styles.stepNum}>3</Text><Text style={styles.stepLabel}>Eligibility</Text></View>
        <View style={styles.line} />
        <View style={styles.stepCircleInactive}><Text style={styles.stepNum}>4</Text></View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Entry Eligibility</Text>
        <Text style={styles.subtitle}>Please confirm the following before proceeding to payment.</Text>

        {[
          "I confirm I am eligible to enter this competition.",
          "I understand a maximum of 10 entries is permitted per competition.",
          "I acknowledge that this is a competition of skill, not chance."
        ].map((text, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.checkContainer, checkedItems[i] && styles.checkContainerActive]}
            onPress={() => toggleCheck(i)}
          >
            <View style={[styles.checkbox, checkedItems[i] && styles.checkboxActive]}>
              {checkedItems[i] && <Text style={styles.checkmarkInner}>✓</Text>}
            </View>
            <Text style={styles.checkText}>{text}</Text>
          </TouchableOpacity>
        ))}

        <View style={styles.statusBox}>
          <Text style={styles.statusText}>
            ☑️ Please confirm all {count} / 3 items above to continue.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.mainBtn, !allChecked && styles.mainBtnDisabled]}
          onPress={onContinue}
          disabled={!allChecked}
        >
          <Text style={styles.mainBtnText}>Start Quiz →</Text>
        </TouchableOpacity>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            ℹ️ <Text style={{ fontWeight: 'bold' }}>Important:</Text> Payment is processed into a designated competition trust account. Entries are recorded upon successful quiz completion and creative submission.
          </Text>
        </View>

        <Text style={styles.footerText}>Pure skill. One prize. One winner.</Text>
      </ScrollView>

            <View style={{flexDirection: "row", alignItems: "center", alignSelf: "center", backgroundColor: "rgba(0,0,0,0.6)", paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, position: "absolute", bottom: 20, zIndex: 1000}}>
        <Text style={{color: "#8a8ea8", fontSize: 10, fontWeight: "bold", marginRight: 10}}>THEME</Text>
        <TouchableOpacity onPress={() => { console.log('theme click purple'); setAppTheme("purple"); }}><View style={{width: 14, height: 14, borderRadius: 7, backgroundColor: appTheme === "purple" ? "#fff" : "#8C52FF", borderWidth: appTheme === "purple" ? 2 : 0, borderColor: "#8C52FF", marginLeft: 8}} /></TouchableOpacity>
        <TouchableOpacity onPress={() => { console.log('theme click blue'); setAppTheme("blue"); }}><View style={{width: 14, height: 14, borderRadius: 7, backgroundColor: appTheme === "blue" ? "#fff" : "#00E5FF", borderWidth: appTheme === "blue" ? 2 : 0, borderColor: "#00E5FF", marginLeft: 8}} /></TouchableOpacity>
        <TouchableOpacity onPress={() => { console.log('theme click green'); setAppTheme("green"); }}><View style={{width: 14, height: 14, borderRadius: 7, backgroundColor: appTheme === "green" ? "#fff" : "#4CAF50", borderWidth: appTheme === "green" ? 2 : 0, borderColor: "#4CAF50", marginLeft: 8}} /></TouchableOpacity>
        <TouchableOpacity onPress={() => { console.log('theme click orange'); setAppTheme("orange"); }}><View style={{width: 14, height: 14, borderRadius: 7, backgroundColor: appTheme === "orange" ? "#fff" : "#FF9900", borderWidth: appTheme === "orange" ? 2 : 0, borderColor: "#FF9900", marginLeft: 8}} /></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B091A" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    justifyContent: "space-between"
  },
  backBtn: { width: 40, height: 40, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.05)", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#333" },
  logoBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.05)", padding: 6, borderRadius: 6 },
  logoL: { color: "#00E5FF", fontWeight: "900", fontStyle: "italic", fontSize: 16 },
  logoE: { color: "#fff", fontWeight: "900", fontStyle: "italic", fontSize: 16, marginLeft: -4 },

  stepperRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 20, paddingHorizontal: 30 },
  stepCircleDone: { width: 24, height: 24, borderRadius: 12, backgroundColor: "#4CAF50", alignItems: "center", justifyContent: "center" },
  stepCircleActive: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFA500", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  stepCircleInactive: { width: 24, height: 24, borderRadius: 12, backgroundColor: "#333", alignItems: "center", justifyContent: "center" },
  line: { flex: 1, height: 1, backgroundColor: "#333", marginHorizontal: 5 },
  checkmark: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  stepNum: { color: "#000", fontWeight: "bold", fontSize: 12 },
  stepLabel: { color: "#000", fontWeight: "bold", fontSize: 12, marginLeft: 6 },

  scroll: { paddingHorizontal: 24, paddingTop: 30, paddingBottom: 100 },
  title: { color: "#fff", fontSize: 26, fontWeight: "900" },
  subtitle: { color: "#8a8ea8", fontSize: 14, marginTop: 10, marginBottom: 30 },

  checkContainer: { flexDirection: "row", alignItems: "flex-start", backgroundColor: "rgba(255,255,255,0.03)", padding: 20, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  checkContainerActive: { borderColor: "#38346b", backgroundColor: "rgba(56, 52, 107, 0.2)" },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 1, borderColor: "rgba(255,255,255,0.5)", marginRight: 16, alignItems: "center", justifyContent: "center" },
  checkboxActive: { backgroundColor: "#FFA500", borderColor: "#FFA500" },
  checkmarkInner: { color: "#000", fontWeight: "bold" },
  checkText: { color: "#c1c4d6", fontSize: 14, flex: 1, lineHeight: 20 },

  statusBox: { backgroundColor: "rgba(255,165,0,0.1)", padding: 12, borderRadius: 10, borderWidth: 1, borderColor: "rgba(255,165,0,0.3)", marginBottom: 30 },
  statusText: { color: "#FFA500", fontSize: 13, fontWeight: "bold", textAlign: "center" },

  mainBtn: { backgroundColor: "#FF6600", padding: 18, borderRadius: 30, alignItems: "center", shadowColor: "#FF6600", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 15, elevation: 10 },
  mainBtnDisabled: { opacity: 0.5 },
  mainBtnText: { color: "#fff", fontWeight: "900", fontSize: 16 },

  infoBox: { backgroundColor: "rgba(255,255,255,0.03)", padding: 16, borderRadius: 16, marginTop: 30, borderWidth: 1, borderColor: "#38346b" },
  infoText: { color: "#8a8ea8", fontSize: 12, lineHeight: 18 },

  footerText: { color: "#5c5c7d", fontWeight: "bold", fontSize: 12, textAlign: "center", marginTop: 40 },

  themeRow: { flexDirection: "row", alignItems: "center", alignSelf: "center", backgroundColor: "rgba(0,0,0,0.6)", paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, position: "absolute", bottom: 20 },
  themeLabel: { color: "#8a8ea8", fontSize: 10, fontWeight: "bold", marginRight: 10 },
  themeIcon: { width: 14, height: 14, borderRadius: 7, backgroundColor: "#333", marginLeft: 8 },
  themeIconActive: { width: 14, height: 14, borderRadius: 7, backgroundColor: "#fff", borderWidth: 2, borderColor: "#FFA500", marginLeft: 8 }
});
