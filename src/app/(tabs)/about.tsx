import { Platform, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

export default function AboutScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      className="about-screen"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        paddingTop: 24,
        paddingBottom: 24,
        paddingLeft: 24 + (Platform.OS === "ios" ? 0 : insets.left),
        paddingRight: 24 + (Platform.OS === "ios" ? 0 : insets.right),
        gap: 24,
      }}
    >
      <View className="about-card">
        <Text accessibilityRole="header" className="about-title">Honest Apps</Text>
        <Text className="about-description">{t("about.byStudio")}</Text>
        <Text className="about-description">{t("about.description")}</Text>
      </View>
      <View className="about-card">
        <Text accessibilityRole="header" className="about-title">HonestBarcode</Text>
        <Text className="about-description">{t("about.barcodeDescription")}</Text>
      </View>
    </ScrollView>
  );
}
