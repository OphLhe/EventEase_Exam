import { Pressable, StyleSheet, Text, View } from "react-native";
import { Screen } from "../components/uiComponents/Screen";
import { useTheme } from "../hooks/useTheme";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import Logo from "../assets/Logo.svg";
import { Button } from "../components/uiComponents/Button";
import { Ionicons } from "@expo/vector-icons";
import { FontStyle } from "../theme/typography";
import { Input } from "../components/uiComponents/Input";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type Errors = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
};

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const UPPERCASE_REGEX = /[A-Z]/;
export const DIGIT_REGEX = /\d/;
export const NAME_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/;

const RegisterScreen = () => {
  const { colors } = useTheme();
  const { register } = useAuth();
  const navigation = useNavigation<NavigationProp>();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<Errors>({});
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

  const validate = (): boolean => {
    const e: Errors = {};

    /// VERIFICATION NOM ET PRENOM

    if (!firstName.trim()) {
      e.firstName = "Le prénom est obligatoire.";
    } else if (!NAME_REGEX.test(firstName.trim())) {
      e.firstName =
        "Le prénom ne peut contenir que des lettres, espaces et tirets.";
    }

    if (!lastName.trim()) {
      e.lastName = "Le nom est obligatoire.";
    } else if (!NAME_REGEX.test(lastName.trim())) {
      e.lastName =
        "Le nom ne peut contenir que des lettres, espaces et tirets..";
    }

    /// VERIFICATION EMAIL

    if (!email.trim()) {
      e.email = "L'adresse email est obligatoire.";
    } else if (!EMAIL_REGEX.test(email.trim())) {
      e.email =
        "Le format de l'adresse e-mail est incorrect. Exemple: prenom@domaine.com";
    }

    /// VERIFICATION PASSWORD

    if (!password) {
      e.password = "Le mot de passe est obligatoire.";
    } else if (password.length < 4) {
      e.password = "Le mot de passe doit contenir au minimum 12 caractères.";
    } else if (!UPPERCASE_REGEX.test(password)) {
      e.password =
        "Le mot de passe doit contenir au moins une lettre majuscule.";
    } else if (!DIGIT_REGEX.test(password)) {
      e.password = "Le mot de passe doit contenir au moins un chiffre.";
    }

    /// VERIFICATION CONFIRM PASSWORD

    if (!confirmPassword) {
      e.confirmPassword = "Veuillez confirmer le mot de passe.";
    } else if (!e.password && password !== confirmPassword) {
      e.confirmPassword = "Les mots de passe ne correspondent pas.";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (loading || !validate()) return;
    setLoading(true);
    try {
      const success = await register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email,
        password,
      });
      if (!success) {
        setErrors({ email: "Cette adresse e-mail est déjà utilisée." });
      }
    } catch {
      setErrors({ general: "Une erreur est survenue. Veuillez réessayer." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Screen scroll contentStyle={styles.container}>
        <View style={styles.header}>
          <Logo width={90} height={90} />
          <Text
            style={[
              FontStyle.h1,
              {
                color: colors.mainText,
                textAlign: "center",
              },
            ]}
          >
            Créer un compte
          </Text>
        </View>

        <View style={styles.form}>
          {renderError(errors.general)}

          {/************************ NOM ET PRENOM **************************/}

          <View style={styles.formContent}>
            <Text style={[FontStyle.body, { color: colors.mainText }]}>
              Prénom*
            </Text>
            <Input
              accessibilityLabel="Prénom"
              placeholder="Entrez votre prénom"
              value={firstName}
              onChangeText={setFirstName}
              placeholderTextColor={colors.textPlaceholder}
              keyboardType="default"
              autoComplete="given-name"
              textContentType="givenName"
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="next"
            />
            {renderError(errors.firstName)}

            <Text style={[FontStyle.body, { color: colors.mainText }]}>
              Nom*
            </Text>
            <Input
              accessibilityLabel="Nom"
              placeholder="Entrez votre nom"
              value={lastName}
              onChangeText={setLastName}
              placeholderTextColor={colors.textPlaceholder}
              keyboardType="default"
              autoComplete="family-name"
              textContentType="familyName"
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="next"
            />
            {renderError(errors.lastName)}
          </View>

          {/************************ EMAIL **************************/}

          <View style={styles.formContent}>
            <Text style={[FontStyle.body, { color: colors.mainText }]}>
              Adresse e-mail*
            </Text>
            <Input
              accessibilityLabel="Adresse email"
              placeholder="Entrez votre adresse email"
              value={email}
              onChangeText={setEmail}
              placeholderTextColor={colors.textPlaceholder}
              keyboardType="email-address"
              autoComplete="email"
              textContentType="emailAddress"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />
            {renderError(errors.email)}
          </View>

          {/********************** MOT DE PASSE **********************/}

          <View style={styles.formContent}>
            <Text style={[FontStyle.body, { color: colors.mainText }]}>
              Mot de passe*
            </Text>
            <View style={styles.passwordWrapper}>
              <Input
                accessibilityLabel="Mot de passe"
                placeholder="Entrez votre mot de passe"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholderTextColor={colors.textPlaceholder}
                autoComplete="new-password"
                textContentType="newPassword"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
              />
              <Pressable
                style={styles.eye}
                onPress={() => setShowPassword((v) => !v)}
                accessibilityRole="button"
                accessibilityLabel={
                  showPassword
                    ? "Masquer le mot de passe"
                    : "Afficher le mot de passe"
                }
                hitSlop={8}
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={22}
                  color={colors.subText}
                />
              </Pressable>
            </View>
            <Text style={{ color: colors.textPlaceholder }}>
              12 caractères minimum, dont une lettre majuscule et un chiffre
            </Text>

            {renderError(errors.password)}

            {/********************** CONFIRMATION MOT DE PASSE **********************/}

            <Text style={[FontStyle.body, { color: colors.mainText }]}>
              Confirmer le mot de passe
            </Text>
            <View style={styles.passwordWrapper}>
              <Input
                accessibilityLabel="Confirmation du mot de passe"
                placeholder="Confirmer votre mot de passe"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword2}
                placeholderTextColor={colors.textPlaceholder}
                autoComplete="new-password"
                textContentType="newPassword"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={handleRegister}
              />
              <Pressable
                style={styles.eye}
                onPress={() => setShowPassword2((v) => !v)}
                accessibilityRole="button"
                accessibilityLabel={
                  showPassword2
                    ? "Masquer le mot de passe"
                    : "Afficher le mot de passe"
                }
                hitSlop={8}
              >
                <Ionicons
                  name={showPassword2 ? "eye-off" : "eye"}
                  size={22}
                  color={colors.subText}
                />
              </Pressable>
            </View>
            {renderError(errors.confirmPassword)}
          </View>

          <Button title="Créer mon compte" onPress={handleRegister} />
          <Text style={[FontStyle.body, { color: colors.mainText }]}>
            Déjà un compte?{" "}
            <Text
              onPress={() => navigation.goBack()}
              accessibilityRole="link"
              style={[
                {
                  color: colors.textSecondary,
                  textDecorationLine: "underline",
                },
              ]}
            >
              Se connecter
            </Text>
          </Text>
        </View>
      </Screen>
    </>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    gap: 32,
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  form: {
    gap: 16,
  },
  formContent: {
    gap: 8,
  },
  passwordWrapper: {
    justifyContent: "center",
  },
  eye: {
    position: "absolute",
    right: 24,
  },
  error: {
    fontSize: 14,
  },
  link: {
    alignItems: "center",
    paddingVertical: 12,
  },
});
