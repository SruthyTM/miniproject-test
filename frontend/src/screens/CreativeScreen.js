import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, TextInput, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAppState } from "../../App";
import { api } from "../api/client";

export function CreativeScreen({ navigation }) {
  const { token, quizSessionId, appTheme, setAppTheme } = useAppState();
  const themeBgColors = appTheme === "blue" ? ["#0B101A", "#152E4D"] : appTheme === "green" ? ["#0A1A0D", "#15401E"] : appTheme === "orange" ? ["#1A0C0B", "#421A0F"] : ["#0B091A", "#1D1B38"];

  const [text, setText] = useState("");
  const [remaining, setRemaining] = useState(120);
  const [loading, setLoading] = useState(false);
  const handleTextChange = (newText) => {
    const newWords = newText.trim() === "" ? 0 : newText.trim().split(/\s+/).length;
    if (newWords <= 25 || newText.length < text.length) {
      setText(newText);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          navigation.replace("Timeout");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const isExact = wordCount === 25;

  async function onSubmit() {
    if (!isExact || loading) return;
    setLoading(true);
    try {
      const res = await api.submitCreative(quizSessionId, text, token);
      navigation.replace("EntryAccepted", { 
        entryReference: res.entry_reference,
        submittedAt: res.submitted_at
      });
    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  }

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const secs = s % 60;
    return `${m}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={themeBgColors} style={StyleSheet.absoluteFill} />

      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Creative Submission</Text>
          <Text style={styles.headerSub}>Exactly 25 words required</Text>
        </View>
        <View style={styles.timerBadge}>
           <Text style={styles.timerIcon}>⏰</Text>
           <Text style={styles.timerText}>{formatTime(remaining)}</Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${(wordCount / 25) * 100}%` }]} />
      </View>

      <View style={styles.body}>
        <View style={styles.promptCard}>
          <Text style={styles.promptLabel}>YOUR PROMPT</Text>
          <Text style={styles.promptQuote}>"In exactly 25 words, tell us why you should win this prize."</Text>
        </View>

        <View style={styles.inputHeader}>
           <Text style={styles.inputLabel}>Your Response</Text>
           <Text style={[styles.countText, isExact && {color: '#4CAF50'}]}>{wordCount} / 25</Text>
        </View>

        <TextInput
          style={styles.input}
          multiline
          placeholder="Type your 25-word response here..."
          placeholderTextColor="#5c5c7d"
          value={text}
          onChangeText={handleTextChange}
          contextMenuHidden={true} // Disable paste/copy menu
        />

        <Text style={styles.hintText}>Begin typing your response above.</Text>

        <TouchableOpacity 
          style={[styles.submitBtn, (!isExact || loading) && styles.submitBtnDisabled]} 
          onPress={onSubmit}
          disabled={!isExact || loading}
        >
          <Text style={styles.submitBtnText}>{loading ? "Submitting..." : "Submit Entry →"}</Text>
        </TouchableOpacity>

        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            🚫 Paste is disabled. Please type your response. Submission blocked unless word count is exactly 25.
          </Text>
        </View>
      </View>

      <Text style={styles.footerText}>Pure skill. One prize. One winner.</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B091A" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingTop: 10, paddingBottom: 15 },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "900" },
  headerSub: { color: "#8a8ea8", fontSize: 11, marginTop: 2 },
  timerBadge: { backgroundColor: "rgba(0,0,0,0.4)", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#333" },
  timerIcon: { fontSize: 14, marginRight: 6 },
  timerText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  progressContainer: { height: 4, backgroundColor: "#333", width: "100%" },
  progressBar: { height: "100%", backgroundColor: "#4CAF50" },

  body: { flex: 1, paddingHorizontal: 25, paddingTop: 20 },
  promptCard: { backgroundColor: "rgba(56, 52, 107, 0.15)", width: "100%", padding: 20, borderRadius: 16, borderWidth: 1, borderColor: "#38346b", marginBottom: 30 },
  promptLabel: { color: "#8a8ea8", fontSize: 10, fontWeight: "bold", letterSpacing: 1, marginBottom: 8 },
  promptQuote: { color: "#fff", fontSize: 15, fontWeight: "bold", fontStyle: "italic", lineHeight: 22 },

  inputHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  inputLabel: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  countText: { color: "#8a8ea8", fontWeight: "bold", fontSize: 14 },

  input: { backgroundColor: "rgba(255,255,255,0.03)", borderRadius: 16, padding: 20, color: "#fff", fontSize: 16, height: 160, textAlignVertical: "top", borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  
  hintText: { color: "#5c5c7d", fontSize: 12, marginTop: 10, marginBottom: 20, fontWeight: "bold" },
  
  submitBtn: { backgroundColor: "#FF6600", padding: 18, borderRadius: 30, alignItems: "center", shadowColor: "#FF6600", shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.8, shadowRadius: 15, elevation: 10 },
  submitBtnDisabled: { opacity: 0.5 },
  submitBtnText: { color: "#fff", fontWeight: "900", fontSize: 17 },

  warningBox: { marginTop: 20, backgroundColor: "rgba(233,30,99,0.1)", padding: 12, borderRadius: 10, borderWidth: 1, borderColor: "rgba(233,30,99,0.3)" },
  warningText: { color: "#E91E63", fontSize: 11, textAlign: "center", lineHeight: 16, fontWeight: "bold" },

  footerText: { color: "#5c5c7d", fontWeight: "bold", fontSize: 11, textAlign: "center", marginBottom: 30 }
});
