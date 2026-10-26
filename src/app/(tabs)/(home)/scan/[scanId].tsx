import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useTranslation } from "react-i18next";
import type { Scan } from "@/models/Scan";
import ScanDetailsView from "@/components/ScanDetailsView";
import DeleteScanButton from "@/components/DeleteScanButton";
import { deleteScan, getScan } from "@/repositories/scanRepository";

export default function ScanDetailScreen() {
  const { t } = useTranslation();
  const database = useSQLiteContext();
  const { scanId } = useLocalSearchParams<{ scanId: string }>();
  const [savedResult, setSavedResult] = useState<{
    id: string;
    scan: Scan | null;
    error: boolean;
  } | null>(null);
  const isLoading = savedResult?.id !== scanId;
  const scan = savedResult?.id === scanId ? savedResult.scan : null;

  useEffect(() => {
    let isActive = true;

    const loadScan = async () => {
      try {
        const savedScan = await getScan(database, scanId);
        if (isActive) setSavedResult({ id: scanId, scan: savedScan, error: false });
      } catch {
        if (isActive) setSavedResult({ id: scanId, scan: null, error: true });
      }
    };

    void loadScan();
    return () => { isActive = false; };
  }, [database, scanId]);

  const closeDetails = () => {
    router.dismissTo("/");
  };

  const handleDeleteScan = async () => {
    if (!scan) return;

    await deleteScan(database, scan.scannedAt.toISOString());
    router.dismissTo("/");
  };

  return (
    <ScanDetailsView
      scan={scan}
      isLoading={isLoading}
      errorMessage={savedResult?.error ? t("detail.loadError") : t("detail.notFound")}
      onGoBack={closeDetails}
      actions={scan ? <DeleteScanButton onDelete={handleDeleteScan} /> : undefined}
    />
  );
}
