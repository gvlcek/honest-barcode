import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, Text } from "react-native";
import { useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import type { Scan } from "@/models/Scan";
import { getScans } from "@/repositories/scanRepository";

export default function HistoryScreen() {
  const database = useSQLiteContext();
  const [scans, setScans] = useState<Scan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(useCallback(() => {
    let isActive = true;
    setIsLoading(true);
    setError(null);

    const loadScans = async () => {
      try {
        const savedScans = await getScans(database);
        if (isActive) setScans(savedScans);
      } catch {
        if (isActive) {
          setScans([]);
          setError("Unable to load history. Please reopen this tab to try again.");
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
        <Text selectable className="history-value">{item.value}</Text>
      )}
      ListEmptyComponent={isLoading ? (
        <ActivityIndicator accessibilityLabel="Loading history" />
      ) : error ? (
        <Text accessibilityRole="alert" className="scanner-permission-error">
          {error}
        </Text>
      ) : (
        <Text className="scan-detail-label">No saved scans yet.</Text>
      )}
    />
  );
}
