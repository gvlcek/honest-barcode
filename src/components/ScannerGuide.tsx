import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";

export default function ScannerGuide() {
  const { t } = useTranslation();
  return (
    <View className="scanner-guide" pointerEvents="none">
      <View className="scanner-guide-frame" accessible={false}>
        <View className="scanner-guide-corner scanner-guide-top-left" />
        <View className="scanner-guide-corner scanner-guide-top-right" />
        <View className="scanner-guide-corner scanner-guide-bottom-left" />
        <View className="scanner-guide-corner scanner-guide-bottom-right" />
      </View>
      <Text className="scanner-guide-hint">
        {t("scanner.guide")}
      </Text>
    </View>
  );
}
