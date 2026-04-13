import React, { createContext, useContext, useMemo, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Toast from "react-native-toast-message";
import { EligibilityScreen } from "./src/screens/EligibilityScreen";
import { LandingScreen } from "./src/screens/LandingScreen";
import { LoginScreen } from "./src/screens/LoginScreen";
import { QuizScreen } from "./src/screens/QuizScreen";
import { RegisterScreen } from "./src/screens/RegisterScreen";
import { ResultScreen } from "./src/screens/ResultScreen";
import { TimeoutScreen } from "./src/screens/TimeoutScreen";
import { VerifyEmailScreen } from "./src/screens/VerifyEmailScreen";
import { IncorrectAnswerScreen } from "./src/screens/IncorrectAnswerScreen";
import { QuizSuccessScreen } from "./src/screens/QuizSuccessScreen";
import { CreativeScreen } from "./src/screens/CreativeScreen";
import { EntryAcceptedScreen } from "./src/screens/EntryAcceptedScreen";
import { DashboardScreen } from "./src/screens/DashboardScreen";
import { AdminDashboardScreen } from "./src/screens/AdminDashboardScreen";

const Stack = createNativeStackNavigator();

const AppContext = createContext(null);
export const useAppState = () => useContext(AppContext);

export default function App() {
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState("");
  const [quizSessionId, setQuizSessionId] = useState(null);
  const [quizResult, setQuizResult] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

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
      isAdmin,
      setIsAdmin,
    }),
    [token, email, quizSessionId, quizResult, isAdmin]
  );

  return (
    <AppContext.Provider value={value}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Landing"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Landing" component={LandingScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Eligibility" component={EligibilityScreen} />
          <Stack.Screen name="Quiz" component={QuizScreen} />
          <Stack.Screen name="Timeout" component={TimeoutScreen} />
          <Stack.Screen name="Result" component={ResultScreen} />
          <Stack.Screen name="IncorrectAnswer" component={IncorrectAnswerScreen} />
          <Stack.Screen name="QuizSuccess" component={QuizSuccessScreen} />
          <Stack.Screen name="Creative" component={CreativeScreen} />
          <Stack.Screen name="EntryAccepted" component={EntryAcceptedScreen} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </AppContext.Provider>
  );
}
