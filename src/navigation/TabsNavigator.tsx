import { useSafeAreaInsets } from "react-native-safe-area-context";
import Home from "../screens/HomeScreen";
import Profile from "../screens/ProfilScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../hooks/useTheme";
import EventScreen from "../screens/EventScreen";
import { canCreateEvent } from "../utils/permission";
import { useAuth } from "../hooks/useAuth";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./RootNavigator";

export type TabParamList = {
  HomeTab: undefined;
  ProfileTab: undefined;
  EventTab: undefined;
};
const Tab = createBottomTabNavigator();

export default function TabNavigation() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.textSecondary,
        tabBarInactiveTintColor: colors.textPlaceholder,
        tabBarStyle: {
          borderTopWidth: 0,
          justifyContent: "space-evenly",
          height: 56 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 5,
        },
        animation: "shift",
        tabBarPosition: "bottom",
      }}
    >
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          title: "Profil",
          tabBarAccessibilityLabel: "Profil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          title: "Accueil",
          tabBarAccessibilityLabel: "Accueil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      {canCreateEvent(user?.role) && (
        <Tab.Screen
          name="Create"
          component={EventScreen}
          options={{
            title: "Créer un Evénementt",
            tabBarAccessibilityLabel: "Créer un évènement",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="add-circle" color={color} size={size} />
            ),
          }}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              navigation
                .getParent<NativeStackNavigationProp<RootStackParamList>>()
                ?.navigate("EventScreen");
            },
          })}
        />
      )}
    </Tab.Navigator>
  );
}
