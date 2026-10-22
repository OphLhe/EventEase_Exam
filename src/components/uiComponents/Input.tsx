import { TextInput, TextInputProps } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { FontStyle } from "../../theme/typography";
import { Ref } from "react";

type InputProps = TextInputProps & { ref?: Ref<TextInput> };

export function Input({ ref, ...props }: InputProps) {
  const { colors } = useTheme();

  return (
    <TextInput
      ref={ref}
      style={[
        FontStyle.body,
        {
          color: colors.mainText,
          backgroundColor: colors.inputBg,
          borderColor: colors.inputStroke,
          borderWidth: 1,
          padding: 12,
          borderRadius: 12,
        },
      ]}
      {...props}
    />
  );
}
