import { Alert, StyleSheet, Text, View } from "react-native";
import { Screen } from "../components/uiComponents/Screen";
import { FontStyle } from "../theme/typography";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { ButtonSecondary } from "../components/uiComponents/ButtonSecondary";
import { useEvents } from "../hooks/useEvents";
import { isRegistered } from "../utils/events";
import { formatDate } from "date-fns";
import { fr } from "date-fns/locale";

const ProfilScreen = () => {
  const { user, logout } = useAuth();
  const { colors } = useTheme();
  const { events } = useEvents();
  const myEvents = events
    .filter((e) => isRegistered(e, user?.id))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handleLogout = () => {
    Alert.alert(
      "Se déconnecter.",
      "Vous êtes sur le point de vous déconnecter.",
      [
        { text: "Annuler", style: "cancel" },
        { text: "Se déconnecter", onPress: () => logout() },
      ],
    );
  };
  return (
    <>
      <Screen>
        <Text style={[FontStyle.h1, { color: colors.mainText }]}>
          Mon Profil
        </Text>
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={[FontStyle.h2, { color: colors.mainText }]}>
              {user?.firstName} {user?.lastName}
            </Text>
            <View style={styles.info}>
              <Text style={[FontStyle.body, { color: colors.textPlaceholder }]}>
                Adresse e-mail
              </Text>
              <Text style={[FontStyle.button, { color: colors.mainText }]}>
                {user?.email}
              </Text>
              <Text style={[FontStyle.body, { color: colors.textPlaceholder }]}>
                Rôle dans l'association
              </Text>
              <Text style={[FontStyle.button, { color: colors.mainText }]}>
                {user?.role}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.listEvent}>
          <Text
            style={[FontStyle.h2, { color: colors.mainText }]}
            accessibilityRole="header"
          >
            Mes évènements ({myEvents.length})
          </Text>
          {myEvents.length === 0 ? (
            <Text style={[FontStyle.body, { color: colors.subText }]}>
              Aucune inscription pour le moment.
            </Text>
          ) : (
            myEvents.map((e) => (
              <Text
                key={e.id}
                style={[
                  FontStyle.body,
                  {
                    color: colors.mainText,
                    backgroundColor: colors.cardBg,
                    borderColor: colors.cardStroke,
                    borderWidth: 1,
                    marginVertical: 4,
                    padding: 8,
                    borderRadius: 8,
                  },
                ]}
              >
                {e.title} ·{" "}
                {formatDate(new Date(e.date), "d MMM yyyy", { locale: fr })}
              </Text>
            ))
          )}
        </View>
        <ButtonSecondary title="Se déconnecter" onPress={handleLogout} />
      </Screen>
    </>
  );
};

export default ProfilScreen;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "lightgray",
    borderStyle: "solid",
    padding: 24,
    borderRadius: 24,
    marginTop: 24,
    marginBottom: 32,
  },
  content: {},
  info: {
    borderTopWidth: 1,
    borderTopColor: "lightgray",
    borderStyle: "solid",
    marginTop: 12,
    paddingTop: 12,
  },

  listEvent: {
    marginBottom: 56,
  },
});
