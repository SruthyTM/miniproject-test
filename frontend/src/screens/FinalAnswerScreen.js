import React, { useEffect, useMemo, useRef, useState } from "react";
import { Alert, Animated, Easing, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { useAppState } from "../../App";
import { api } from "../api/client";
import { ScreenContainer } from "../components/ScreenContainer";
import { colors } from "../theme/colors";

const MAX_WORDS = 25;
const FINAL_QUESTION =
  "Explain why teamwork is important in software development (max 25 words)";

function wordCount(text) {
  const normalized = text.trim();
  if (!normalized) return 0;
  return normalized.split(/\s+/).length;
}

export function FinalAnswerScreen({ navigation, route }) {
  const { token, email, quizResult, setFinalResult } = useAppState();
  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scanAnim = useRef(new Animated.Value(0)).current;
  const words = useMemo(() => wordCount(answer), [answer]);
  const quizScore = route.params?.quizScore ?? quizResult?.score ?? 0;

  const tooManyWords = words > MAX_WORDS;
  const canSubmit = words > 0 && !tooManyWords && !isSubmitting;

  useEffect(() => {
    if (!isSubmitting) {
      pulseAnim.setValue(1);
      return undefined;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    );
    const scanner = Animated.loop(
      Animated.timing(scanAnim, {
        toValue: 1,
        duration: 1400,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    scanner.start();
    return () => {
      loop.stop();
      scanner.stop();
    };
  }, [isSubmitting, pulseAnim, scanAnim]);

  async function onSubmit() {
    if (!canSubmit) {
      Alert.alert("Invalid answer", "Please enter 1 to 25 words.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.submitFinalAnswer({ userId: email, answer: answer.trim() }, token);
      setFinalResult({ ...res, quiz_score: quizScore });
      navigation.replace("Result");
    } catch (err) {
      Alert.alert("Submission failed", err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ScreenContainer title="Final Question" subtitle="Write your answer to unlock bonus points">
      <Text style={styles.question}>{FINAL_QUESTION}</Text>
      <TextInput
        style={styles.input}
        multiline
        numberOfLines={5}
        placeholder="Type your answer..."
        placeholderTextColor={colors.textMuted}
        value={answer}
        onChangeText={setAnswer}
        editable={!isSubmitting}
      />
      <View style={styles.counterWrap}>
        <Text style={[styles.counter, tooManyWords && styles.counterError]}>
          {words}/{MAX_WORDS} words
        </Text>
      </View>
      <TouchableOpacity style={[styles.btn, !canSubmit && styles.btnDisabled]} disabled={!canSubmit} onPress={onSubmit}>
        <Text style={styles.btnText}>{isSubmitting ? "Submitting..." : "Submit Final Answer"}</Text>
      </TouchableOpacity>
      {isSubmitting && (
        <View style={styles.overlay}>
          <Animated.View style={[styles.overlayCard, { transform: [{ scale: pulseAnim }] }]}>
            <View style={styles.logoWrap}>
              <Animated.View
                style={[
                  styles.scanLine,
                  {
                    transform: [
                      {
                        translateY: scanAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-20, 20],
                        }),
                      },
                    ],
                  },
                ]}
              />
              <Text style={styles.geminiMark}>✦</Text>
            </View>
            <Text style={styles.overlayTitle}>We are analyzing your answer</Text>
            <Text style={styles.overlaySub}>Evaluating relevance, clarity, and completeness...</Text>
          </Animated.View>
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  question: { color: colors.text, fontSize: 16, fontWeight: "700", marginBottom: 10 },
  input: {
    minHeight: 120,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    borderRadius: 12,
    backgroundColor: colors.surface,
    color: colors.text,
    padding: 14,
    textAlignVertical: "top",
  },
  counterWrap: { alignItems: "flex-end", marginBottom: 10 },
  counter: { color: colors.textMuted, fontWeight: "700" },
  counterError: { color: "#ff7b7b" },
  btn: { backgroundColor: colors.secondary, padding: 16, borderRadius: 12, alignItems: "center" },
  btnDisabled: { opacity: 0.45 },
  btnText: { color: colors.text, fontWeight: "900", fontSize: 16 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(11,13,30,0.82)",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  overlayCard: {
    width: "86%",
    backgroundColor: "rgba(17,14,38,0.95)",
    borderColor: colors.surfaceBorder,
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    gap: 10,
  },
  logoWrap: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 1,
    borderColor: "rgba(138,92,255,0.7)",
    backgroundColor: "rgba(138,92,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  geminiMark: {
    color: "#b59cff",
    fontSize: 34,
    fontWeight: "900",
    textShadowColor: "rgba(181,156,255,0.6)",
    textShadowRadius: 14,
  },
  scanLine: {
    position: "absolute",
    left: 8,
    right: 8,
    height: 14,
    borderRadius: 8,
    backgroundColor: "rgba(0,229,255,0.22)",
  },
  overlayTitle: { color: colors.text, fontWeight: "900", fontSize: 17, textAlign: "center" },
  overlaySub: { color: colors.textMuted, textAlign: "center", marginBottom: 4 },
});
