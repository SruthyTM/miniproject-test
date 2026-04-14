import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, ScrollView, FlatList, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAppState } from "../../App";
import { api } from "../api/client";

export function AdminDashboardScreen({ navigation }) {
  const { token, appTheme, setAppTheme } = useAppState();
  const themeBgColors = appTheme === "blue" ? ["#0B101A", "#152E4D"] : appTheme === "green" ? ["#0A1A0D", "#15401E"] : appTheme === "orange" ? ["#1A0C0B", "#421A0F"] : ["#0B091A", "#1D1B38"];

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, [token]);

  async function fetchSessions() {
    try {
      const data = await api.getAdminSessions(token);
      console.log("Sessions data received:", data);
      // Check if any sessions still have 0 scores
      const zeroScoreSessions = data.filter(s => s.ai_score === 0);
      console.log("Sessions with 0 scores:", zeroScoreSessions.length);
      if (zeroScoreSessions.length > 0) {
        console.log("Zero score session details:", zeroScoreSessions[0]);
      }
      setSessions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function toggleShortlist(id) {
    try {
      await api.toggleShortlist(id, token);
      fetchSessions(); // Refresh
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  }

  async function fixZeroScores() {
    try {
      // First try the API endpoint
      const result = await api.fixZeroScores(token);
      const fixedCount = result.fixed_count || 0;
      Alert.alert("Success", `Fixed ${fixedCount} entries with zero scores`);
      fetchSessions(); // Refresh
    } catch (err) {
      console.error("API fix failed:", err);
      // If API fails, try manual client-side fix
      manualFixScores();
    }
  }

  async function manualFixScores() {
    try {
      console.log("Starting manual fix for sessions:", sessions.length);
      
      // Get current sessions and manually update scores
      const updatedSessions = sessions.map(session => {
        if (session.creative_text && session.ai_score === 0) {
          console.log(`Fixing session ${session.id} with text: ${session.creative_text.substring(0, 50)}...`);
          
          // Simple fallback scoring logic
          const words = session.creative_text.split();
          let score = 5;
          
          // Adjust based on word count
          if (20 <= words.length <= 30) score += 1;
          if (words.length < 20) score -= 1;
          if (words.length > 30) score -= 1;
          
          // Bonus for positive words
          const positiveWords = ['innovation', 'growth', 'excellent', 'amazing', 'wonderful', 'great', 'fantastic', 'collaboration', 'learning', 'future'];
          if (positiveWords.some(word => session.creative_text.toLowerCase().includes(word))) {
            score += 1;
          }
          
          score = Math.max(1, Math.min(10, score));
          
          console.log(`Session ${session.id} score updated: 0 -> ${score}`);
          
          return {
            ...session,
            ai_score: score,
            ai_sentiment: "Neutral"
          };
        }
        return session;
      });
      
      const fixedCount = updatedSessions.filter(s => s.ai_score > 0 && sessions.find(orig => orig.id === s.id && orig.ai_score === 0)).length;
      console.log(`Manual fix completed. Updated ${fixedCount} sessions`);
      
      setSessions(updatedSessions);
      Alert.alert("Manual Fix Applied", `Updated ${fixedCount} entries with client-side scoring`);
    } catch (err) {
      console.error("Manual fix error:", err);
      Alert.alert("Error", "Failed to fix scores");
    }
  }

  const renderItem = ({ item }) => (
    <View style={styles.entryCard}>
      <View style={styles.entryHeader}>
        <Text style={styles.entryEmail}>{item.email}</Text>
        <Text style={styles.entryScore}>Score: {item.score}</Text>
      </View>
      <Text style={styles.entryRef}>{item.entry_reference}</Text>
      
      <View style={styles.creativeBox}>
        <Text style={styles.creativeTitle}>Creative Submission (25 words):</Text>
        <Text style={styles.creativeText}>{item.creative_text || "No submission yet"}</Text>
        
        {item.creative_text && (
          <View style={styles.aiEvalBox}>
            <Text style={styles.aiEvalLabel}>Lucid Engine AI Evaluation:</Text>
            <Text style={styles.aiEvalScore}>Score: {item.ai_score || 0}/10</Text>
            <Text style={styles.aiEvalSentiment}>Sentiment: {item.ai_sentiment || "Neutral"}</Text>
          </View>
        )}
      </View>

      <TouchableOpacity 
        style={[styles.shortlistBtn, item.is_shortlisted && styles.shortlistBtnActive]} 
        onPress={() => toggleShortlist(item.id)}
      >
        <Text style={styles.shortlistBtnText}>
          {item.is_shortlisted ? "★ Shortlisted" : "☆ Shortlist Candidate"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={themeBgColors} style={StyleSheet.absoluteFill} />

      <View style={styles.header}>
        <Text style={styles.title}>Admin Panel</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={fixZeroScores} style={styles.fixBtn}>
            {/* <Text style={styles.fixBtnText}>Fix 0 Scores</Text> */}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("AdminUsers")} style={styles.usersBtn}>
            <Text style={styles.usersBtnText}>Users</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.reset({ index: 0, routes: [{ name: "Login" }] })}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <Text style={styles.loading}>Loading entries...</Text>
      ) : (
        <FlatList
          data={sessions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>No entries found.</Text>}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B091A" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20 },
  headerRight: { flexDirection: "row", alignItems: "center" },
  fixBtn: { backgroundColor: "rgba(76,175,80,0.3)", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, marginRight: 10, borderWidth: 1, borderColor: "rgba(76,175,80,0.5)" },
  fixBtnText: { color: "#4CAF50", fontWeight: "bold", fontSize: 13 },
  usersBtn: { backgroundColor: "rgba(255,255,255,0.1)", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, marginRight: 15 },
  usersBtnText: { color: "#fff", fontWeight: "bold", fontSize: 13 },
  title: { color: "#fff", fontSize: 24, fontWeight: "900" },
  logoutText: { color: "#E91E63", fontWeight: "bold" },
  loading: { color: "#8a8ea8", textAlign: "center", marginTop: 50 },
  empty: { color: "#5c5c7d", textAlign: "center", marginTop: 50 },
  
  list: { padding: 20, paddingBottom: 100 },
  entryCard: { backgroundColor: "rgba(255,255,255,0.03)", borderRadius: 16, padding: 20, marginBottom: 15, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  entryHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
  entryEmail: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  entryScore: { color: "#4CAF50", fontWeight: "bold" },
  entryRef: { color: "#8a8ea8", fontSize: 12, marginBottom: 15 },

  creativeBox: { backgroundColor: "rgba(0,0,0,0.4)", borderRadius: 12, padding: 15, marginBottom: 15, borderWidth: 1, borderColor: "rgba(255,255,255,0.05)" },
  creativeTitle: { color: "#8a8ea8", fontSize: 13, fontWeight: "bold", marginBottom: 8, letterSpacing: 0.5 },
  creativeText: { color: "#fff", fontSize: 14, fontStyle: "italic", lineHeight: 22 },
  aiEvalBox: { marginTop: 15, padding: 12, backgroundColor: "rgba(0,229,255,0.08)", borderRadius: 8, borderWidth: 1, borderColor: "rgba(0,229,255,0.2)" },
  aiEvalLabel: { color: "#00E5FF", fontSize: 11, fontWeight: "bold", marginBottom: 5, letterSpacing: 1 },
  aiEvalScore: { color: "#fff", fontSize: 14, fontWeight: "bold" },
  aiEvalSentiment: { color: "#8a8ea8", fontSize: 13, marginTop: 4, fontStyle: "italic" },

  shortlistBtn: { padding: 12, borderRadius: 10, borderWidth: 1, borderColor: "#38346b", alignItems: "center" },
  shortlistBtnActive: { backgroundColor: "#EE6600", borderColor: "#EE6600" },
  shortlistBtnText: { color: "#fff", fontWeight: "bold", fontSize: 13 }
});
