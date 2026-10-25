import { router, useLocalSearchParams } from "expo-router";
import { Button, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { Scan } from "@/models/Scan";

export default function ScanDetailScreen() {
  const { scanId, value, barcodeType } = useLocalSearchParams<{
    scanId: string;
    value?: string;
    barcodeType?: string;
  }>();
  const insets = useSafeAreaInsets();
  const scannedAt = typeof scanId === "string" ? new Date(scanId) : null;
  const scan: Scan | null =
    scannedAt && !Number.isNaN(scannedAt.getTime()) &&
    typeof value === "string" && typeof barcodeType === "string"
      ? { value, type: barcodeType, scannedAt }
      : null;

  const closeDetails = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  return (
    <ScrollView
      className="scan-detail-screen"
      contentContainerStyle={{
        paddingTop: 24,
        paddingBottom: insets.bottom + 24,
        paddingLeft: insets.left + 24,
        paddingRight: insets.right + 24,
        gap: 24,
      }}
    >
      {scan ? (
        <>
          <View className="scan-detail-card">
            <Text className="scan-detail-label">Content</Text>
            <Text selectable className="scan-detail-value">{scan.value}</Text>
            <Text className="scan-detail-label">Format</Text>
            <Text className="scan-detail-value">{scan.type}</Text>
            <Text className="scan-detail-label">Scanned at</Text>
            <Text className="scan-detail-value">
              {scan.scannedAt.toLocaleString()}
            </Text>
          </View>
          <Text className="scan-detail-label">
            This scan has not been saved to history.
          </Text>
          <Button title="Discard" color="#ff383c" onPress={closeDetails} />
        </>
      ) : (
        <>
          <Text accessibilityRole="alert" className="scan-detail-value">
            Scan details are unavailable. Please scan the code again.
          </Text>
          <Button title="Back to scanning" onPress={closeDetails} />
        </>
      )}
    </ScrollView>
  );
}
