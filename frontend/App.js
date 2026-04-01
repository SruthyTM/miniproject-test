import React, { createContext, useContext, useMemo, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { EligibilityScreen } from "./src/screens/EligibilityScreen";
import { LoginScreen } from "./src/screens/LoginScreen";
import { QuizScreen } from "./src/screens/QuizScreen";
import { RegisterScreen } from "./src/screens/RegisterScreen";
import { ResultScreen } from "./src/screens/ResultScreen";
import { TimeoutScreen } from "./src/screens/TimeoutScreen";
import { VerifyEmailScreen } from "./src/screens/VerifyEmailScreen";

const Stack = createNativeStackNavigator();

const AppContext = createContext(null);
export const useAppState = () => useContext(AppContext);

export default function App() {
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState("");
  const [quizSessionId, setQuizSessionId] = useState(null);
  const [quizResult, setQuizResult] = useState(null);

  const value = useMemo(
    () => ({
      token,
      setToken,
      email,
      setEmail,
      quizSessionId,
      setQuizSessionId,
      quizResult,
      setQuizResult,
    }),
    [token, email, quizSessionId, quizResult]
  );

  return (
    <AppContext.Provider value={value}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Register">
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Eligibility" component={EligibilityScreen} />
          <Stack.Screen name="Quiz" component={QuizScreen} />
          <Stack.Screen name="Timeout" component={TimeoutScreen} />
          <Stack.Screen name="Result" component={ResultScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppContext.Provider>
  );
}
