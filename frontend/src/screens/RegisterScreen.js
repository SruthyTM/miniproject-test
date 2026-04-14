import React, { useState } from "react";
import { Alert, TextInput, StyleSheet, TouchableOpacity, Text, View, SafeAreaView, StatusBar, ScrollView } from "react-native";
import { useAppState } from "../../App";
import { api } from "../api/client";

export function RegisterScreen({ navigation }) {
  const { setEmail, appTheme, setAppTheme } = useAppState();
  const themeBgColors = appTheme === "blue" ? ["#0B101A", "#152E4D"] : appTheme === "green" ? ["#0A1A0D", "#15401E"] : appTheme === "orange" ? ["#1A0C0B", "#421A0F"] : ["#0B091A", "#1D1B38"];

  const [email, setLocalEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confAge, setConfAge] = useState(false);
  const [confTerms, setConfTerms] = useState(false);

  const onRegister = async () => {
    console.log("DEBUG: Attempting to register...", { email, confAge, confTerms });
    
    if (!email || !password) {
      Alert.alert("Input Required", "Please enter both email and password.");
      return;
    }

    if (!confAge || !confTerms) {
      Alert.alert("Consent Required", "Please confirm you are 18+ and agree to the terms.");
      return;
    }

    try {
      const res = await api.register({ email, password });
      setEmail(email);
      Alert.alert("Success", "OTP sent. Code: " + res.verification_code);
      navigation.navigate("VerifyEmail", { email });
    } catch (err) {
      console.error("DEBUG: Register Error", err);
      Alert.alert("Registration Failed", err.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B091A" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.body}>

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

          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join The Big Skill Challenge™ to enter</Text>
          
          <View style={styles.tabContainer}>
            <View style={styles.tabActive}>
              <Text style={styles.tabTextActive}>Create Account</Text>
            </View>
            <TouchableOpacity style={styles.tabInactive} onPress={() => navigation.navigate("Login")}>
              <Text style={styles.tabTextInactive}>Log In</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Email Address</Text>
          <TextInput 
            placeholder="your@email.com" 
            placeholderTextColor="#5c5c7d" 
            autoCapitalize="none" 
            value={email} 
            onChangeText={setLocalEmail} 
            style={styles.input} 
          />
          
          <Text style={styles.label}>Password</Text>
          <TextInput 
            placeholder="Min 8 characters" 
            placeholderTextColor="#5c5c7d" 
            secureTextEntry 
            value={password} 
            onChangeText={setPassword} 
            style={styles.input} 
          />
          
          <Text style={styles.confirmHeader}>Confirmations required</Text>
          
          <TouchableOpacity style={styles.checkboxRow} onPress={() => setConfAge(!confAge)}>
            <View style={[styles.checkbox, confAge && styles.checkboxActive]}>
               {confAge && <Text style={{color: '#fff'}}>✓</Text>}
            </View>
            <Text style={styles.checkText}>I confirm I am 18 years or older</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.checkboxRow} onPress={() => setConfTerms(!confTerms)}>
            <View style={[styles.checkbox, confTerms && styles.checkboxActive]}>
               {confTerms && <Text style={{color: '#fff'}}>✓</Text>}
            </View>
            <Text style={styles.checkText}>I agree to the Terms & Conditions</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btn} onPress={onRegister}>
            <Text style={styles.btnText}>Create Account →</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkRow} onPress={() => navigation.navigate("Login")}>
            <Text style={styles.alreadyText}>Already have an account? Log in</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B091A" },
  scroll: { flexGrow: 1 },
  body: { padding: 30 },
  logoBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: "rgba(255,255,255,0.05)", padding: 8, borderRadius: 6, alignSelf: 'center', marginBottom: 30 },
  logoL: { color: "#00E5FF", fontWeight: "900", fontSize: 18 },
  logoE: { color: "#FFF", fontWeight: "900", fontSize: 18, marginLeft: -4 },
  title: { color: "#fff", fontSize: 28, fontWeight: "900", marginBottom: 5 },
  subtitle: { color: "#9ca3af", fontSize: 14, marginBottom: 20 },
  tabContainer: { flexDirection: "row", backgroundColor: "#1D1B38", borderRadius: 10, marginBottom: 20, padding: 4 },
  tabActive: { flex: 1, backgroundColor: "#FFA500", borderRadius: 8, padding: 12, alignItems: "center" },
  tabTextActive: { color: "#fff", fontWeight: "bold" },
  tabInactive: { flex: 1, padding: 12, alignItems: "center" },
  tabTextInactive: { color: "#8a8ea8" },
  label: { color: "#fff", fontWeight: "bold", fontSize: 13, marginBottom: 5 },
  input: { borderWidth: 1, borderColor: "#38346b", padding: 15, borderRadius: 10, backgroundColor: "#110e26", color: "#fff", marginBottom: 15 },
  confirmHeader: { color: "#5c5c7d", fontSize: 12, marginBottom: 10 },
  checkboxRow: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  checkbox: { width: 22, height: 22, borderRadius: 5, borderWidth: 1, borderColor: "#38346b", marginRight: 10, alignItems: "center", justifyContent: "center" },
  checkboxActive: { backgroundColor: "#FFA500", borderColor: "#FFA500" },
  checkText: { color: "#c1c4d6", fontSize: 13 },
  btn: { backgroundColor: "#FF6600", padding: 18, borderRadius: 30, alignItems: "center", marginTop: 10 },
  btnText: { color: "#fff", fontWeight: "900", fontSize: 16 },
  linkRow: { marginTop: 20, alignItems: "center" },
  alreadyText: { color: "#FFA500", fontWeight: "600" },
});
