import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import ScanHistoryList from "@/components/ScanHistoryList";
import { Image } from "expo-image";

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
        <View className="scan-logo" accessible={false}>
          <Image
            source={require("@/assets/branding/honest-barcode-header.png")}
            contentFit="contain"
            style={{ width: "100%", height: "100%" }}
            accessible={false}
          />
        </View>
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
