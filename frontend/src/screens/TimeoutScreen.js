import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ScreenContainer } from "../components/ScreenContainer";
import { colors } from "../theme/colors";

export function TimeoutScreen({ navigation }) {
  return (
    <ScreenContainer title="Time's Up!" subtitle="The qualification challenge has ended.">
      <View style={styles.box}>
        <Text style={styles.text}>Your time expired before finishing the quiz. Your existing score has been automatically submitted and finalized.</Text>
      </View>
      <TouchableOpacity style={styles.btn} onPress={() => navigation.reset({ index: 0, routes: [{ name: "Landing" }] })}>
        <Text style={styles.btnText}>Return to Home</Text>
      </TouchableOpacity>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  box: { backgroundColor: "rgba(255,0,0,0.1)", padding: 20, borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,0,0,0.3)", marginBottom: 24 },
  text: { color: "#ffcccc", fontSize: 15, lineHeight: 22, textAlign: "center" },
  btn: { backgroundColor: colors.surface, padding: 16, borderRadius: 12, alignItems: "center", borderWidth: 1, borderColor: colors.surfaceBorder },
  btnText: { color: colors.text, fontWeight: "bold", fontSize: 16 },
});
