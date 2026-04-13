import React, { useState } from "react";
import { Alert, TextInput, StyleSheet, TouchableOpacity, Text, View, SafeAreaView, StatusBar } from "react-native";
import { useAppState } from "../../App";
import { api } from "../api/client";

export function LoginScreen({ navigation, route }) {
  const { setToken, setEmail, setIsAdmin } = useAppState();
  const [email, setLocalEmail] = useState(route.params?.email || "");
  const [password, setPassword] = useState("");

  async function onLogin() {
    try {
      const res = await api.login({ email, password });
      setToken(res.token);
      setEmail(res.email);
      setIsAdmin(res.is_admin);
      
      if (res.is_admin) {
        navigation.reset({ index: 0, routes: [{ name: "AdminDashboard" }] });
      } else {
        navigation.reset({ index: 0, routes: [{ name: "Dashboard" }] });
      }
    } catch (err) {
      Alert.alert("Login Failed", err.message);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B091A" />
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

        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to access your challenge portal</Text>
        
        <View style={styles.tabContainer}>
          <TouchableOpacity style={styles.tabInactive} onPress={() => navigation.navigate("Register")}>
            <Text style={styles.tabTextInactive}>Create Account</Text>
          </TouchableOpacity>
          <View style={styles.tabActive}>
            <Text style={styles.tabTextActive}>Log In</Text>
          </View>
        </View>

        <Text style={styles.label}>Email Address</Text>
        <TextInput placeholder="your@email.com" placeholderTextColor="#5c5c7d" autoCapitalize="none" value={email} onChangeText={setLocalEmail} style={styles.input} />
        
        <Text style={styles.label}>Password</Text>
        <TextInput placeholder="Enter your password" placeholderTextColor="#5c5c7d" secureTextEntry value={password} onChangeText={setPassword} style={styles.input} />
        
        <TouchableOpacity style={styles.btn} onPress={onLogin}>
          <Text style={styles.btnText}>Log In →</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkRow} onPress={() => navigation.navigate("Register")}>
          <Text style={styles.alreadyText}>New here? <Text style={styles.alreadyLink}>Create an account.</Text></Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>Pure skill. One prize. One winner.</Text>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B091A" },
  body: { paddingHorizontal: 24, paddingTop: 40, paddingBottom: 16, flex: 1 },
  logoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "rgba(255,255,255,0.05)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#333",
    alignSelf: 'center',
    marginBottom: 40,
  },
  logoL: { color: "#00E5FF", fontWeight: "900", fontSize: 18, fontStyle: "italic" },
  logoE: { color: "#FFF", fontWeight: "900", fontSize: 18, fontStyle: "italic", marginLeft: -4 },
  title: { color: "#fff", fontSize: 26, fontWeight: "900", marginBottom: 6 },
  subtitle: { color: "#9ca3af", fontSize: 14, marginBottom: 24 },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#1D1B38",
    borderRadius: 12,
    marginBottom: 24,
    padding: 4,
  },
  tabActive: { flex: 1, backgroundColor: "#FFA500", borderRadius: 8, paddingVertical: 12, alignItems: "center" },
  tabTextActive: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  tabInactive: { flex: 1, borderRadius: 8, paddingVertical: 12, alignItems: "center" },
  tabTextInactive: { color: "#8a8ea8", fontWeight: "bold", fontSize: 14 },

  label: { color: "#fff", fontWeight: "bold", fontSize: 13, marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#38346b",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#110e26",
    color: "#fff",
    marginBottom: 20,
    fontSize: 14,
  },
  
  btn: {
    backgroundColor: "#FF6600",
    padding: 16,
    borderRadius: 24,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#FF6600",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 8,
  },
  btnText: { color: "#fff", fontWeight: "900", fontSize: 16 },
  linkRow: { marginTop: 24, alignItems: "center" },
  alreadyText: { color: "#FFA500", fontWeight: "600", fontSize: 14 },
  alreadyLink: { textDecorationLine: "underline" },
  footerText: { color: "#5c5c7d", fontWeight: "bold", fontSize: 12, textAlign: "center", marginTop: 40, letterSpacing: 0.5 },
});
