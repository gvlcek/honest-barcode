import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Trans, useTranslation } from "react-i18next";

export default function AboutScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  return (
    <View className="about-screen">
      <View
        className="section-header"
        style={{
          paddingTop: insets.top + 24,
          paddingLeft: insets.left + 24,
          paddingRight: insets.right + 24,
        }}
      >
        <Text accessibilityRole="header" className="section-header-title">
          {t("tabs.about")}
        </Text>
      </View>
      <View className="section-body">
        <ScrollView
          contentInsetAdjustmentBehavior="never"
          contentContainerStyle={{
            paddingTop: 24,
            paddingBottom: 24,
            paddingLeft: insets.left + 24,
            paddingRight: insets.right + 24,
            gap: 24,
          }}
        >
          <View className="about-card">
            <Text accessibilityRole="header" className="about-title">Honest Apps</Text>
            <Text className="about-description">
              <Trans
                i18nKey="about.byStudio"
                components={{ studio: <Text className="font-sans-bold" /> }}
              />
            </Text>
            <Text className="about-description">{t("about.description")}</Text>
          </View>
          <View className="about-card">
            <Text accessibilityRole="header" className="about-title">HonestBarcode</Text>
            <Text className="about-description">{t("about.barcodeDescription")}</Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
