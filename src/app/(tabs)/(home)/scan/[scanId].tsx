import { useEffect, useState } from "react";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Button, Platform, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { Scan } from "@/models/Scan";
import ScanDraftActions from "@/components/ScanDraftActions";
import DeleteScanButton from "@/components/DeleteScanButton";
import { useSQLiteContext } from "expo-sqlite";
import { deleteScan, getScan, saveScan } from "@/repositories/scanRepository";
import { useTranslation } from "react-i18next";
import { useCalendars, useLocales } from "expo-localization";
import { resolveLocale } from "@/i18n/locale";

export default function ScanDetailScreen() {
  const { t } = useTranslation();
  const locales = useLocales();
  const uses24hourClock = useCalendars()[0]?.uses24hourClock;
  const { languageTag } = resolveLocale(locales);
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
    error: boolean;
  } | null>(null);
  const isLoading = !isDraft && savedResult?.id !== scanId;

  useEffect(() => {
    if (isDraft) return;
    let isActive = true;

    const loadScan = async () => {
      try {
        const savedScan = await getScan(database, scanId);
        if (isActive) setSavedResult({ id: scanId, scan: savedScan, error: false });
      } catch {
        if (isActive) {
          setSavedResult({
            id: scanId,
            scan: null,
            error: true,
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
    router.dismissTo("/");
  };

  const handleDeleteScan = async () => {
    if (!scan || isDraft) return;

    await deleteScan(database, scan.scannedAt.toISOString());
    router.dismissTo("/");
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: !isDraft }} />
      <View className="scan-detail-screen">
        <ScrollView
          className="scan-detail-screen"
          contentInsetAdjustmentBehavior={isDraft ? "never" : "automatic"}
          contentContainerStyle={{
            paddingTop: 24 + (isDraft ? insets.top : 0),
            // Drafts have no native header, so apply their safe area explicitly.
            paddingBottom: 24 + (!isDraft && Platform.OS !== "ios" ? insets.bottom : 0),
            paddingLeft: 24 + (isDraft || Platform.OS !== "ios" ? insets.left : 0),
            paddingRight: 24 + (isDraft || Platform.OS !== "ios" ? insets.right : 0),
            gap: 24,
          }}
        >
          {isLoading ? (
            <ActivityIndicator accessibilityLabel={t("detail.loading")} />
          ) : scan ? (
            <>
              <View className="scan-detail-card">
                <Text className="scan-detail-label">{t("detail.content")}</Text>
                <Text selectable className="scan-detail-value">{scan.value}</Text>
                <Text className="scan-detail-label">{t("detail.format")}</Text>
                <Text className="scan-detail-value">{scan.type}</Text>
                <Text className="scan-detail-label">{t("detail.scannedAt")}</Text>
                <Text className="scan-detail-value">
                  {scan.scannedAt.toLocaleString(languageTag, {
                    hour12: uses24hourClock == null ? undefined : !uses24hourClock,
                  })}
                </Text>
              </View>
              {isDraft && (
                <>
                  <Text className="scan-detail-label">
                    {t("detail.notSaved")}
                  </Text>
                </>
              )}
            </>
          ) : (
            <>
              <Text accessibilityRole="alert" className="scan-detail-value">
                {isDraft
                  ? t("detail.invalidScan")
                  : savedResult?.error ? t("detail.loadError") : t("detail.notFound")}
              </Text>
              <Button title={t("common.goBack")} onPress={closeDetails} />
            </>
          )}
        </ScrollView>
        {scan && (
          <View
            className="scan-detail-actions"
            style={{
              paddingTop: 16,
              paddingBottom: 16,
              paddingLeft: insets.left + 24,
              paddingRight: insets.right + 24,
            }}
          >
            {isDraft ? (
              <ScanDraftActions onSave={handleSaveScan} onDiscard={closeDetails} />
            ) : (
              <DeleteScanButton onDelete={handleDeleteScan} />
            )}
          </View>
        )}
      </View>
    </>
  );
}
