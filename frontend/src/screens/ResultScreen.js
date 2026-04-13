import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useAppState } from "../../App";
import { ScreenContainer } from "../components/ScreenContainer";
import { colors } from "../theme/colors";

export function ResultScreen({ navigation }) {
  const { quizResult } = useAppState();

  React.useEffect(() => {
    navigation.replace("Creative");
  }, []);

  if (!quizResult) {
    return (
      <ScreenContainer title="Results" subtitle="No result found">
        <TouchableOpacity style={styles.btnSecondary} onPress={() => navigation.reset({ index: 0, routes: [{ name: "Login" }] })}>
          <Text style={styles.btnTextSecondary}>Return Home</Text>
        </TouchableOpacity>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer title="Challenge Complete" subtitle="Your final score and global ranking">
      <View style={styles.scoreCard}>
        <Text style={styles.scoreLabel}>YOUR FINAL SCORE</Text>
        <Text style={styles.scoreValue}>{quizResult.score} <Text style={styles.scoreTotal}>/ {quizResult.total_questions}</Text></Text>
      </View>

      <Text style={styles.leaderboardTitle}>🏆 LEADERBOARD TOP 50</Text>
      <View style={styles.leaderboard}>
        {quizResult.ranking.map((row) => (
          <View key={`${row.rank}-${row.email}`} style={styles.rankRow}>
            <View style={styles.rankLeft}>
              <Text style={styles.rankBadge}>#{row.rank}</Text>
              <Text style={styles.rankEmail}>{row.email.split("@")[0]}***</Text>
            </View>
            <Text style={styles.rankScore}>{row.score} pts</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.btn} onPress={() => navigation.reset({ index: 0, routes: [{ name: "Landing" }] })}>
        <Text style={styles.btnText}>Finish & Return</Text>
      </TouchableOpacity>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scoreCard: { backgroundColor: "rgba(0,229,255,0.1)", borderWidth: 1, borderColor: "rgba(0,229,255,0.3)", borderRadius: 16, padding: 24, alignItems: "center", marginBottom: 30 },
  scoreLabel: { color: colors.primary, fontSize: 12, fontWeight: "bold", letterSpacing: 1, marginBottom: 8 },
  scoreValue: { color: colors.text, fontSize: 36, fontWeight: "900" },
  scoreTotal: { color: colors.textMuted, fontSize: 20 },
  leaderboardTitle: { color: "#FFD700", fontSize: 14, fontWeight: "bold", marginBottom: 12 },
  leaderboard: { width: "100%", backgroundColor: colors.surface, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: colors.surfaceBorder, marginBottom: 24 },
  rankRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.05)" },
  rankLeft: { flexDirection: "row", alignItems: "center" },
  rankBadge: { color: colors.primary, fontWeight: "900", width: 30 },
  rankEmail: { color: colors.textMuted, fontWeight: "600" },
  rankScore: { color: colors.accent, fontWeight: "bold" },
  btn: { backgroundColor: colors.secondary, padding: 16, borderRadius: 12, alignItems: "center", width: "100%" },
  btnText: { color: colors.text, fontWeight: "900", fontSize: 16 },
  btnSecondary: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.surfaceBorder, padding: 16, borderRadius: 12, alignItems: "center", width: "100%" },
  btnTextSecondary: { color: colors.text, fontWeight: "bold", fontSize: 16 },
});
