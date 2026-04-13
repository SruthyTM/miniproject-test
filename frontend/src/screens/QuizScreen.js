import React, { useEffect, useMemo, useState } from "react";
import { Alert, Text, TouchableOpacity, StyleSheet, View } from "react-native";
import { useAppState } from "../../App";
import { api } from "../api/client";
import { ScreenContainer } from "../components/ScreenContainer";
import { colors } from "../theme/colors";

export function QuizScreen({ navigation }) {
  const { token, setQuizSessionId, quizSessionId, setQuizResult } = useAppState();
  const [question, setQuestion] = useState(null);
  const [index, setIndex] = useState(0);
  const [total, setTotal] = useState(15);
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (!token) {
      navigation.reset({ index: 0, routes: [{ name: "Login" }] });
      return;
    }
    api.startQuiz(token)
      .then((res) => {
        setQuizSessionId(res.session_id);
        setQuestion(res.current_question);
        setIndex(res.current_index);
        setTotal(res.total_questions);
        setRemaining(res.total_duration_seconds);
      })
      .catch((e) => Alert.alert("Error", e.message));
  }, [token, navigation, setQuizSessionId]);

  useEffect(() => {
    if (!quizSessionId || !token) return undefined;
    const timer = setInterval(async () => {
      try {
        const data = await api.remainingSeconds(quizSessionId, token);
        setRemaining(data.remaining_seconds);
        if (data.remaining_seconds <= 0) {
          navigation.replace("Timeout");
        }
      } catch (_err) {}
    }, 1000);
    return () => clearInterval(timer);
  }, [quizSessionId, token, navigation]);

  const title = useMemo(() => `Challenge in Progress (${index + 1}/${total})`, [index, total]);

  async function submit(answerIndex) {
    try {
      const res = await api.submitAnswer(quizSessionId, answerIndex, token);
      if (res.timed_out) {
        navigation.replace("Timeout");
        return;
      }
      if (res.completed) {
        const result = await api.result(quizSessionId, token);
        setQuizResult(result);
        navigation.replace("FinalAnswer", { quizScore: result.score });
        return;
      }
      setQuestion(res.next_question);
      setIndex(res.next_index);
    } catch (err) {
      Alert.alert("Submit Failed", err.message);
    }
  }

  if (!question) {
    return <ScreenContainer title="Challenge" subtitle="Initializing secure environment..." />;
  }

  return (
    <ScreenContainer title="Challenge" subtitle={title}>
      <View style={styles.timerWrap}>
        <Text style={styles.timerLabel}>SECONDS REMAINING: </Text>
        <Text style={styles.timerVal}>{remaining}</Text>
      </View>
      <Text style={styles.qText}>{question.question}</Text>
      {question.options.map((opt, idx) => (
        <TouchableOpacity key={idx} style={styles.choiceBtn} onPress={() => submit(idx)}>
          <Text style={styles.choiceText}>{opt}</Text>
        </TouchableOpacity>
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  timerWrap: { backgroundColor: "rgba(255,153,0,0.1)", padding: 12, borderRadius: 8, borderWidth: 1, borderColor: "rgba(255,153,0,0.3)", flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 20 },
  timerLabel: { color: colors.accent, fontWeight: "bold", fontSize: 12 },
  timerVal: { color: colors.accent, fontWeight: "900", fontSize: 18, fontVariant: ["tabular-nums"] },
  qText: { color: colors.text, fontSize: 18, fontWeight: "800", marginBottom: 20, textAlign: "center" },
  choiceBtn: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.surfaceBorder, padding: 16, borderRadius: 12, marginBottom: 12, alignItems: "center" },
  choiceText: { color: colors.text, fontSize: 16, fontWeight: "700" },
});
