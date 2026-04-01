import React, { useState } from "react";
import { Alert, Button, TextInput } from "react-native";

import { useAppState } from "../../App";
import { api } from "../api/client";
import { ScreenContainer } from "../components/ScreenContainer";

export function LoginScreen({ navigation, route }) {
  const { setToken, setEmail } = useAppState();
  const [email, setLocalEmail] = useState(route.params?.email || "");
  const [password, setPassword] = useState("");

  async function onLogin() {
    try {
      const res = await api.login({ email, password });
      setToken(res.token);
      setEmail(res.email);
      navigation.reset({ index: 0, routes: [{ name: "Eligibility" }] });
    } catch (err) {
      Alert.alert("Login Failed", err.message);
    }
  }

  return (
    <ScreenContainer title="Login" subtitle="Step 3: sign in to continue">
      <TextInput placeholder="Email" autoCapitalize="none" value={email} onChangeText={setLocalEmail} style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 8 }} />
      <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 8 }} />
      <Button title="Login" onPress={onLogin} />
      <Button title="Back to Register" onPress={() => navigation.navigate("Register")} />
    </ScreenContainer>
  );
}
