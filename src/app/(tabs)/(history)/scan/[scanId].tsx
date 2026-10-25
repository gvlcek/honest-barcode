import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Button, Platform, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { Scan } from "@/models/Scan";
import SaveScanButton from "@/components/SaveScanButton";
import { useSQLiteContext } from "expo-sqlite";
import { getScan, saveScan } from "@/repositories/scanRepository";

export default function ScanDetailScreen() {
  const database = useSQLiteContext();
  const { scanId, value, barcodeType } = useLocalSearchParams<{
    scanId: string;
    value?: string;
    barcodeType?: string;
  }>();
  const insets = useSafeAreaInsets();
  const isDraft = value !== undefined || barcodeType !== undefined;
  const [savedResult, setSavedResult] = useState<{
    id: string;
    scan: Scan | null;
    error: string | null;
  } | null>(null);
  const isLoading = !isDraft && savedResult?.id !== scanId;

  useEffect(() => {
    if (isDraft) return;
    let isActive = true;

    const loadScan = async () => {
      try {
        const savedScan = await getScan(database, scanId);
        if (isActive) setSavedResult({ id: scanId, scan: savedScan, error: null });
      } catch {
        if (isActive) {
          setSavedResult({
            id: scanId,
            scan: null,
            error: "Unable to load this scan. Please return to History and try again.",
          });
        }
      }
    };

    void loadScan();
    return () => { isActive = false; };
  }, [database, scanId, isDraft]);

  const scannedAt = typeof scanId === "string" ? new Date(scanId) : null;
  const draftScan: Scan | null =
    scannedAt && !Number.isNaN(scannedAt.getTime()) &&
    typeof value === "string" && typeof barcodeType === "string"
      ? { value, type: barcodeType, scannedAt }
      : null;
  const scan = isDraft ? draftScan : savedResult?.id === scanId ? savedResult.scan : null;

  const closeDetails = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  const handleSaveScan = async () => {
    if (!scan || !isDraft) return;

    await saveScan(database, scan);
    router.dismissTo("/history");
  };

  return (
    <View className="scan-detail-screen">
      <ScrollView
        className="scan-detail-screen"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          paddingTop: 24,
          // iOS adjusts for the native header and safe area automatically.
          paddingBottom: 24 + (Platform.OS === "ios" ? 0 : insets.bottom),
          paddingLeft: 24 + (Platform.OS === "ios" ? 0 : insets.left),
          paddingRight: 24 + (Platform.OS === "ios" ? 0 : insets.right),
          gap: 24,
        }}
      >
        {isLoading ? (
          <ActivityIndicator accessibilityLabel="Loading scan details" />
        ) : scan ? (
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
            {isDraft && (
              <>
                <Text className="scan-detail-label">
                  This scan has not been saved to history.
                </Text>
                <Button title="Discard" color="#ff383c" onPress={closeDetails} />
              </>
            )}
          </>
        ) : (
          <>
            <Text accessibilityRole="alert" className="scan-detail-value">
              {isDraft
                ? "Scan details are unavailable. Please scan the code again."
                : savedResult?.error ?? "This scan could not be found in history."}
            </Text>
            <Button title="Go back" onPress={closeDetails} />
          </>
        )}
      </ScrollView>
      {scan && isDraft && (
        <View
          className="scan-detail-actions"
          style={{
            paddingTop: 16,
            paddingBottom: insets.bottom + 16,
            paddingLeft: insets.left + 24,
            paddingRight: insets.right + 24,
          }}
        >
          <SaveScanButton onSave={handleSaveScan} />
        </View>
      )}
    </View>
  );
}
