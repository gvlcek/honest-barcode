import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";
import { Link, useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import type { Scan } from "@/models/Scan";
import { deleteScan, getScans } from "@/repositories/scanRepository";
import { useTranslation } from "react-i18next";
import { useCalendars, useLocales } from "expo-localization";
import { resolveLocale } from "@/i18n/locale";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { useDeleteScanConfirmation } from "@/hooks/useDeleteScanConfirmation";

interface ScanHistoryRowProps {
  scanId: string;
  date: string;
  onDelete: () => Promise<void>;
}

function ScanHistoryRow({ scanId, date, onDelete }: ScanHistoryRowProps) {
  const { t } = useTranslation();
  const { confirmDelete, isDeleting, error } = useDeleteScanConfirmation(onDelete);

  return (
    <View>
      <Swipeable
        overshootRight={false}
        containerStyle={{ borderRadius: 12 }}
        renderRightActions={() => (
          <Pressable
            accessibilityRole="button"
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            disabled={isDeleting}
            onPress={confirmDelete}
            className="min-w-24 items-center justify-center bg-destructive px-4 active:opacity-75"
          >
            <Text className="font-sans-semibold text-white">
              {t(isDeleting ? "common.deleting" : "common.delete")}
            </Text>
          </Pressable>
        )}
      >
        <Link
          href={{ pathname: "/scan/[scanId]", params: { scanId } }}
          asChild
          withAnchor
        >
          <Pressable
            accessibilityRole="link"
            accessibilityActions={[{ name: "delete", label: t("common.delete") }]}
            onAccessibilityAction={({ nativeEvent }) => {
              if (nativeEvent.actionName === "delete") confirmDelete();
            }}
            className="bg-card active:bg-muted"
          >
            <Text className="history-date">{date}</Text>
          </Pressable>
        </Link>
      </Swipeable>
      {error && (
        <Text accessibilityRole="alert" className="scanner-permission-error mt-2">
          {t("detail.deleteError")}
        </Text>
      )}
    </View>
  );
}

export default function ScanHistoryList() {
  const { t } = useTranslation();
  const { languageTag } = resolveLocale(useLocales());
  const uses24hourClock = useCalendars()[0]?.uses24hourClock;
  const dateFormatter = useMemo(() => new Intl.DateTimeFormat(languageTag, {
    dateStyle: "medium",
    timeStyle: "medium",
    hour12: uses24hourClock == null ? undefined : !uses24hourClock,
  }), [languageTag, uses24hourClock]);
  const database = useSQLiteContext();
  const [scans, setScans] = useState<Scan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useFocusEffect(useCallback(() => {
    let isActive = true;
    setIsLoading(true);
    setError(false);

    const loadScans = async () => {
      try {
        const savedScans = await getScans(database);
        if (isActive) setScans(savedScans);
      } catch {
        if (isActive) {
          setScans([]);
          setError(true);
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    void loadScans();
    return () => { isActive = false; };
  }, [database]));

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <FlatList
        className="history-screen"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ padding: 24, gap: 12 }}
        data={scans}
        keyExtractor={(scan) => scan.scannedAt.toISOString()}
        renderItem={({ item }) => {
          const scanId = item.scannedAt.toISOString();
          return (
            <ScanHistoryRow
              scanId={scanId}
              date={dateFormatter.format(item.scannedAt)}
              onDelete={async () => {
                await deleteScan(database, scanId);
                setScans((current) => current.filter((scan) => scan.scannedAt.toISOString() !== scanId));
              }}
            />
          );
        }}
        ListEmptyComponent={isLoading ? (
          <ActivityIndicator accessibilityLabel={t("history.loading")} />
        ) : error ? (
          <Text accessibilityRole="alert" className="scanner-permission-error">
            {t("history.loadError")}
          </Text>
        ) : (
          <Text className="scan-detail-label text-center">{t("history.empty")}</Text>
        )}
      />
    </GestureHandlerRootView>
  );
}
