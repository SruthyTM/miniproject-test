import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, ScrollView, FlatList, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAppState } from "../../App";
import { api } from "../api/client";

export function AdminDashboardScreen({ navigation }) {
  const { token } = useAppState();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, [token]);

  async function fetchSessions() {
    try {
      const data = await api.getAdminSessions(token);
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
      <LinearGradient colors={["#0B091A", "#1D1B38"]} style={StyleSheet.absoluteFill} />

      <View style={styles.header}>
        <Text style={styles.title}>Admin Panel</Text>
        <View style={styles.headerRight}>
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

  creativeBox: { backgroundColor: "rgba(0,0,0,0.2)", padding: 12, borderRadius: 10, marginBottom: 15 },
  creativeTitle: { color: "#8a8ea8", fontSize: 11, fontWeight: "bold", marginBottom: 8 },
  creativeText: { color: "#ced4e0", fontSize: 13, lineHeight: 18, fontStyle: "italic" },

  shortlistBtn: { padding: 12, borderRadius: 10, borderWidth: 1, borderColor: "#38346b", alignItems: "center" },
  shortlistBtnActive: { backgroundColor: "#EE6600", borderColor: "#EE6600" },
  shortlistBtnText: { color: "#fff", fontWeight: "bold", fontSize: 13 }
});
