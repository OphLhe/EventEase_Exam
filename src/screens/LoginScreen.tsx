import { Button } from "../components/uiComponents/Button";
import { useTheme } from "../hooks/useTheme";
import { Screen } from "../components/uiComponents/Screen";
import { Input } from "../components/uiComponents/Input";
import DarkToggleTheme from "../components/DarkModeToggle";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { useAuth } from "../hooks/useAuth";
import { FontStyle } from "../theme/typography";
import { Ionicons } from "@expo/vector-icons";
import Logo from "../assets/Logo.svg";
import { ButtonSecondary } from "../components/uiComponents/ButtonSecondary";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type Errors = {
  email?: string;
  password?: string;
  general?: string;
};

const LoginScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  const passwordRef = useRef<TextInput>(null);

  const validate = (): boolean => {
    const e: Errors = {};
    if (!email.trim()) e.email = "L'adresse email est obligatoire.";
    if (!password) e.password = "Le mot de passe est obligatoire.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (loading || !validate()) return;
    setLoading(true);
    try {
      const success = await login(email, password);
      if (!success) {
        setErrors({ general: "Email ou mot de passe incorrect." });
      }
    } catch (error) {
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
    <>
      <Screen scroll contentStyle={styles.container}>
        <DarkToggleTheme />

        <View style={styles.header}>
          <Logo width={90} height={90} />
          <Text
            style={[
              FontStyle.h1,
              { color: colors.mainText, textAlign: "center" },
            ]}
          >
            De beaux moments à vivre ensemble
          </Text>
        </View>

        <View style={styles.form}>
          {renderError(errors.general)}

          {/************************ EMAIL **************************/}
          <View style={styles.formContent}>
            <Text style={[FontStyle.body, { color: colors.mainText }]}>
              Adresse e-mail
            </Text>
            <Input
              accessibilityLabel="Adresse email"
              placeholder="Entrez votre adresse email"
              placeholderTextColor={colors.textPlaceholder}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoComplete="email"
              textContentType="emailAddress"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
            />
            {renderError(errors.email)}
          </View>

          {/********************** MOT DE PASSE **********************/}
          <View style={styles.formContent}>
            <Text style={[FontStyle.body, { color: colors.mainText }]}>
              Mot de passe
            </Text>
            <View style={styles.passwordWrapper}>
              <Input
                ref={passwordRef}
                accessibilityLabel="Mot de passe"
                placeholder="Entrez votre mot de passe"
                placeholderTextColor={colors.textPlaceholder}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoComplete="password"
                textContentType="password"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
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
            {renderError(errors.password)}
          </View>

          <Button title="Se connecter" onPress={handleLogin} />

          <ButtonSecondary
            title="Pas de compte ? Créer un compte"
            onPress={() => navigation.navigate("RegisterScreen")}
          />
        </View>
      </Screen>
    </>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    gap: 32,
    justifyContent: "center",
  },
  header: {
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
