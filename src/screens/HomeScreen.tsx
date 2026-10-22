import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useTheme } from "../hooks/useTheme";
import { Screen } from "../components/uiComponents/Screen";
import DarkToggleTheme from "../components/DarkModeToggle";
import { FontStyle } from "../theme/typography";
import EventCard from "../components/EventCard";
import { useEvents } from "../hooks/useEvents";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { useAuth } from "../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { isFull, isRegistered } from "../utils/events";
import { canManageEvent } from "../utils/permission";
import { Ionicons } from "@expo/vector-icons";

type Filter = "mine" | "all";
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const HomeScreen = () => {
  const { events, isLoading, toggleRegistered, deleteEvent } = useEvents();
  const { user } = useAuth();
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [filter, setFilter] = useState<Filter>("mine");
  const [notice, setNotice] = useState("");

  const upcoming = events
    .filter((e) => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const list =
    filter === "mine"
      ? upcoming.filter((e) => isRegistered(e, user?.id))
      : upcoming;

  const handleToggle = async (id: string) => {
    const event = events.find((e) => e.id === id);
    if (event && !isRegistered(event, user?.id) && isFull(event)) {
      setNotice("Cet évènement est complet.");
      return;
    }
    setNotice("");
    await toggleRegistered(id);
  };

  const handleDelete = (id: string, title: string) => {
    Alert.alert(
      "Supprimer l'évènement",
      `"${title}", sera supprimé définitivment`,
      [
        { text: "Annuler", style: "cancel" },
        { text: "Supprimer", onPress: () => deleteEvent(id) },
      ],
    );
  };

  const tab = (value: Filter, text: string) => {
    const selected = filter === value;
    return (
      <Pressable
        onPress={() => setFilter(value)}
        accessibilityRole="tab"
        accessibilityState={{ selected }}
        style={[
          styles.tab,
          {
            backgroundColor: selected ? colors.btnPrimary : "transparent",
            borderColor: colors.inputStroke,
          },
        ]}
      >
        <Text
          style={[
            FontStyle.button,
            { color: selected ? colors.textPrimary : colors.mainText },
          ]}
        >
          {text}
        </Text>
      </Pressable>
    );
  };

  return (
    <Screen scroll>
      <DarkToggleTheme />
      <Text
        style={[FontStyle.h1, { color: colors.mainText }]}
        accessibilityRole="header"
      >
        Évènements
      </Text>
      <View
        style={{
          backgroundColor: colors.btnInfo,
          padding: 12,
          borderRadius: 8,
          flexDirection: "row",
        }}
      >
        <Ionicons name="information-circle" color={colors.subText} size={24} />
        <Text style={{ color: colors.subText }}>
          Vous ne pouvez modifier et supprimer que les évènements dont vous êtes
          le créateur
        </Text>
      </View>
      <View style={styles.tabs} accessibilityRole="tablist">
        {tab("all", "Tous")}
        {tab("mine", "Mes évènements")}
      </View>

      {notice !== "" && (
        <Text
          accessibilityRole="alert"
          style={[FontStyle.body, { color: colors.error }]}
        >
          {notice}
        </Text>
      )}

      <FlatList
        data={list}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const manageable = canManageEvent(user, item);
          return (
            <EventCard
              event={item}
              registered={isRegistered(item, user?.id)}
              onToggleRegistration={() => handleToggle(item.id)}
              onEdit={
                manageable
                  ? () =>
                      navigation.navigate("EventModifyScreen", {
                        eventId: item.id,
                      })
                  : undefined
              }
              onDelete={
                manageable ? () => handleDelete(item.id, item.title) : undefined
              }
            />
          );
        }}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          !isLoading ? (
            <Text style={[FontStyle.body, { color: colors.subText }]}>
              {filter === "mine"
                ? "Vous n'êtes inscrit à aucun évènement à venir."
                : "Aucun évènement à venir."}
            </Text>
          ) : null
        }
      />
    </Screen>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  tabs: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  list: {
    gap: 16,
    paddingVertical: 16,
  },
});
