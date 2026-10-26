import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import ScanHistoryList from "@/components/ScanHistoryList";

export default function HomeScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <View className="scan-screen">
      <View
        className="scan-header"
        style={{
          paddingTop: insets.top + 32,
          paddingLeft: insets.left + 24,
          paddingRight: insets.right + 24,
        }}
      >
        <View
          className="scan-logo-placeholder"
          accessible={false}
        />
        <View className="scan-header-copy">
          <Text className="scan-greeting">{t("home.welcome")}</Text>
          <Text className="scan-title">HonestBarcode</Text>
        </View>
      </View>

      <View className="scan-body">
        <ScanHistoryList />
      </View>
    </View>
  );
}
