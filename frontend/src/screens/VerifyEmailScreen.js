import React, { useState } from "react";
import { Alert, Button, TextInput } from "react-native";

import { useAppState } from "../../App";
import { api } from "../api/client";
import { ScreenContainer } from "../components/ScreenContainer";

export function VerifyEmailScreen({ navigation, route }) {
  const { setToken, setEmail: setAppEmail } = useAppState();
  const [email, setEmail] = useState(route.params?.email || "");
  const [code, setCode] = useState("");

  async function onVerify() {
    try {
      const res = await api.verifyEmail({ email, code });
      setToken(res.token);
      setAppEmail(res.email);
      Alert.alert("Success", "OTP verified.");
      navigation.reset({ index: 0, routes: [{ name: "Eligibility" }] });
    } catch (err) {
      Alert.alert("Verification Failed", err.message);
    }
  }

  return (
    <ScreenContainer title="Verify Email" subtitle="Step 2: verify your account">
      <TextInput placeholder="Email" autoCapitalize="none" value={email} onChangeText={setEmail} style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 8 }} />
      <TextInput placeholder="Verification Code" value={code} onChangeText={setCode} style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 8 }} />
      <Button title="Verify" onPress={onVerify} />
    </ScreenContainer>
  );
}
