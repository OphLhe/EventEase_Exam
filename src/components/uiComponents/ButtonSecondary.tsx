import { Pressable, Text, StyleSheet } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { FontStyle } from "../../theme/typography";

type ButtonProps = {
  title: string;
  onPress: () => void;
};

export function ButtonSecondary({ title, onPress }: ButtonProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          backgroundColor: colors.btnSecondary,
          opacity: pressed ? 0.6 : 1,
          alignItems: "center",
          padding: 12,
          borderRadius: 12,
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: colors.borderSecondary,
        },
      ]}
    >
      <Text style={[FontStyle.button, { color: colors.textSecondary }]}>
        {title}
      </Text>
    </Pressable>
  );
}
