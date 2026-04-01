import React from "react";
import { Button, Text, View } from "react-native";

import { useAppState } from "../../App";
import { ScreenContainer } from "../components/ScreenContainer";

export function ResultScreen({ navigation }) {
  const { quizResult } = useAppState();

  if (!quizResult) {
    return (
      <ScreenContainer title="Result" subtitle="No result found">
        <Button title="Go to Login" onPress={() => navigation.reset({ index: 0, routes: [{ name: "Login" }] })} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer title="Result & Ranking" subtitle="Step 6: final outcome">
      <Text style={{ fontWeight: "700", marginBottom: 10 }}>
        Total Marks: {quizResult.score} / {quizResult.total_questions}
      </Text>
      {quizResult.ranking.map((row) => (
        <View
          key={`${row.rank}-${row.email}`}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingVertical: 6,
            borderBottomWidth: 1,
            borderColor: "#eee",
          }}
        >
          <Text>
            #{row.rank} {row.email}
          </Text>
          <Text>{row.score}</Text>
        </View>
      ))}
      <Button title="Restart Flow" onPress={() => navigation.reset({ index: 0, routes: [{ name: "Register" }] })} />
    </ScreenContainer>
  );
}
