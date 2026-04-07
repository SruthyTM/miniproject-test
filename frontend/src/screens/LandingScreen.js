import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from "react-native";
import { api } from "../api/client";

export function LandingScreen({ navigation }) {
  const [timeLeft, setTimeLeft] = useState(66 * 60 * 60);

  useEffect(() => {
    let isMounted = true;
    api.getChallengeTime().then(data => {
      if (isMounted) setTimeLeft(data.remaining_seconds);
    }).catch(() => {});

    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')} : ${m.toString().padStart(2, '0')} : ${s.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B0D1E" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoBadge}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.logoL}>L</Text>
              <Text style={styles.logoE}>E</Text>
            </View>
            <View style={{ marginLeft: 6 }}>
              <Text style={{ fontSize: 7, color: "#fff" }}>Powered by</Text>
              <Text style={{ fontSize: 10, color: "#00E5FF", fontWeight: "bold" }}>Lucid Engine AI</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.signInBtn} onPress={() => navigation.navigate("Login")}>
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>
        </View>

        {/* Big Win Circle */}
        <View style={styles.bigWinContainer}>
          <View style={styles.earLeft} />
          <View style={styles.earRight} />
          <View style={styles.bigWinCircle}>
            <Text style={styles.bigWinText}>BIG</Text>
            <Text style={styles.bigWinText}>WIN</Text>
          </View>
        </View>

        {/* Titles */}
        <Text style={styles.title}>The Big Skill Challenge™</Text>
        <Text style={styles.subtitle}>Answer the prompt • Win the prize • Pure skill</Text>

        {/* Challenge Timer */}
        <View style={styles.timerBox}>
          <Text style={styles.timerLabel}>CHALLENGE ENDS IN</Text>
          <Text style={styles.timerValue}>{formatTime(timeLeft)}</Text>
        </View>

        {/* Image Card */}
        <View style={styles.cardContainer}>
          <Image source={require("../../assets/caravan.png")} style={styles.cardImage} />
          <View style={styles.badgeComingSoon}>
            <Text style={styles.badgeText}>COMING SOON</Text>
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardLabel}>NEXT COMPETITION</Text>
            <Text style={styles.cardTitle}>Luxury Caravan</Text>
            <Text style={styles.cardValue}>Value ~A$120,000</Text>
          </View>
        </View>

        {/* Pagination Dots */}
        <View style={styles.dots}>
          <View style={[styles.dot, { backgroundColor: "#666" }]} />
          <View style={[styles.dot, { backgroundColor: "#FF9900", width: 16 }]} />
          <View style={[styles.dot, { backgroundColor: "#666" }]} />
        </View>

        {/* Enter Now Button */}
        <TouchableOpacity style={styles.enterBtn} onPress={() => navigation.navigate("Register")}>
          <Text style={styles.enterBtnText}>ENTER NOW — A$2.99</Text>
        </TouchableOpacity>
        <Text style={styles.enterSubtext}>A$2.99 per entry - Max 10 entries per participant - Skill-based</Text>

        {/* How it Works Section */}
        <View style={styles.howItWorksHeader}>
          <Text style={styles.gearIcon}>⚙️</Text>
          <Text style={styles.howItWorksText}>How it Works</Text>
        </View>

        <View style={styles.stepsContainer}>
          <View style={styles.stepBox}>
            <View style={styles.stepNumWrap}>
              <Text style={styles.stepNum}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Register & Pay</Text>
              <Text style={styles.stepDesc}>Create your account, confirm eligibility, and purchase entries. Payments held in a designated competition trust account.</Text>
            </View>
          </View>
          
          <View style={styles.stepDivider} />

          <View style={styles.stepBox}>
            <View style={styles.stepNumWrap}>
              <Text style={styles.stepNum}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Complete the Qualification Quiz</Text>
              <Text style={styles.stepDesc}>Pass our timed, skill-based knowledge challenge.</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0D1E",
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
    marginTop: 10,
  },
  logoBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#333",
  },
  logoL: { color: "#00E5FF", fontWeight: "900", fontSize: 18, fontStyle: "italic" },
  logoE: { color: "#FFF", fontWeight: "900", fontSize: 18, fontStyle: "italic", marginLeft: -4 },
  signInBtn: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  signInText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
  bigWinContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    position: "relative",
    width: 140,
    height: 140,
  },
  bigWinCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#FF9900",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FF9900",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 30,
    elevation: 20,
    zIndex: 2,
  },
  bigWinText: {
    color: "#000",
    fontWeight: "900",
    fontSize: 32,
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: 34,
  },
  earLeft: {
    position: "absolute",
    top: 15,
    left: 10,
    width: 25,
    height: 25,
    backgroundColor: "#FF9900",
    transform: [{ rotate: "-45deg" }],
    zIndex: 1,
  },
  earRight: {
    position: "absolute",
    top: 15,
    right: 10,
    width: 25,
    height: 25,
    backgroundColor: "#FF9900",
    transform: [{ rotate: "45deg" }],
    zIndex: 1,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    color: "#999",
    fontSize: 13,
    marginBottom: 20,
    textAlign: "center",
    letterSpacing: 0.2,
  },
  timerBox: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,0,0,0.4)',
  },
  timerLabel: { color: '#ffaaaa', fontSize: 10, fontWeight: 'bold', letterSpacing: 1, marginBottom: 2 },
  timerValue: { color: '#ff4444', fontSize: 24, fontWeight: '900', fontVariant: ['tabular-nums'] },
  cardContainer: {
    width: "100%",
    height: 220,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#222",
    marginBottom: 20,
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  badgeComingSoon: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "#8c52ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },
  cardInfo: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  cardLabel: {
    color: "#aaa",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 4,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 4,
  },
  cardValue: {
    color: "#FFCC00",
    fontSize: 14,
    fontWeight: "bold",
  },
  dots: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  dot: {
    height: 6,
    width: 6,
    borderRadius: 3,
    marginHorizontal: 3,
  },
  enterBtn: {
    backgroundColor: "#EE6600",
    width: "100%",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#EE6600",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  enterBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
  },
  enterSubtext: {
    color: "#777",
    fontSize: 11,
    textAlign: "center",
    marginBottom: 40,
  },
  howItWorksHeader: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  gearIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  howItWorksText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  stepsContainer: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    padding: 20,
  },
  stepBox: {
    flexDirection: "row",
  },
  stepNumWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#A2845E",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    marginTop: 2,
  },
  stepNum: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  stepDesc: {
    color: "#aaa",
    fontSize: 13,
    lineHeight: 20,
  },
  stepDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    marginVertical: 20,
  },
});
