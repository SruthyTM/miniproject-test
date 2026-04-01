import React, { useEffect, useMemo, useState } from "react";
import { Alert, Button, Text } from "react-native";

import { useAppState } from "../../App";
import { api } from "../api/client";
import { ScreenContainer } from "../components/ScreenContainer";

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
      } catch (_err) {
        // Ignore transient timer polling errors.
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [quizSessionId, token, navigation]);

  const title = useMemo(
    () => `Step 5: quiz in progress (${index + 1}/${total})`,
    [index, total]
  );

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
        navigation.replace("Result");
        return;
      }
      setQuestion(res.next_question);
      setIndex(res.next_index);
    } catch (err) {
      Alert.alert("Submit Failed", err.message);
    }
  }

  if (!question) {
    return <ScreenContainer title="Quiz" subtitle="Loading quiz..." />;
  }

  return (
    <ScreenContainer title="Quiz" subtitle={title}>
      <Text style={{ fontWeight: "700", marginBottom: 8 }}>
        Time Remaining: {remaining}s
      </Text>
      <Text style={{ fontSize: 17, marginBottom: 10 }}>{question.question}</Text>
      {question.options.map((opt, idx) => (
        <Button key={idx} title={opt} onPress={() => submit(idx)} />
      ))}
    </ScreenContainer>
  );
}
