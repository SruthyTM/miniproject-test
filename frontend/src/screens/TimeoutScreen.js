import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export function TimeoutScreen({ navigation, route }) {
  const attemptsCount = route.params?.attemptsCount || 0;
  const canRetry = attemptsCount < 3;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#0B091A", "#1D1B38"]} style={StyleSheet.absoluteFill} />

      <View style={styles.body}>
        <View style={styles.clockCircle}>
           <Text style={styles.clockIcon}>⏰</Text>
        </View>

        <Text style={styles.title}>Time Expired</Text>
        <Text style={styles.subtitle}>
          You did not answer the question within the allowed time.{"\n"}
          <Text style={{ fontWeight: "bold", color: "#fff" }}>Your current attempt has ended.</Text>
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardItem}>
            An email notification will be sent confirming this incomplete attempt. 
            You may purchase another entry (max 10 per competition) to try again. 
            Log out and log back in to begin a new attempt.
          </Text>
        </View>

        {canRetry && (
          <TouchableOpacity 
            style={styles.homeBtn} 
            onPress={() => navigation.reset({ index: 0, routes: [{ name: "Dashboard" }] })}
          >
            <Text style={styles.homeBtnText}>Return to Dashboard</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity 
          style={[styles.logoutBtn, !canRetry && styles.logoutBtnOnly]} 
          onPress={() => navigation.reset({ index: 0, routes: [{ name: "Login" }] })}
        >
          <Text style={styles.logoutBtnText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>Pure skill. One prize. One winner.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B091A" },
  body: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 30 },
  clockCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: "#FFA500", alignItems: "center", justifyContent: "center", marginBottom: 30 },
  clockIcon: { fontSize: 40 },
  title: { color: "#FFA500", fontSize: 32, fontWeight: "900", marginBottom: 15 },
  subtitle: { color: "#8a8ea8", fontSize: 14, textAlign: "center", lineHeight: 22, marginBottom: 40 },
  
  card: { backgroundColor: "rgba(56, 52, 107, 0.2)", width: "100%", padding: 24, borderRadius: 20, borderWidth: 1, borderColor: "#38346b", marginBottom: 40 },
  cardItem: { color: "#ced4e0", fontSize: 13, lineHeight: 20, textAlign: "center" },

  homeBtn: { width: "100%", backgroundColor: "#EE6600", padding: 18, borderRadius: 30, alignItems: "center", marginBottom: 15, shadowColor: "#EE6600", shadowOffset: {width:0, height:0}, shadowOpacity: 0.8, shadowRadius: 10, elevation: 5 },
  homeBtnText: { color: "#fff", fontWeight: "900", fontSize: 16 },

  logoutBtn: { width: "100%", padding: 18, borderRadius: 30, alignItems: "center", borderWidth: 1, borderColor: "#555" },
  logoutBtnOnly: { marginTop: 10 },
  logoutBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  footerText: { color: "#5c5c7d", fontWeight: "bold", fontSize: 11, marginTop: 40, letterSpacing: 0.5 }
});
