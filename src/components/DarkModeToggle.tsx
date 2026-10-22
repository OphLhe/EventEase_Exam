import { Switch, View } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";

const DarkToggleTheme = () => {
  const { isDark, toggleTheme } = useTheme();
  const { colors } = useTheme();

  return (
    <>
      <View
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          flexDirection: "row",
          gap: 4,
        }}
      >
        <Ionicons
          name="sunny"
          size={20}
          color={colors.mainText}
          accessibilityLabel="mode clair"
          accessibilityRole="switch"
        />
        <Switch
          trackColor={{
            false: colors.btnPrimary,
            true: colors.textPlaceholder,
          }}
          thumbColor={isDark ? colors.mainText : colors.btnInfo}
          ios_backgroundColor={colors.btnInfo}
          onValueChange={toggleTheme}
          value={isDark}
        />
        <Ionicons
          name="moon"
          size={20}
          color={colors.mainText}
          accessibilityLabel="mode sombre"
          accessibilityRole="switch"
        />
      </View>
    </>
  );
};

export default DarkToggleTheme;
