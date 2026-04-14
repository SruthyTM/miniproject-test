import React, { useState, useRef } from "react";
import { Alert, TextInput, StyleSheet, TouchableOpacity, Text, View, SafeAreaView, StatusBar, ScrollView } from "react-native";
import Toast from "react-native-toast-message";
import { useAppState } from "../../App";
import { api } from "../api/client";

export function VerifyEmailScreen({ navigation, route }) {
  const { setToken, setEmail: setAppEmail, setIsAdmin, appTheme, setAppTheme } = useAppState();
  const themeBgColors = appTheme === "blue" ? ["#0B101A", "#152E4D"] : appTheme === "green" ? ["#0A1A0D", "#15401E"] : appTheme === "orange" ? ["#1A0C0B", "#421A0F"] : ["#0B091A", "#1D1B38"];

  const [email] = useState(route.params?.email || "your email");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  
  const inputs = useRef([]);

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-focus next
    if (text && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  async function onVerify() {
    const code = otp.join("");
    if (code.length < 6) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter the full 6-digit code.",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await api.verifyEmail({ email, code });
      setToken(res.token);
      setAppEmail(res.email);
      setIsAdmin(res.is_admin);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Email verified successfully!",
      });

      setTimeout(async () => {
        if (res.is_admin) {
          navigation.reset({ index: 0, routes: [{ name: "AdminDashboard" }] });
        } else {
          try {
            const dashboard = await api.getDashboard(res.token);
            if (dashboard.entries_used > 0) {
              navigation.reset({ index: 0, routes: [{ name: "Dashboard" }] });
            } else {
              navigation.reset({ index: 0, routes: [{ name: "Eligibility" }] });
            }
          } catch (e) {
            navigation.reset({ index: 0, routes: [{ name: "Eligibility" }] });
          }
        }
      }, 1000);
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Verification Failed",
        text2: err.message,
      });
    } finally {
      setLoading(false);
    }
  }

  const handleResend = async () => {
    try {
      const res = await api.resendOtp(email);
      Alert.alert("Success", "New OTP has been sent. Code: " + res.verification_code);
    } catch (err) {
      // client.js already shows toast, but Alert is good for specific feedback
    }
  };

  const maskedEmail = () => {
    const [user, domain] = email.split("@");
    if (!domain) return email;
    return `${user.substring(0, 1)}***@${domain}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B091A" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={{ color: "#fff", fontSize: 20 }}>←</Text>
          </TouchableOpacity>
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
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.body}>
          <View style={styles.iconCircle}>
            <Text style={{ fontSize: 30 }}>✉️</Text>
          </View>

          <Text style={styles.title}>Verify Your Email</Text>
          <Text style={styles.subtitle}>
            A verification code has been sent to your email address.
          </Text>
          <Text style={styles.emailText}>{maskedEmail()}</Text>

          <Text style={styles.inputLabel}>Enter 6-digit verification code</Text>
          
          <View style={styles.otpRow}>
            {otp.map((digit, i) => (
              <TextInput
                key={i}
                ref={(el) => (inputs.current[i] = el)}
                style={styles.otpInput}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={(text) => handleChange(text, i)}
                onKeyPress={(e) => handleKeyPress(e, i)}
                selectionColor="#FFA500"
              />
            ))}
          </View>

          <TouchableOpacity 
            style={[styles.btn, loading && { opacity: 0.7 }]} 
            onPress={onVerify}
            disabled={loading}
          >
            <Text style={styles.btnText}>{loading ? "Verifying..." : "Verify →"}</Text>
          </TouchableOpacity>

          <View style={styles.resendRow}>
            <Text style={styles.resendText}>Did not receive the code?</Text>
            <TouchableOpacity onPress={handleResend}>
              <Text style={styles.resendLink}>Resend Code</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              🛡️ <Text style={{ fontWeight: 'bold' }}>Check your spam folder</Text> if you don't see the email within 2 minutes. The code is valid for 10 minutes.
            </Text>
          </View>

          <Text style={styles.footerText}>Pure skill. One prize. One winner.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B091A" },
  scroll: { flexGrow: 1, paddingBottom: 40 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  logoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "rgba(255,255,255,0.05)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#333",
  },
  logoL: { color: "#00E5FF", fontWeight: "900", fontSize: 16 },
  logoE: { color: "#FFF", fontWeight: "900", fontSize: 16, marginLeft: -3 },
  
  body: { alignItems: "center", paddingHorizontal: 30 },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,165,0,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
    marginTop: 10,
  },
  title: { color: "#fff", fontSize: 28, fontWeight: "900", marginBottom: 12 },
  subtitle: { color: "#8a8ea8", fontSize: 14, textAlign: "center", marginBottom: 8, lineHeight: 20 },
  emailText: { color: "#FFA500", fontWeight: "bold", fontSize: 15, marginBottom: 40 },
  
  inputLabel: { color: "#fff", fontSize: 14, fontWeight: "bold", alignSelf: "flex-start", marginBottom: 20 },
  otpRow: { flexDirection: "row", justifyContent: "space-between", width: "100%", marginBottom: 40 },
  otpInput: {
    width: 45,
    height: 55,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#38346b",
    backgroundColor: "#110e26",
    color: "#fff",
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
  },
  
  btn: {
    backgroundColor: "#FF6600",
    width: "100%",
    padding: 18,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 30,
    shadowColor: "#FF6600",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 6,
  },
  btnText: { color: "#fff", fontWeight: "900", fontSize: 17 },
  
  resendRow: { alignItems: "center", marginBottom: 40 },
  resendText: { color: "#8a8ea8", fontSize: 14, marginBottom: 15 },
  resendLink: { color: "#FFA500", fontWeight: "bold", fontSize: 16, textDecorationLine: "underline" },
  
  warningBox: {
    backgroundColor: "rgba(255,165,0,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,165,0,0.2)",
    borderRadius: 12,
    padding: 16,
    width: "100%",
    marginBottom: 40,
  },
  warningText: { color: "#c1c4d6", fontSize: 13, lineHeight: 20, textAlign: "center" },
  
  footerText: { color: "#5c5c7d", fontWeight: "bold", fontSize: 12, letterSpacing: 0.5 },
});
