import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { api } from "../api/client";
import { ScreenContainer } from "../components/ScreenContainer";
import { colors } from "../theme/colors";

export function LeaderboardScreen({ navigation }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api
      .leaderboard()
      .then((res) => setItems(res.leaderboard || []))
      .catch((err) => Alert.alert("Failed to load leaderboard", err.message));
  }, []);

  return (
    <ScreenContainer title="Leaderboard" subtitle="Top 10 users by total score">
      <View style={styles.box}>
        {items.map((item, index) => (
          <View key={`${item.user_id}-${index}`} style={styles.row}>
            <Text style={styles.rank}>#{index + 1}</Text>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.score}>{item.total_score}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.btn} onPress={() => navigation.goBack()}>
        <Text style={styles.btnText}>Back</Text>
      </TouchableOpacity>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  box: { width: "100%", borderWidth: 1, borderColor: colors.surfaceBorder, borderRadius: 12, backgroundColor: colors.surface, marginBottom: 10 },
  row: { flexDirection: "row", padding: 12, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.06)", alignItems: "center" },
  rank: { color: colors.primary, width: 40, fontWeight: "900" },
  name: { color: colors.text, flex: 1, fontWeight: "700" },
  score: { color: colors.accent, fontWeight: "900" },
  btn: { backgroundColor: colors.secondary, padding: 14, borderRadius: 10, alignItems: "center" },
  btnText: { color: colors.text, fontWeight: "900" },
});
