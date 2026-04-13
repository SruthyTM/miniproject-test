import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAppState } from "../../App";
import { api } from "../api/client";

export function DashboardScreen({ navigation }) {
  const { token } = useAppState();
  const [data, setData] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    fetchDashboard();
  }, [token]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(t => Math.max(t - 1, 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  async function fetchDashboard() {
    try {
      const res = await api.getDashboard(token);
      setData(res);
      setTimeLeft(res.competition_close_seconds);
    } catch (err) {
      console.error(err);
    }
  }

  const formatTime = (seconds) => {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return { d, h, m, s };
  };

  const time = formatTime(timeLeft);

  if (!data) return null;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#0B091A", "#1D1B38"]} style={StyleSheet.absoluteFill} />

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
           <Text style={styles.welcomeText}>User Dashboard</Text>
           <TouchableOpacity onPress={() => navigation.reset({ index: 0, routes: [{ name: "Login" }] })}>
             <Text style={styles.logoutText}>Logout</Text>
           </TouchableOpacity>
        </View>

        {data.entries_used > 0 && (
          <>
            {data.is_shortlisted ? (
              <TouchableOpacity 
                style={styles.shortlistBanner}
                onPress={() => navigation.navigate("ShortlistedDetail", { data })}
              >
                <View style={styles.trophyCircle}>
                   <Text style={styles.trophyIcon}>🏆</Text>
                </View>
                <View>
                  <Text style={styles.shortlistTitle}>You're Shortlisted!</Text>
                  <Text style={styles.shortlistSub}>Entry #{data.entry_reference} • Top 0.01%</Text>
                </View>
                <Text style={styles.arrowIcon}>›</Text>
              </TouchableOpacity>
            ) : data.is_rejected ? (
              <View style={[styles.shortlistBanner, { backgroundColor: 'rgba(233,30,99,0.1)', borderColor: 'rgba(233,30,99,0.3)' }]}>
                 <View style={[styles.trophyCircle, { backgroundColor: '#E91E63' }]}>
                   <Text style={styles.trophyIcon}>❌</Text>
                </View>
                <View>
                  <Text style={[styles.shortlistTitle, { color: '#E91E63' }]}>Better luck next time</Text>
                  <Text style={styles.shortlistSub}>Sorry, your entry was not shortlisted.</Text>
                </View>
              </View>
            ) : (
              <View style={[styles.shortlistBanner, { backgroundColor: 'rgba(255,165,0,0.1)', borderColor: 'rgba(255,165,0,0.3)' }]}>
                 <View style={[styles.trophyCircle, { backgroundColor: '#FFA500' }]}>
                   <Text style={styles.trophyIcon}>⏳</Text>
                </View>
                <View>
                  <Text style={[styles.shortlistTitle, { color: '#FFA500' }]}>Result Pending</Text>
                  <Text style={styles.shortlistSub}>Your entry is being reviewed by our judges.</Text>
                </View>
              </View>
            )}

            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statVal}>{data.entries_used}</Text>
                <Text style={styles.statLabel}>Entries Used</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statVal}>{data.slots_left}</Text>
                <Text style={styles.statLabel}>Slots Left</Text>
              </View>
              <View style={[styles.statBox, { borderColor: '#4CAF50' }]}>
                <Text style={[styles.statVal, { color: '#4CAF50' }]}>{data.shortlisted_count}</Text>
                <Text style={styles.statLabel}>Shortlisted</Text>
              </View>
            </View>
          </>
        )}

        <View style={styles.closeCard}>
          <Text style={styles.closeLabel}>Competition Closes In</Text>
          <View style={styles.countdownRow}>
            <View style={styles.timeBox}>
              <Text style={styles.timeVal}>{time.d}</Text>
              <Text style={styles.timeUnit}>Days</Text>
            </View>
            <View style={styles.timeBox}>
              <Text style={styles.timeVal}>{time.h}</Text>
              <Text style={styles.timeUnit}>Hours</Text>
            </View>
            <View style={styles.timeBox}>
              <Text style={styles.timeVal}>{time.m}</Text>
              <Text style={styles.timeUnit}>Mins</Text>
            </View>
            <View style={styles.timeBox}>
              <Text style={styles.timeVal}>{time.s}</Text>
              <Text style={styles.timeUnit}>Secs</Text>
            </View>
          </View>
        </View>

        {data.slots_left > 0 && (
          <TouchableOpacity 
            style={styles.addBtn} 
            onPress={() => navigation.navigate("Quiz")}
          >
            <Text style={styles.addBtnText}>
              {data.entries_used === 0 ? "Take Qualification Quiz →" : "Add Another Entry →"}
            </Text>
          </TouchableOpacity>
        )}
        <Text style={styles.footerInfo}>{data.entries_used} of 10 entries used • {data.slots_left} remaining</Text>

      </ScrollView>

      <View style={styles.themeRow}>
        <Text style={styles.themeLabel}>THEME</Text>
        <View style={styles.themeIconActive} />
        <View style={styles.themeIcon} />
        <View style={styles.themeIcon} />
        <View style={styles.themeIcon} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B091A" },
  scroll: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 100 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 30 },
  welcomeText: { color: "#fff", fontSize: 20, fontWeight: "900" },
  logoutText: { color: "#E91E63", fontWeight: "bold" },

  shortlistBanner: { backgroundColor: "#EE6600", padding: 20, borderRadius: 24, flexDirection: "row", alignItems: "center", marginBottom: 25, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  trophyCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: "#FF9900", alignItems: "center", justifyContent: "center", marginRight: 15 },
  trophyIcon: { fontSize: 24 },
  shortlistTitle: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  shortlistSub: { color: "rgba(255,255,255,0.8)", fontSize: 12, marginTop: 2 },
  arrowIcon: { color: "#fff", fontSize: 28, marginLeft: "auto" },

  statsRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 30 },
  statBox: { flex: 0.31, backgroundColor: "rgba(255,255,255,0.03)", padding: 15, borderRadius: 16, alignItems: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  statVal: { color: "#fff", fontSize: 24, fontWeight: "900", marginBottom: 4 },
  statLabel: { color: "#8a8ea8", fontSize: 11, fontWeight: "bold" },

  closeCard: { backgroundColor: "rgba(56, 52, 107, 0.2)", padding: 20, borderRadius: 24, borderWidth: 1, borderColor: "#38346b", marginBottom: 30 },
  closeLabel: { color: "#8a8ea8", fontSize: 13, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  countdownRow: { flexDirection: "row", justifyContent: "center", gap: 10 },
  timeBox: { width: 70, height: 80, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 16, alignItems: "center", justifyContent: "center" },
  timeVal: { color: "#fff", fontSize: 24, fontWeight: "900" },
  timeUnit: { color: "#8a8ea8", fontSize: 10, fontWeight: "bold", marginTop: 4 },

  addBtn: { backgroundColor: "#FF6600", padding: 20, borderRadius: 35, alignItems: "center", shadowColor: "#FF6600", shadowOffset: {width:0, height:0}, shadowOpacity: 0.8, shadowRadius: 10 },
  addBtnText: { color: "#fff", fontWeight: "900", fontSize: 18 },
  footerInfo: { color: "#5c5c7d", fontSize: 12, textAlign: "center", marginTop: 15, fontWeight: "bold" },

  themeRow: { flexDirection: "row", alignItems: "center", alignSelf: "center", backgroundColor: "rgba(0,0,0,0.6)", paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, position: "absolute", bottom: 20 },
  themeLabel: { color: "#8a8ea8", fontSize: 10, fontWeight: "bold", marginRight: 10 },
  themeIcon: { width: 14, height: 14, borderRadius: 7, backgroundColor: "#333", marginLeft: 8 },
  themeIconActive: { width: 14, height: 14, borderRadius: 7, backgroundColor: "#fff", borderWidth: 2, borderColor: "#8C52FF", marginLeft: 8 }
});
