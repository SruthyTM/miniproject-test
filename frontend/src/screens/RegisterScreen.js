import React, { useState } from "react";
import { Alert, Button, TextInput } from "react-native";

import { useAppState } from "../../App";
import { api } from "../api/client";
import { ScreenContainer } from "../components/ScreenContainer";

export function RegisterScreen({ navigation }) {
  const { setEmail } = useAppState();
  const [email, setLocalEmail] = useState("");

  async function onRegister() {
    try {
      const res = await api.register({ email });
      setEmail(email);
      Alert.alert("Verification Code (dev)", res.verification_code);
      navigation.navigate("VerifyEmail", { email });
    } catch (err) {
      Alert.alert("Registration Failed", err.message);
    }
  }

  return (
    <ScreenContainer title="Register" subtitle="Step 1: create your account">
      <TextInput placeholder="Email" autoCapitalize="none" value={email} onChangeText={setLocalEmail} style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 8 }} />
      <Button title="Register" onPress={onRegister} />
    </ScreenContainer>
  );
}
