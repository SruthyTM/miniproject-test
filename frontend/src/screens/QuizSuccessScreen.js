import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export function QuizSuccessScreen({ navigation, route }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#0B091A", "#1D1B38"]} style={StyleSheet.absoluteFill} />

      <View style={styles.header}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoL}>L</Text>
          <Text style={styles.logoE}>E</Text>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.checkCircle}>
           <Text style={styles.checkIcon}>✓</Text>
        </View>

        <View style={styles.badgePassed}>
           <Text style={styles.badgePassedText}>🎓 Quiz Passed!</Text>
        </View>

        <Text style={styles.title}>Quiz Successful!</Text>
        <Text style={styles.subtitle}>
          Congratulations — you have passed the qualification quiz. You may now submit your creative answer.
        </Text>

        <View style={styles.promptCard}>
          <Text style={styles.promptLabel}>YOUR PROMPT</Text>
          <Text style={styles.promptQuote}>"In exactly 25 words, tell us why you should win this prize."</Text>
          <View style={styles.divider} />
          <Text style={styles.timerInfo}>⏰ You have 120 seconds to complete your submission</Text>
        </View>

        <TouchableOpacity 
          style={styles.mainBtn} 
          onPress={() => navigation.navigate("Creative")}
        >
          <Text style={styles.mainBtnText}>Begin Creative Submission →</Text>
        </TouchableOpacity>

        <Text style={styles.timerNotice}>Timer starts when you click above</Text>
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
  header: { alignItems: "center", paddingTop: 10 },
  logoBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.05)", padding: 6, borderRadius: 6 },
  logoL: { color: "#00E5FF", fontWeight: "900", fontStyle: "italic", fontSize: 16 },
  logoE: { color: "#fff", fontWeight: "900", fontStyle: "italic", fontSize: 16, marginLeft: -4 },
  
  body: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 30 },
  checkCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: "#4CAF50", alignItems: "center", justifyContent: "center", marginBottom: 20 },
  checkIcon: { color: "#fff", fontSize: 60, fontWeight: "900" },
  
  badgePassed: { backgroundColor: "rgba(0,229,255,0.1)", paddingHorizontal: 15, paddingVertical: 6, borderRadius: 20, marginBottom: 20, borderWidth: 1, borderColor: "rgba(0,229,255,0.3)" },
  badgePassedText: { color: "#00E5FF", fontWeight: "bold", fontSize: 14 },

  title: { color: "#fff", fontSize: 32, fontWeight: "900", textAlign: "center", marginBottom: 15 },
  subtitle: { color: "#8a8ea8", fontSize: 15, textAlign: "center", lineHeight: 22, marginBottom: 40 },
  
  promptCard: { backgroundColor: "rgba(56, 52, 107, 0.2)", width: "100%", padding: 24, borderRadius: 20, borderWidth: 1, borderColor: "#38346b", marginBottom: 40 },
  promptLabel: { color: "#8a8ea8", fontSize: 12, fontWeight: "bold", letterSpacing: 1, marginBottom: 10 },
  promptQuote: { color: "#fff", fontSize: 18, fontWeight: "bold", fontStyle: "italic", lineHeight: 26 },
  divider: { height: 1, backgroundColor: "rgba(255,255,255,0.1)", marginVertical: 15 },
  timerInfo: { color: "#FFA500", fontSize: 13, fontWeight: "bold" },

  mainBtn: { width: "100%", backgroundColor: "#FF6600", padding: 20, borderRadius: 40, alignItems: "center", shadowColor: "#FF6600", shadowOffset: {width:0, height:0}, shadowOpacity: 0.8, shadowRadius: 15, elevation: 10 },
  mainBtnText: { color: "#fff", fontWeight: "900", fontSize: 18 },
  timerNotice: { color: "#5c5c7d", fontSize: 12, marginTop: 15 },

  themeRow: { flexDirection: "row", alignItems: "center", alignSelf: "center", backgroundColor: "rgba(0,0,0,0.6)", paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, position: "absolute", bottom: 20 },
  themeLabel: { color: "#8a8ea8", fontSize: 10, fontWeight: "bold", marginRight: 10 },
  themeIcon: { width: 14, height: 14, borderRadius: 7, backgroundColor: "#333", marginLeft: 8 },
  themeIconActive: { width: 14, height: 14, borderRadius: 7, backgroundColor: "#fff", borderWidth: 2, borderColor: "#8C52FF", marginLeft: 8 }
});
