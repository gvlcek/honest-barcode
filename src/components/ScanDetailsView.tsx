import { useState, type ReactNode } from "react";
import { ActivityIndicator, Alert, Button, Platform, Pressable, ScrollView, Text, View, useColorScheme } from "react-native";
import * as Clipboard from "expo-clipboard";
import { Link } from "expo-router";
import { Ionicons } from "@react-native-vector-icons/ionicons";
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
  const colorScheme = useColorScheme();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const insets = useSafeAreaInsets();
  const { languageTag } = resolveLocale(useLocales());
  const uses24hourClock = useCalendars()[0]?.uses24hourClock;
  const usesFloatingTabs = !isDraft && Platform.OS === "ios";
  const googleSearchUrl: `https://${string}` | null = scan?.value.trim()
    ? `https://www.google.com/search?q=${encodeURIComponent(scan.value)}`
    : null;

  const copyCode = async (code: string) => {
    try {
      if (await Clipboard.setStringAsync(code)) {
        setCopiedCode(code);
        return;
      }
    } catch {
      // The clipboard may be unavailable on this device or browser.
    }
    setCopiedCode(null);
    Alert.alert(t("detail.copyError"));
  };

  return (
    <View className="flex-1 bg-accent">
      <View
        className="section-header flex-row items-center gap-3"
        style={{
          paddingTop: insets.top + 24,
          paddingLeft: insets.left + 24,
          paddingRight: insets.right + 24,
        }}
      >
        {!isDraft && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t("common.goBack")}
            onPress={onGoBack}
            hitSlop={8}
            className="active:opacity-70"
          >
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </Pressable>
        )}
        <Text accessibilityRole="header" className="section-header-title flex-1">
          {t("detail.result")}
        </Text>
      </View>
      <View className="section-body">
        <ScrollView
          className="flex-1"
          contentInsetAdjustmentBehavior={usesFloatingTabs ? "automatic" : "never"}
          contentContainerStyle={{
            paddingTop: 24,
            paddingBottom: 24 + (isDraft && !actions ? insets.bottom : 0),
            paddingLeft: 24 + insets.left,
            paddingRight: 24 + insets.right,
            gap: 24,
          }}
        >
          {isLoading ? (
            <ActivityIndicator accessibilityLabel={t("detail.loading")} />
          ) : scan ? (
            <>
              <View className="scan-detail-card">
                <Text className="scan-detail-label">{t("detail.code")}</Text>
                <View className="flex-row items-center gap-3">
                  <Text selectable className="scan-detail-value flex-1">{scan.value}</Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={t(copiedCode === scan.value ? "detail.codeCopied" : "detail.copyCode")}
                    onPress={() => void copyCode(scan.value)}
                    style={{ width: 44, height: 44 }}
                    className="items-center justify-center rounded-xl bg-muted active:opacity-70"
                  >
                    <Ionicons
                      name={copiedCode === scan.value ? "checkmark" : "copy-outline"}
                      size={20}
                      color={colorScheme === "dark" ? "#f5f5f7" : "#1c1c1e"}
                    />
                  </Pressable>
                </View>
                <Text className="scan-detail-label">{t("detail.format")}</Text>
                <Text className="scan-detail-value">{scan.type}</Text>
                <Text className="scan-detail-label">{t("detail.scannedAt")}</Text>
                <Text className="scan-detail-value">
                  {scan.scannedAt.toLocaleString(languageTag, {
                    hour12: uses24hourClock == null ? undefined : !uses24hourClock,
                  })}
                </Text>
              </View>
              {googleSearchUrl && (
                <Link href={googleSearchUrl} asChild>
                  <Pressable accessibilityRole="link" className="items-center rounded-xl bg-card px-4 py-3 active:opacity-70">
                    <Text className="font-sans-semibold text-base text-foreground">
                      {t("detail.searchGoogle")}
                    </Text>
                  </Pressable>
                </Link>
              )}
              {isDraft && (
                <Text className="scan-detail-label">{t("detail.notSaved")}</Text>
              )}
              {usesFloatingTabs && actions}
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
        {scan && actions && !usesFloatingTabs && (
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
    </View>
  );
}
