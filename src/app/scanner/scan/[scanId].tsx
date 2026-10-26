import { router, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useTranslation } from "react-i18next";
import ScanDetailsView from "@/components/ScanDetailsView";
import ScanDraftActions from "@/components/ScanDraftActions";
import type { Scan } from "@/models/Scan";
import { saveScan } from "@/repositories/scanRepository";

export default function NewScanDetailScreen() {
  const { t } = useTranslation();
  const database = useSQLiteContext();
  const { scanId, value, barcodeType } = useLocalSearchParams<{
    scanId: string;
    value?: string;
    barcodeType?: string;
  }>();
  const scannedAt = typeof scanId === "string" ? new Date(scanId) : null;
  const scan: Scan | null =
    scannedAt && !Number.isNaN(scannedAt.getTime()) &&
    typeof value === "string" && typeof barcodeType === "string"
      ? { value, type: barcodeType, scannedAt }
      : null;

  const returnToScanner = () => {
    router.dismissTo("/scanner");
  };

  const handleSave = async () => {
    if (!scan) return;

    await saveScan(database, scan);
    // Dismiss the entire scanner stack and select the home/history tab.
    router.dismissTo("/");
  };

  return (
    <ScanDetailsView
      scan={scan}
      isDraft
      errorMessage={t("detail.invalidScan")}
      onGoBack={returnToScanner}
      actions={scan ? (
        <ScanDraftActions onSave={handleSave} onDiscard={returnToScanner} />
      ) : undefined}
    />
  );
}
