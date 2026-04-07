import React, { useEffect, useState } from "react";
import { Alert, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useAppState } from "../../App";
import { api } from "../api/client";
import { CheckboxOption } from "../components/CheckboxOption";
import { ScreenContainer } from "../components/ScreenContainer";
import { colors } from "../theme/colors";

export function EligibilityScreen({ navigation }) {
  const { token } = useAppState();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    if (!token) {
      navigation.reset({ index: 0, routes: [{ name: "Login" }] });
      return;
    }
    api.eligibilityQuestions(token)
      .then(setQuestions)
      .catch((e) => Alert.alert("Error", e.message));
  }, [token, navigation]);

  function toggle(questionId, optionIndex) {
    const current = answers[questionId] || [];
    const exists = current.includes(optionIndex);
    const next = exists ? current.filter((v) => v !== optionIndex) : [...current, optionIndex];
    setAnswers((prev) => ({ ...prev, [questionId]: next }));
  }

  async function onSubmit() {
    try {
      await api.submitEligibility(answers, token);
      navigation.replace("Quiz");
    } catch (err) {
      Alert.alert("Submit Failed", err.message);
    }
  }

  return (
    <ScreenContainer title="Eligibility" subtitle="Calibrate your agent profile">
      {questions.map((q) => (
        <React.Fragment key={q.id}>
          <Text style={styles.qText}>{q.text}</Text>
          {q.options.map((opt, idx) => (
            <CheckboxOption
              key={`${q.id}-${idx}`}
              label={opt}
              checked={(answers[q.id] || []).includes(idx)}
              onPress={() => toggle(q.id, idx)}
            />
          ))}
        </React.Fragment>
      ))}
      <TouchableOpacity style={styles.btn} onPress={onSubmit}>
        <Text style={styles.btnText}>Proceed to Challenge →</Text>
      </TouchableOpacity>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  qText: { fontWeight: "900", marginBottom: 12, color: colors.text, fontSize: 16 },
  btn: { backgroundColor: colors.accent, padding: 16, borderRadius: 12, alignItems: "center", marginTop: 16 },
  btnText: { color: colors.bg1, fontWeight: "900", fontSize: 16 },
});
