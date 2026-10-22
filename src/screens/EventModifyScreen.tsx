import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Screen } from "../components/uiComponents/Screen";
import { Input } from "../components/uiComponents/Input";
import { Button } from "../components/uiComponents/Button";
import { DateField } from "../components/uiComponents/DateField";
import categories from "../data/categories.json";
import { useTheme } from "../hooks/useTheme";
import { useEvents } from "../hooks/useEvents";
import { FontStyle } from "../theme/typography";
import { CategoryId } from "../types/eventType";
import { RootStackParamList } from "../navigation/RootNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "EventModifyScreen">;

type Errors = {
  title?: string;
  description?: string;
  location?: string;
  categoryId?: string;
  date?: string;
  maxParticipants?: string;
  volunteersNeeded?: string;
  general?: string;
};

const EventModifyScreen = ({ route, navigation }: Props) => {
  const { colors } = useTheme();
  const { events, updateEvent } = useEvents();

  const { eventId } = route.params;
  const existing = events.find((e) => e.id === eventId);

  const [title, setTitle] = useState(existing?.title ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [location, setLocation] = useState(existing?.location ?? "");
  const [categoryId, setCategoryId] = useState<CategoryId | null>(
    existing?.categoryId ?? null,
  );
  const [date, setDate] = useState<Date | null>(
    existing ? new Date(existing.date) : null,
  );
  const [maxParticipants, setMaxParticipants] = useState(
    String(existing?.maxParticipants ?? ""),
  );
  const [volunteersNeeded, setVolunteersNeeded] = useState(
    String(existing?.volunteersNeeded ?? 0),
  );
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  if (!existing) {
    return (
      <Screen>
        <Text style={[FontStyle.body, { color: colors.mainText }]}>
          Cet évènement n'existe plus.
        </Text>
        <Button title="Retour" onPress={() => navigation.goBack()} />
      </Screen>
    );
  }

  const validate = (): boolean => {
    const e: Errors = {};

    if (!title.trim()) e.title = "Le titre est obligatoire.";
    else if (title.trim().length > 80)
      e.title = "Le titre ne doit pas dépasser 80 caractères.";

    if (!description.trim()) e.description = "La description est obligatoire.";
    if (!location.trim()) e.location = "Le lieu est obligatoire.";
    if (!categoryId) e.categoryId = "Choisissez une catégorie.";

    const dateChanged = date?.toISOString() !== existing.date;
    if (!date) e.date = "Choisissez une date et une heure.";
    else if (dateChanged && date.getTime() <= Date.now())
      e.date = "La date doit être dans le futur.";

    const max = Number(maxParticipants);
    const registeredCount = existing.participantIds.length;
    if (!maxParticipants.trim())
      e.maxParticipants = "Le nombre de places est obligatoire.";
    else if (!Number.isInteger(max) || max < 1)
      e.maxParticipants = "Entrez un nombre entier supérieur ou égal à 1.";
    else if (max < registeredCount)
      e.maxParticipants = `${registeredCount} personne(s) sont déjà inscrites : entrez au moins ${registeredCount}.`;

    const vol = Number(volunteersNeeded);
    if (!volunteersNeeded.trim())
      e.volunteersNeeded = "Entrez 0 si aucun bénévole n'est nécessaire.";
    else if (!Number.isInteger(vol) || vol < 0)
      e.volunteersNeeded = "Entrez un nombre entier supérieur ou égal à 0.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (loading || !validate()) return;
    if (!date || !categoryId) return;
    setLoading(true);
    try {
      const ok = await updateEvent(eventId, {
        title,
        description: description.trim(),
        date: date.toISOString(),
        location: location.trim(),
        categoryId,
        maxParticipants: Number(maxParticipants),
        volunteersNeeded: Number(volunteersNeeded),
      });
      if (!ok)
        setErrors({
          general:
            "Action refusée : vous devez être l'organisateur de cet évènement.",
        });
      else navigation.goBack();
    } catch {
      setErrors({ general: "Une erreur est survenue. Veuillez réessayer." });
    } finally {
      setLoading(false);
    }
  };

  const renderError = (message?: string) =>
    message ? (
      <Text
        accessibilityRole="alert"
        accessibilityLiveRegion="polite"
        style={[styles.error, { color: colors.error }]}
      >
        {message}
      </Text>
    ) : null;

  const label = (text: string) => (
    <Text style={[FontStyle.body, { color: colors.mainText }]}>{text}</Text>
  );

  return (
    <Screen scroll contentStyle={styles.container}>
      <Text
        style={[FontStyle.h1, { color: colors.mainText }]}
        accessibilityRole="header"
      >
        Modifier l'évènement
      </Text>

      {renderError(errors.general)}

      <View style={styles.field}>
        {label("Titre")}
        <Input
          accessibilityLabel="Titre"
          placeholder="Ex. : Tournoi de basket 3x3"
          value={title}
          onChangeText={setTitle}
          returnKeyType="next"
        />
        {renderError(errors.title)}
      </View>

      <View style={styles.field}>
        {label("Description")}
        <Input
          accessibilityLabel="Description"
          placeholder="Décrivez l'évènement"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
        {renderError(errors.description)}
      </View>

      <View style={styles.field}>
        {label("Lieu")}
        <Input
          accessibilityLabel="Lieu"
          placeholder="Ex. : Gymnase Léo Lagrange, Paris"
          value={location}
          onChangeText={setLocation}
          returnKeyType="next"
        />
        {renderError(errors.location)}
      </View>

      <View style={styles.field}>
        {label("Catégorie")}
        <View style={styles.pills} accessibilityRole="radiogroup">
          {categories.map((c) => {
            const selected = categoryId === c.id;
            return (
              <Pressable
                key={c.id}
                onPress={() => setCategoryId(c.id as CategoryId)}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                style={[
                  styles.pill,
                  {
                    backgroundColor: selected
                      ? colors.btnPrimary
                      : "transparent",
                    borderColor: selected
                      ? colors.btnPrimary
                      : colors.inputStroke,
                  },
                ]}
              >
                {selected && (
                  <Ionicons
                    name="checkmark"
                    size={16}
                    color={colors.textPrimary}
                  />
                )}
                <Text
                  style={[
                    FontStyle.body,
                    {
                      color: selected ? colors.textPrimary : colors.mainText,
                    },
                  ]}
                >
                  {c.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
        {renderError(errors.categoryId)}
      </View>

      <View style={styles.field}>
        {label("Date et heure")}
        <DateField label="Date et heure" value={date} onChange={setDate} />
        {renderError(errors.date)}
      </View>

      <View style={styles.field}>
        {label("Nombre de places")}
        <Input
          accessibilityLabel="Nombre de places"
          placeholder="Ex. : 40"
          value={maxParticipants}
          onChangeText={setMaxParticipants}
          keyboardType="number-pad"
          returnKeyType="next"
        />
        {renderError(errors.maxParticipants)}
      </View>

      <View style={styles.field}>
        {label("Bénévoles nécessaires")}
        <Input
          accessibilityLabel="Bénévoles nécessaires"
          placeholder="0"
          value={volunteersNeeded}
          onChangeText={setVolunteersNeeded}
          keyboardType="number-pad"
          returnKeyType="done"
        />
        {renderError(errors.volunteersNeeded)}
      </View>

      <Button title="Enregistrer les modifications" onPress={handleSubmit} />
    </Screen>
  );
};

export default EventModifyScreen;

const styles = StyleSheet.create({
  container: { gap: 20, paddingBottom: 32 },
  field: { gap: 8 },
  pills: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  error: { fontSize: 14 },
});
