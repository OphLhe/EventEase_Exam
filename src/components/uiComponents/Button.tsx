import { Pressable, Text, StyleSheet } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { FontStyle } from "../../theme/typography";

type ButtonProps = {
  title: string;
  onPress: () => void;
};

export function Button({ title, onPress }: ButtonProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          backgroundColor: colors.btnPrimary,
          opacity: pressed ? 0.6 : 1,
          alignItems: "center",
          padding: 12,
          borderRadius: 12,
        },
      ]}
    >
      <Text style={[FontStyle.button, { color: colors.textPrimary }]}>
        {title}
      </Text>
    </Pressable>
  );
}
