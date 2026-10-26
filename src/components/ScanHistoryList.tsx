import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text } from "react-native";
import { Link, useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import type { Scan } from "@/models/Scan";
import { getScans } from "@/repositories/scanRepository";
import { useTranslation } from "react-i18next";

export default function ScanHistoryList() {
  const { t } = useTranslation();
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
    <FlatList
      className="history-screen"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ padding: 24, gap: 12 }}
      data={scans}
      keyExtractor={(scan) => scan.scannedAt.toISOString()}
      renderItem={({ item }) => (
        <Link
          href={{
            pathname: "/scan/[scanId]",
            params: { scanId: item.scannedAt.toISOString() },
          }}
          asChild
          withAnchor
        >
          <Pressable
            accessibilityRole="link"
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <Text className="history-value">{item.value}</Text>
          </Pressable>
        </Link>
      )}
      ListEmptyComponent={isLoading ? (
        <ActivityIndicator accessibilityLabel={t("history.loading")} />
      ) : error ? (
        <Text accessibilityRole="alert" className="scanner-permission-error">
          {t("history.loadError")}
        </Text>
      ) : (
        <Text className="scan-detail-label">{t("history.empty")}</Text>
      )}
    />
  );
}
