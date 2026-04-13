import React, { useState, useEffect, useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAppState } from "../../App";
import { api } from "../api/client";

export function QuizScreen({ navigation }) {
  const { token, setQuizSessionId, quizSessionId, setQuizResult } = useAppState();
  const [question, setQuestion] = useState(null);
  const [index, setIndex] = useState(0);
  const [total, setTotal] = useState(20);
  const [remaining, setRemaining] = useState(20);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [loading, setLoading] = useState(false);

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
        setRemaining(20); // Each question gets 20 seconds
      })
      .catch((e) => {
        Alert.alert("Error", e.message);
        navigation.goBack();
      });
  }, [token, navigation]);

  useEffect(() => {
    if (!quizSessionId || !token || !question) return undefined;
    
    const timer = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Handle timeout
          api.result(quizSessionId, token).then(res => {
            navigation.replace("Timeout", { attemptsCount: res.attempts_count });
          }).catch(() => {
             navigation.replace("Timeout", { attemptsCount: 1 });
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizSessionId, token, navigation, question, index]); // Reset interval when index changes

  async function onNext() {
    if (selectedIdx === null || loading) return;
    setLoading(true);
    try {
      const res = await api.submitAnswer(quizSessionId, selectedIdx, token);

      if (!res.correct) {
        const finalRes = await api.result(quizSessionId, token);
        navigation.replace("IncorrectAnswer", { attemptsCount: finalRes.attempts_count });
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
      setSelectedIdx(null);
      setRemaining(20); // Reset timer for next question
    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  }

  const progress = (index + 1) / total;

  if (!question) return null;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#0B091A", "#1D1B38"]} style={StyleSheet.absoluteFill} />

      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Qualification Quiz</Text>
          <Text style={styles.headerSub}>{`Question ${index + 1} of ${total} • 100% pass required`}</Text>
        </View>
        <View style={styles.timerBadge}>
           <Text style={styles.timerIcon}>⏰</Text>
           <Text style={styles.timerText}>{remaining} sec</Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
      </View>

      <View style={styles.body}>
        <View style={styles.badgeRow}>
          <Text style={{ color: "#00E5FF", fontWeight: "bold", fontSize: 12 }}>
            DEBUG: CORRECT ANSWER = {["A", "B", "C", "D"][question.correct_answer]}
          </Text>
        </View>
        <View style={styles.badgeRow}>
          <View style={styles.badgeType}><Text style={styles.badgeTypeText}>MULTIPLE CHOICE</Text></View>
          <View style={styles.badgeMonitor}>
             <Text style={styles.badgeMonitorText}>👁️ Session monitored</Text>
          </View>
        </View>

        <Text style={styles.questionText}>{question.question}</Text>

        <View style={styles.optionsList}>
          {question.options.map((opt, i) => {
            const label = ["A", "B", "C", "D"][i];
            const isSelected = selectedIdx === i;
            return (
              <TouchableOpacity 
                key={i} 
                style={[styles.optionBtn, isSelected && styles.optionBtnActive]} 
                onPress={() => setSelectedIdx(i)}
              >
                <View style={[styles.optionLabel, isSelected && styles.optionLabelActive]}>
                  <Text style={[styles.optionLabelText, isSelected && styles.optionLabelTextActive]}>{label}</Text>
                </View>
                <Text style={styles.optionText}>{opt}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.hintText}>Select an answer to continue</Text>

        <TouchableOpacity 
          style={[styles.nextBtn, (selectedIdx === null || loading) && styles.nextBtnDisabled]} 
          onPress={onNext}
          disabled={selectedIdx === null || loading}
        >
          <Text style={styles.nextBtnText}>{loading ? "Saving..." : "Next Question →"}</Text>
        </TouchableOpacity>

        <View style={styles.securityBox}>
          <Text style={styles.securityText}>🛡️ Anti-cheat monitoring active • Do not navigate away</Text>
          <Text style={styles.demoText}>Demo: Skills assessment in progress • B/C/D = advance</Text>
        </View>
      </View>

      <View style={styles.themeRow}>
        <Text style={styles.themeLabel}>THEME</Text>
        <View style={styles.themeIconWhite} />
        <View style={styles.themeIcon} />
        <View style={styles.themeIcon} />
        <View style={styles.themeIcon} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B091A" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingTop: 10, paddingBottom: 15 },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "900" },
  headerSub: { color: "#8a8ea8", fontSize: 11, marginTop: 2 },
  timerBadge: { backgroundColor: "rgba(0,0,0,0.4)", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#333" },
  timerIcon: { fontSize: 14, marginRight: 6 },
  timerText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  
  progressContainer: { height: 4, backgroundColor: "#333", width: "100%" },
  progressBar: { height: "100%", backgroundColor: "#00E5FF" },

  body: { flex: 1, paddingHorizontal: 25, paddingTop: 30 },
  badgeRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  badgeType: { backgroundColor: "rgba(140,82,255,0.2)", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, marginRight: 10 },
  badgeTypeText: { color: "#8C52FF", fontSize: 10, fontWeight: "900" },
  badgeMonitor: { flexDirection: "row", alignItems: "center" },
  badgeMonitorText: { color: "#5c5c7d", fontSize: 11 },

  questionText: { color: "#fff", fontSize: 22, fontWeight: "900", lineHeight: 30, marginBottom: 30 },
  
  optionsList: { gap: 12 },
  optionBtn: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.03)", padding: 16, borderRadius: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.05)" },
  optionBtnActive: { borderColor: "#38346b", backgroundColor: "rgba(56, 52, 107, 0.2)" },
  optionLabel: { width: 34, height: 34, borderRadius: 8, backgroundColor: "rgba(255,255,255,0.1)", alignItems: "center", justifyContent: "center", marginRight: 16 },
  optionLabelActive: { backgroundColor: "#38346b" },
  optionLabelText: { color: "#8a8ea8", fontWeight: "900", fontSize: 14 },
  optionLabelTextActive: { color: "#fff" },
  optionText: { color: "#c1c4d6", fontSize: 16, fontWeight: "bold" },

  hintText: { color: "#5c5c7d", fontSize: 13, textAlign: "center", marginTop: 25, marginBottom: 15 },
  nextBtn: { backgroundColor: "#FF6600", padding: 18, borderRadius: 30, alignItems: "center", shadowColor: "#FF6600", shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.8, shadowRadius: 15, elevation: 10 },
  nextBtnDisabled: { opacity: 0.5 },
  nextBtnText: { color: "#fff", fontWeight: "900", fontSize: 17 },

  securityBox: { marginTop: 30, alignItems: "center" },
  securityText: { color: "#5c5c7d", fontSize: 11, marginBottom: 4 },
  demoText: { color: "#333", fontSize: 10 },

  themeRow: { flexDirection: "row", alignItems: "center", alignSelf: "center", backgroundColor: "rgba(0,0,0,0.6)", paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, position: "absolute", bottom: 20 },
  themeLabel: { color: "#8a8ea8", fontSize: 10, fontWeight: "bold", marginRight: 10 },
  themeIcon: { width: 14, height: 14, borderRadius: 7, backgroundColor: "#333", marginLeft: 8 },
  themeIconWhite: { width: 14, height: 14, borderRadius: 7, backgroundColor: "#fff", borderWidth: 2, borderColor: "#8C52FF", marginLeft: 8 }
});
