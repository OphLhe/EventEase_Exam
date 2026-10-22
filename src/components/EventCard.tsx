import { useTheme } from "../hooks/useTheme";
import { EventType } from "../types/eventType";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import categories from "../data/categories.json";
import { StyleSheet, Text, View } from "react-native";
import { FontStyle } from "../theme/typography";
import { Ionicons } from "@expo/vector-icons";
import { ButtonSecondary } from "./uiComponents/ButtonSecondary";
import { Button } from "./uiComponents/Button";

type EventCardProps = {
  event: EventType;
  registered: boolean;
  onToggleRegistration: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

const EventCard = ({
  event,
  registered,
  onToggleRegistration,
  onEdit,
  onDelete,
}: EventCardProps) => {
  const { colors } = useTheme();
  const category = categories.find((c) => c.id === event.categoryId);
  const dateLabel = format(
    new Date(event.date),
    "EEEE d MMMM yyyy 'à' HH'h'mm",
    {
      locale: fr,
    },
  );

  return (
    <>
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.cardBg,
            borderColor: colors.cardStroke,
          },
        ]}
      >
        <View
          accessible
          accessibilityLabel={`${event.title}, ${category?.label ?? ""}, ${dateLabel}, ${event.location}, ${event.participantIds.length} inscrits sur ${event.maxParticipants}${registered ? ", vous êtes inscrit" : ""}`}
          style={styles.info}
        >
          <View style={styles.row}>
            <Text style={[FontStyle.body, { color: colors.subText }]}>
              {category?.label ?? "Autre"}
            </Text>
            {registered && (
              <View style={styles.badge}>
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color={colors.mainText}
                />
                <Text style={[FontStyle.body, { color: colors.mainText }]}>
                  Inscrit
                </Text>
              </View>
            )}
            {(onEdit || onDelete) && (
              <View style={styles.actions}>
                {onEdit && (
                  <Button title="Modifier l'évènement" onPress={onEdit} />
                )}
                {onDelete && (
                  <Button title="Supprimer l'evènement" onPress={onDelete} />
                )}
              </View>
            )}
          </View>
          <Text style={[FontStyle.h3, { color: colors.mainText }]}>
            {event.title}
          </Text>
          <Text style={[FontStyle.body, { color: colors.mainText }]}>
            {dateLabel}
          </Text>
          <Text style={[FontStyle.body, { color: colors.subText }]}>
            {event.location}
          </Text>
          <Text style={[FontStyle.body, { color: colors.subText }]}>
            {event.participantIds.length}/{event.maxParticipants} inscrits
          </Text>
        </View>

        {registered ? (
          <ButtonSecondary
            title="Se désinscrire"
            onPress={onToggleRegistration}
          />
        ) : (
          <Button title="S'inscrire" onPress={onToggleRegistration} />
        )}
      </View>
    </>
  );
};

export default EventCard;

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  info: {
    gap: 6,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    width: "50%",
  },
  iconBtn: {
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
});
