import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export function IncorrectAnswerScreen({ navigation, route }) {
  const attemptsCount = route.params?.attemptsCount || 0;
  const canRetry = attemptsCount < 10;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#0B091A", "#1D1B38"]} style={StyleSheet.absoluteFill} />

      <View style={styles.body}>
        <View style={styles.xCircle}>
           <Text style={styles.xText}>X</Text>
        </View>

        <Text style={styles.title}>Incorrect Answer</Text>
        <Text style={styles.subtitle}>
          Unfortunately, your last answer was incorrect.{"\n"}
          <Text style={{ fontWeight: "bold", color: "#fff" }}>A perfect score is required to proceed.</Text>
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>What happens next:</Text>
          <Text style={styles.cardItem}>• Your current attempt has ended</Text>
          <Text style={styles.cardItem}>• You may purchase another entry to try again</Text>
          <Text style={styles.cardItem}>• Maximum 10 entries per competition</Text>
          <Text style={styles.cardItem}>• Log out and log back in to make payment for another attempt</Text>
        </View>

        {canRetry && (
          <TouchableOpacity 
            style={styles.homeBtn} 
            onPress={() => navigation.reset({ index: 0, routes: [{ name: "Dashboard" }] })}
          >
            <Text style={styles.homeBtnText}>Return to User Dashboard</Text>
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
  xCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: "#E91E63", alignItems: "center", justifyContent: "center", marginBottom: 30 },
  xText: { color: "#fff", fontSize: 40, fontWeight: "900" },
  title: { color: "#FF5252", fontSize: 28, fontWeight: "900", marginBottom: 15 },
  subtitle: { color: "#8a8ea8", fontSize: 14, textAlign: "center", lineHeight: 22, marginBottom: 40 },
  
  card: { backgroundColor: "rgba(56, 52, 107, 0.2)", width: "100%", padding: 24, borderRadius: 20, borderWidth: 1, borderColor: "#38346b", marginBottom: 40 },
  cardTitle: { color: "#fff", fontSize: 16, fontWeight: "bold", marginBottom: 15 },
  cardItem: { color: "#8a8ea8", fontSize: 13, lineHeight: 20, marginBottom: 8 },

  homeBtn: { width: "100%", backgroundColor: "#FF6600", padding: 18, borderRadius: 30, alignItems: "center", marginBottom: 15, shadowColor: "#FF6600", shadowOffset: {width:0, height:0}, shadowOpacity: 0.8, shadowRadius: 10, elevation: 5 },
  homeBtnText: { color: "#fff", fontWeight: "900", fontSize: 16 },

  logoutBtn: { width: "100%", padding: 18, borderRadius: 30, alignItems: "center", borderWidth: 1, borderColor: "#555" },
  logoutBtnOnly: { marginTop: 10 },
  logoutBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  footerText: { color: "#5c5c7d", fontWeight: "bold", fontSize: 11, marginTop: 40, letterSpacing: 0.5 }
});
