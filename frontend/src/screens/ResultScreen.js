import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useAppState } from "../../App";
import { ScreenContainer } from "../components/ScreenContainer";
import { colors } from "../theme/colors";

export function ResultScreen({ navigation }) {
  const { finalResult, setToken, setEmail, setQuizSessionId, setQuizResult, setFinalResult } = useAppState();
  const threshold = 150;
  const showRetry = finalResult?.total_score < 120;

  if (!finalResult) {
    return (
      <ScreenContainer title="Results" subtitle="No result found">
        <TouchableOpacity style={styles.btnSecondary} onPress={() => navigation.reset({ index: 0, routes: [{ name: "Landing" }] })}>
          <Text style={styles.btnTextSecondary}>Return Home</Text>
        </TouchableOpacity>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer title="Challenge Complete" subtitle="Quiz + AI bonus final result">
      <View style={styles.scoreCard}>
        <Text style={styles.scoreLabel}>QUIZ SCORE</Text>
        <Text style={styles.scoreMini}>{finalResult.quiz_score}</Text>
        <Text style={styles.scoreLabel}>AI SCORE</Text>
        <Text style={styles.scoreMini}>{finalResult.ai_score}</Text>
        <Text style={styles.scoreLabel}>FEEDBACK</Text>
        <Text style={styles.feedback}>{finalResult.feedback}</Text>
        <Text style={styles.scoreLabel}>TOTAL SCORE</Text>
        <Text style={styles.scoreValue}>{finalResult.total_score}</Text>
        {finalResult.total_score > threshold && <Text style={styles.won}>You Won</Text>}
      </View>

      <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("Leaderboard")}>
        <Text style={styles.btnText}>View Leaderboard</Text>
      </TouchableOpacity>
      {showRetry && (
        <TouchableOpacity style={styles.btnSecondary} onPress={() => navigation.reset({ index: 0, routes: [{ name: "Eligibility" }] })}>
          <Text style={styles.btnTextSecondary}>Retry Quiz</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={styles.btnSecondary}
        onPress={() => {
          setToken(null);
          setEmail("");
          setQuizSessionId(null);
          setQuizResult(null);
          setFinalResult(null);
          navigation.reset({ index: 0, routes: [{ name: "Landing" }] });
        }}
      >
        <Text style={styles.btnTextSecondary}>Logout</Text>
      </TouchableOpacity>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scoreCard: { backgroundColor: "rgba(0,229,255,0.1)", borderWidth: 1, borderColor: "rgba(0,229,255,0.3)", borderRadius: 16, padding: 24, alignItems: "center", marginBottom: 20 },
  scoreLabel: { color: colors.primary, fontSize: 12, fontWeight: "bold", letterSpacing: 1, marginBottom: 8 },
  scoreMini: { color: colors.text, fontSize: 22, fontWeight: "900", marginBottom: 10 },
  scoreValue: { color: colors.text, fontSize: 36, fontWeight: "900" },
  feedback: { color: colors.textMuted, fontWeight: "600", marginBottom: 10, textAlign: "center" },
  won: { color: "#00ff95", fontWeight: "900", fontSize: 20, marginTop: 10 },
  btn: { backgroundColor: colors.secondary, padding: 16, borderRadius: 12, alignItems: "center", width: "100%", marginBottom: 10 },
  btnText: { color: colors.text, fontWeight: "900", fontSize: 16 },
  btnSecondary: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.surfaceBorder, padding: 16, borderRadius: 12, alignItems: "center", width: "100%" },
  btnTextSecondary: { color: colors.text, fontWeight: "bold", fontSize: 16 },
});
