import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { useTheme } from "../hooks/useTheme";
import { useState } from "react";
import { CategoryId } from "../types/eventType";
import { useNavigation } from "@react-navigation/native";
import { useEvents } from "../hooks/useEvents";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Button } from "../components/uiComponents/Button";
import { Input } from "../components/uiComponents/Input";
import { DateField } from "../components/uiComponents/DateField";
import { FontStyle } from "../theme/typography";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "../components/uiComponents/Screen";
import categories from "../data/categories.json";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

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

const EventScreen = () => {
  const { colors } = useTheme();
  const { createEvent } = useEvents();
  const navigation = useNavigation<NavigationProp>();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [categoryId, setCategoryId] = useState<CategoryId | null>(null);
  const [date, setDate] = useState<Date | null>(null);

  const [maxParticipants, setMaxParticipants] = useState("0");
  const [volunteersNeeded, setVolunteersNeeded] = useState("0");
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const e: Errors = {};

    /////// EVENT TITLE ////////
    if (!title.trim()) e.title = "Le titre est obligatoire.";
    else if (title.trim().length > 80)
      e.title = "Le titre ne doit pas dépasser 80 caractères.";

    /////// EVENT DESCRIPTION ////////
    if (!description.trim()) e.description = "La description est obligatoire.";

    /////// EVENT LOCATION ////////
    if (!location.trim()) e.location = "Le lieu est obligatoire.";

    /////// EVENT CATEGORY ////////
    if (!categoryId) e.categoryId = "Choisissez une catégorie.";

    /////// EVENT DATE ////////
    if (!date) e.date = "Choisissez une date et une heure.";
    else if (date.getTime() <= Date.now())
      e.date = "La date doit être dans le futur.";

    /////// EVENT MAX PARTICPANTS ////////
    const max = Number(maxParticipants);
    if (!maxParticipants.trim())
      e.maxParticipants = "Le nombre de places est obligatoire.";
    else if (!Number.isInteger(max) || max < 1)
      e.maxParticipants = "Entrez un nombre entier supérieur ou égal à 1.";

    /////// EVENT VOLUNTEERS NEEDED ////////
    const vol = Number(volunteersNeeded);
    if (!volunteersNeeded.trim())
      e.volunteersNeeded = "Entrez 0 si aucun bénévole n'est nécessaire.";
    else if (!Number.isInteger(vol) || vol < 0)
      e.volunteersNeeded = "Entrez un nombre entier supérieur ou égal à 0.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCreate = async () => {
    if (loading || !validate()) return;
    if (!date || !categoryId) return;
    setLoading(true);
    try {
      await createEvent({
        title,
        description: description.trim(),
        date: date.toISOString(),
        location: location.trim(),
        categoryId,
        maxParticipants: Number(maxParticipants),
        volunteersNeeded: Number(volunteersNeeded),
      });
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

  return (
    <Screen scroll contentStyle={styles.container}>
      <Text
        style={[FontStyle.h1, { color: colors.mainText }]}
        accessibilityRole="header"
      >
        Créer un évènement
      </Text>
      {renderError(errors.general)}

      {/* EVENT TITLE  */}
      <View style={styles.field}>
        <Text style={[FontStyle.body, { color: colors.mainText }]}>Titre</Text>
        <Input
          accessibilityLabel="Titre"
          placeholder="Ex. : Tournoi de basket 3x3"
          placeholderTextColor={colors.textPlaceholder}
          value={title}
          onChangeText={setTitle}
          returnKeyType="next"
        />
        {renderError(errors.title)}
      </View>

      {/* EVENT DESCRIPTION  */}
      <View style={styles.field}>
        <Text style={[FontStyle.body, { color: colors.mainText }]}>
          Description
        </Text>
        <Input
          accessibilityLabel="Description"
          placeholder="Décrivez l'évènement"
          placeholderTextColor={colors.textPlaceholder}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
        {renderError(errors.description)}
      </View>

      {/* EVENT LIEU  */}
      <View style={styles.field}>
        <Text style={[FontStyle.body, { color: colors.mainText }]}>Lieu</Text>
        <Input
          accessibilityLabel="Lieu"
          placeholder="Ex. : Gymnase Léo Lagrange, Paris"
          placeholderTextColor={colors.textPlaceholder}
          value={location}
          onChangeText={setLocation}
          returnKeyType="next"
        />
        {renderError(errors.location)}
      </View>

      {/* EVENT CATEGORIES */}
      <View style={styles.field}>
        <Text style={[FontStyle.body, { color: colors.mainText }]}>
          Catégories
        </Text>
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
                      : colors.btnSecondary,
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

      {/* EVENT DATE  */}
      <View style={styles.field}>
        <Text style={[FontStyle.body, { color: colors.mainText }]}>Date</Text>
        <DateField
          label="Date et heure"
          value={date}
          onChange={setDate}
          minimumDate={new Date()}
        />
        {renderError(errors.date)}
      </View>

      {/* EVENT MAX PARTICIPANTS  */}
      <View style={styles.field}>
        <Text style={[FontStyle.body, { color: colors.mainText }]}>
          Nombre maximum de participants autorisés
        </Text>
        <Input
          accessibilityLabel="Nombre de places"
          placeholder="Ex. : 40"
          placeholderTextColor={colors.textPlaceholder}
          value={maxParticipants}
          onChangeText={setMaxParticipants}
          keyboardType="number-pad"
          returnKeyType="next"
        />
        {renderError(errors.maxParticipants)}
      </View>

      {/* EVENT MAX VOLUNTEERS  */}
      <View style={styles.field}>
        <Text style={[FontStyle.body, { color: colors.mainText }]}>
          Nombre de bénévoles nécessaires
        </Text>
        <Input
          accessibilityLabel="Bénévoles nécessaires"
          placeholder="0"
          placeholderTextColor={colors.textPlaceholder}
          value={volunteersNeeded}
          onChangeText={setVolunteersNeeded}
          keyboardType="number-pad"
          returnKeyType="done"
        />
        {renderError(errors.volunteersNeeded)}
      </View>
      <Button title="Créer l'évènement" onPress={handleCreate} />
    </Screen>
  );
};
export default EventScreen;

const styles = StyleSheet.create({
  container: {
    gap: 20,
    paddingBottom: 32,
  },
  field: {
    gap: 8,
  },
  pills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
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
