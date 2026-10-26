import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";

export const unstable_settings = {
  anchor: "history",
};

export default function HistoryLayout() {
  const { t } = useTranslation();
  return (
    <Stack>
      <Stack.Screen name="history" options={{ title: t("tabs.history") }} />
      <Stack.Screen
        name="scan/[scanId]"
        options={{ title: "", headerBackButtonDisplayMode: "minimal" }}
      />
    </Stack>
  );
}
