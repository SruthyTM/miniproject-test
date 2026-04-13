import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAppState } from "../../App";

export function ShortlistedDetailScreen({ navigation, route }) {
  const data = route.params?.data || {};
  const totalEntries = data.total_entries?.toLocaleString() || "387,241";
  const aiScore = data.ai_score || 94;
  const rank = data.rank || 47;
  const percentile = ((rank / (data.total_entries || 387241)) * 100).toFixed(2);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#0B091A", "#1D1B38"]} style={StyleSheet.absoluteFill} />

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backBtnText}>‹ Back</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.heroSection}>
           <View style={styles.trophyWrapper}>
             <LinearGradient colors={["#FFD700", "#FF8C00"]} style={styles.trophyCircle}>
               <Text style={styles.trophyIcon}>🏆</Text>
             </LinearGradient>
           </View>
           
           <View style={styles.shortlistBadge}>
             <Text style={styles.shortlistBadgeText}>⭐ Shortlisted</Text>
           </View>

           <Text style={styles.congratsTitle}>Congratulations!</Text>
           <Text style={styles.congratsSub}>
             Your entry ranked in the <Text style={styles.highlight}>top {percentile}%</Text> of {totalEntries} entries.
           </Text>
        </View>

        <View style={styles.aiNotice}>
           <Text style={styles.aiText}>
             🧠 <Text style={{fontWeight:'bold'}}>Lucid Engine AI™</Text> — structured deterministic evaluation engine, not generative AI. Scores against a fixed rubric. <Text style={{fontWeight:'bold'}}>Final winners confirmed exclusively by 3 independent human judges.</Text>
           </Text>
        </View>

        <View style={styles.statsCard}>
           <View style={styles.cardHeader}>
             <Text style={styles.cardHeaderTitle}>AI Evaluation Score</Text>
             <Text style={styles.aiEngine}>Lucid Engine AI™</Text>
           </View>

           <View style={styles.scoreRow}>
              <View style={styles.circularProgress}>
                 <View style={styles.innerCircle}>
                    <Text style={styles.scoreBig}>{aiScore}</Text>
                    <Text style={styles.scoreTotal}>/100</Text>
                 </View>
              </View>

              <View style={styles.rankInfo}>
                 <Text style={styles.rankTitle}>Rank #{rank}</Text>
                 <Text style={styles.rankSub}>of {totalEntries} entries</Text>
                 <View style={styles.proceedBadge}>
                    <Text style={styles.proceedText}>✅ Proceeding to judging</Text>
                 </View>
              </View>
           </View>

           <TouchableOpacity style={styles.rubricBtn}>
              <Text style={styles.rubricText}>View Rubric Breakdown</Text>
              <Text style={styles.rubricArrow}>▼</Text>
           </TouchableOpacity>
        </View>

        <View style={styles.submissionSection}>
           <Text style={styles.sectionTitle}>Your Submission</Text>
           
           <View style={styles.promptBox}>
              <Text style={styles.promptLabel}>PROMPT</Text>
              <Text style={styles.promptText}>
                "In exactly 25 words, tell us why you should win this prize."
              </Text>

              <View style={styles.divider} />

              <Text style={styles.promptLabel}>YOUR RESPONSE</Text>
              <Text style={styles.responseText}>
                "This beautiful BMW X5 would carry my young family across the country discovering small towns, sharing stories and creating memories together for many years."
              </Text>
           </View>

           <View style={styles.metaRow}>
              <Text style={styles.metaItem}>✅ 25 words</Text>
              <Text style={styles.metaItem}>🔒 Locked 14 Mar 2026</Text>
           </View>
        </View>

        <View style={styles.nextSteps}>
           <Text style={styles.sectionTitle}>What Happens Next</Text>
           
           {[
             "3 independent judges score your entry separately — no judge sees others' scores",
             "All judges complete evaluation before scores are aggregated",
             "Tied entries subject to secondary review and consensus",
             "Independent scrutineer verifies the process and confirms the final result",
             "Winners announced at competition close"
           ].map((step, i) => (
             <View key={i} style={styles.stepRow}>
               <View style={styles.stepNumWrap}>
                 <Text style={styles.stepNum}>{i+1}</Text>
               </View>
               <Text style={styles.stepText}>{step}</Text>
             </View>
           ))}
        </View>

        <TouchableOpacity style={styles.auditBtn}>
            <Text style={styles.auditText}>🛡️ Immutable Audit Trail</Text>
            <Text style={styles.auditArrow}>▼</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.viewEntriesBtn} onPress={() => navigation.navigate("Dashboard")}>
            <Text style={styles.viewEntriesBtnText}>View All My Entries</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>Pure skill. One prize. One winner.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B091A" },
  scroll: { paddingBottom: 60 },
  header: { paddingHorizontal: 20, paddingTop: 10 },
  backBtn: { paddingVertical: 8 },
  backBtnText: { color: "#8a8ea8", fontSize: 16, fontWeight: "bold" },

  heroSection: { alignItems: "center", marginTop: 10, paddingHorizontal: 30 },
  trophyWrapper: { width: 100, height: 100, borderRadius: 50, padding: 4, backgroundColor: 'rgba(255,215,0,0.2)', marginBottom: 20 },
  trophyCircle: { flex: 1, borderRadius: 50, alignItems: "center", justifyContent: "center" },
  trophyIcon: { fontSize: 40 },
  
  shortlistBadge: { backgroundColor: "rgba(0,229,255,0.1)", paddingHorizontal: 15, paddingVertical: 6, borderRadius: 20, marginBottom: 15, borderWidth: 1, borderColor: "rgba(0,229,255,0.3)" },
  shortlistBadgeText: { color: "#00E5FF", fontWeight: "bold", fontSize: 13 },

  congratsTitle: { color: "#fff", fontSize: 32, fontWeight: "900", marginBottom: 10 },
  congratsSub: { color: "#8a8ea8", fontSize: 15, textAlign: "center", lineHeight: 22 },
  highlight: { color: "#FFD700", fontWeight: "bold" },

  aiNotice: { backgroundColor: "rgba(140, 82, 255, 0.1)", marginHorizontal: 20, marginTop: 30, padding: 15, borderRadius: 12, borderWidth: 1, borderColor: "rgba(140, 82, 255, 0.2)" },
  aiText: { color: "#c1c4d6", fontSize: 11, textAlign: "center", lineHeight: 18 },

  statsCard: { backgroundColor: "rgba(56, 52, 107, 0.2)", marginHorizontal: 20, marginTop: 25, borderRadius: 24, borderWidth: 1, borderColor: "#38346b", padding: 20 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 25 },
  cardHeaderTitle: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  aiEngine: { color: "#5c5c7d", fontSize: 10, fontWeight: "bold" },
  
  scoreRow: { flexDirection: "row", alignItems: "center", marginBottom: 25 },
  circularProgress: { width: 90, height: 90, borderRadius: 45, borderWidth: 6, borderColor: "#FF6600", alignItems: "center", justifyContent: "center" },
  innerCircle: { alignItems: "center" },
  scoreBig: { color: "#fff", fontSize: 30, fontWeight: "bold" },
  scoreTotal: { color: "#8a8ea8", fontSize: 14 },

  rankInfo: { marginLeft: 25, flex: 1 },
  rankTitle: { color: "#fff", fontSize: 28, fontWeight: "900" },
  rankSub: { color: "#8a8ea8", fontSize: 13, marginTop: 4 },
  proceedBadge: { backgroundColor: "rgba(76,175,80,0.15)", alignSelf: "flex-start", marginTop: 10, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  proceedText: { color: "#4CAF50", fontSize: 11, fontWeight: "bold" },

  rubricBtn: { flexDirection: "row", justifyContent: "space-between", marginTop: 10, paddingTop: 15, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.05)" },
  rubricText: { color: "#FFD700", fontWeight: "bold", fontSize: 13 },
  rubricArrow: { color: "#FFD700", fontSize: 12 },

  submissionSection: { backgroundColor: "rgba(56, 52, 107, 0.15)", marginHorizontal: 20, marginTop: 25, borderRadius: 24, borderWidth: 1, borderColor: "#38346b", padding: 20 },
  sectionTitle: { color: "#fff", fontSize: 17, fontWeight: "bold", marginBottom: 20 },
  promptBox: { backgroundColor: "rgba(0,0,0,0.2)", padding: 20, borderRadius: 16 },
  promptLabel: { color: "#5c5c7d", fontSize: 10, fontWeight: "bold", letterSpacing: 1, marginBottom: 8 },
  promptText: { color: "#8a8ea8", fontSize: 13, fontStyle: "italic", marginBottom: 15 },
  divider: { height: 1, backgroundColor: "rgba(255,255,255,0.05)", marginVertical: 15 },
  responseText: { color: "#fff", fontSize: 15, fontWeight: "bold", fontStyle: "italic", lineHeight: 22 },
  
  metaRow: { flexDirection: "row", marginTop: 15, gap: 15 },
  metaItem: { color: "#4CAF50", fontSize: 11, fontWeight: "bold" },

  nextSteps: { backgroundColor: "rgba(140, 82, 255, 0.05)", marginHorizontal: 20, marginTop: 25, borderRadius: 24, borderWidth: 1, borderColor: "rgba(140, 82, 255, 0.1)", padding: 20 },
  stepRow: { flexDirection: "row", marginBottom: 15 },
  stepNumWrap: { width: 22, height: 22, borderRadius: 11, backgroundColor: "#8C52FF", alignItems: "center", justifyContent: "center", marginRight: 15, marginTop: 2 },
  stepNum: { color: "#fff", fontSize: 11, fontWeight: "bold" },
  stepText: { color: "#c1c4d6", fontSize: 13, flex: 1, lineHeight: 20 },

  auditBtn: { flexDirection: "row", justifyContent: "space-between", marginHorizontal: 20, marginTop: 25, backgroundColor: "rgba(0,0,0,0.3)", padding: 18, borderRadius: 20, borderWidth: 1, borderColor: "rgba(255,153,0,0.3)" },
  auditText: { color: "#FF9900", fontWeight: "bold", fontSize: 14 },
  auditArrow: { color: "#FF9900", fontSize: 12 },

  viewEntriesBtn: { backgroundColor: "#FF6600", marginHorizontal: 20, marginTop: 30, padding: 20, borderRadius: 35, alignItems: "center" },
  viewEntriesBtnText: { color: "#fff", fontWeight: "900", fontSize: 18 },

  footerText: { color: "#5c5c7d", fontWeight: "bold", fontSize: 11, textAlign: "center", marginTop: 30 }
});
