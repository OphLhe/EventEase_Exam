import * as SplashScreen from "expo-splash-screen";
import {
  Tuffy_400Regular,
  Tuffy_700Bold,
  useFonts,
} from "@expo-google-fonts/tuffy";
import RootNavigator from "./src/navigation/RootNavigator";
import { ThemeProvider } from "./src/context/ThemeContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "./src/context/AuthContext";
import EventsProvider from "./src/context/EventsContext";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Tuffy_400Regular,
    Tuffy_700Bold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <EventsProvider>
            <RootNavigator />
          </EventsProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
