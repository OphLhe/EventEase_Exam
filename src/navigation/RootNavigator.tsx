import {
  NavigationContainer,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import * as SplashScreen from "expo-splash-screen";
import TabsNavigator, { TabParamList } from "./TabsNavigator";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";
import EventScreen from "../screens/EventScreen";
import EventModifyScreen from "../screens/EventModifyScreen";

export type RootStackParamList = {
  LoginScreen: undefined;
  RegisterScreen: undefined;
  TabsNavigator: NavigatorScreenParams<TabParamList> | undefined;
  EventScreen: undefined;
  EventModifyScreen: { eventId: string };
};
const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      SplashScreen.hideAsync();
    }
  }, [loading]);

  if (loading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="TabsNavigator" component={TabsNavigator} />
            <Stack.Screen
              name="EventScreen"
              component={EventScreen}
              options={{
                presentation: "modal",
                headerShown: true,
                title: "Nouvel évènement",
              }}
            />
            <Stack.Screen
              name="EventModifyScreen"
              component={EventModifyScreen}
              options={{
                presentation: "modal",
                headerShown: true,
                title: "Modifier l'évènement",
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
