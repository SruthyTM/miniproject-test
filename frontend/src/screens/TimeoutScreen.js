import React from "react";
import { Button, Text } from "react-native";

import { ScreenContainer } from "../components/ScreenContainer";

export function TimeoutScreen({ navigation }) {
  return (
    <ScreenContainer title="Time Out" subtitle="Quiz timer expired">
      <Text>You were redirected because the quiz timer ended.</Text>
      <Button title="Back to Login" onPress={() => navigation.reset({ index: 0, routes: [{ name: "Login" }] })} />
    </ScreenContainer>
  );
}
