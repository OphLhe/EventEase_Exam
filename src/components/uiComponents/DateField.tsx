import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useTheme } from "../../hooks/useTheme";
import { FontStyle } from "../../theme/typography";

export type DateFieldProps = {
  label: string;
  value: Date | null;
  onChange: (date: Date) => void;
  minimumDate?: Date;
};

export function DateField({
  label,
  value,
  onChange,
  minimumDate,
}: DateFieldProps) {
  const { colors, isDark } = useTheme();
  const text = value
    ? format(value, "EEEE d MMMM yyyy 'à' HH'h'mm", { locale: fr })
    : "Choisir une date et une heure";

  // Android : deux boîtes successives, date puis heure
  const openAndroid = () => {
    DateTimePickerAndroid.open({
      value: value ?? new Date(),
      mode: "date",
      minimumDate,
      onChange: (e, pickedDate) => {
        if (e.type !== "set" || !pickedDate) return;
        DateTimePickerAndroid.open({
          value: pickedDate,
          mode: "time",
          is24Hour: true,
          onChange: (e2, pickedTime) => {
            if (e2.type !== "set" || !pickedTime) return;
            const merged = new Date(pickedDate);
            merged.setHours(
              pickedTime.getHours(),
              pickedTime.getMinutes(),
              0,
              0,
            );
            onChange(merged);
          },
        });
      },
    });
  };

  return (
    <View style={styles.wrapper}>
      {Platform.OS === "android" ? (
        <Pressable
          onPress={openAndroid}
          accessibilityRole="button"
          accessibilityLabel={`${label} : ${text}`}
          style={[
            styles.field,
            {
              backgroundColor: colors.inputBg,
              borderColor: colors.inputStroke,
            },
          ]}
        >
          <Text
            style={[
              FontStyle.body,
              { color: value ? colors.mainText : colors.textPlaceholder },
            ]}
          >
            {text}
          </Text>
        </Pressable>
      ) : (
        <DateTimePicker
          value={value ?? new Date()}
          mode="datetime"
          display="compact"
          minimumDate={minimumDate}
          themeVariant={isDark ? "dark" : "light"}
          accessibilityLabel={label}
          onChange={(_e, picked) => picked && onChange(picked)}
          style={styles.ios}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: "flex-start" },
  field: {
    alignSelf: "stretch",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  ios: { alignSelf: "flex-start" },
});
