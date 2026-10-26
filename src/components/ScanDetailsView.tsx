import type { ReactNode } from "react";
import { ActivityIndicator, Button, Platform, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useCalendars, useLocales } from "expo-localization";
import { resolveLocale } from "@/i18n/locale";
import type { Scan } from "@/models/Scan";

interface ScanDetailsViewProps {
  scan: Scan | null;
  isDraft?: boolean;
  isLoading?: boolean;
  errorMessage?: string;
  onGoBack: () => void;
  actions?: ReactNode;
}

export default function ScanDetailsView({
  scan,
  isDraft = false,
  isLoading = false,
  errorMessage,
  onGoBack,
  actions,
}: ScanDetailsViewProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { languageTag } = resolveLocale(useLocales());
  const uses24hourClock = useCalendars()[0]?.uses24hourClock;

  return (
    <View className="scan-detail-screen">
      <ScrollView
        className="scan-detail-screen"
        contentInsetAdjustmentBehavior={isDraft ? "never" : "automatic"}
        contentContainerStyle={{
          paddingTop: 24 + (isDraft ? insets.top : 0),
          paddingBottom: 24 + (isDraft && !actions ? insets.bottom : 0),
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
              <Text className="scan-detail-label">{t("detail.notSaved")}</Text>
            )}
          </>
        ) : (
          <>
            <Text accessibilityRole="alert" className="scan-detail-value">
              {errorMessage ?? t("detail.notFound")}
            </Text>
            <Button title={t("common.goBack")} onPress={onGoBack} />
          </>
        )}
      </ScrollView>
      {scan && actions && (
        <View
          className="scan-detail-actions"
          style={{
            paddingTop: 16,
            // The full-screen modal has no tab bar to cover the bottom safe area.
            paddingBottom: 16 + (isDraft ? insets.bottom : 0),
            paddingLeft: insets.left + 24,
            paddingRight: insets.right + 24,
          }}
        >
          {actions}
        </View>
      )}
    </View>
  );
}
