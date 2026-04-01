import React, { useEffect, useState } from "react";
import { Alert, Button, Text } from "react-native";

import { useAppState } from "../../App";
import { api } from "../api/client";
import { CheckboxOption } from "../components/CheckboxOption";
import { ScreenContainer } from "../components/ScreenContainer";

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
    <ScreenContainer title="Eligibility" subtitle="Step 4: answer pre-quiz MCQs">
      {questions.map((q) => (
        <React.Fragment key={q.id}>
          <Text style={{ fontWeight: "700", marginBottom: 8 }}>{q.text}</Text>
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
      <Button title="Submit Eligibility" onPress={onSubmit} />
    </ScreenContainer>
  );
}
