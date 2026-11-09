import { router, Tabs } from "expo-router";
import { NativeTabs } from "expo-router/native-tabs";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { Platform } from "react-native";
import { useTranslation } from "react-i18next";

export const unstable_settings = {
  anchor: "(home)",
};

export default function TabsLayout() {
  const { t } = useTranslation();

  if (Platform.OS === "ios") {
    return (
      <NativeTabs backBehavior="initialRoute">
        <NativeTabs.Trigger name="(home)">
          <NativeTabs.Trigger.Label>{t("tabs.history")}</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf="books.vertical" />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger
          name="new-scan"
          disabled
          listeners={{ tabPress: () => router.push("/scanner") }}
        >
          <NativeTabs.Trigger.Label>{t("tabs.scan")}</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf="barcode" />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="about">
          <NativeTabs.Trigger.Label>{t("tabs.about")}</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf="info.circle" />
        </NativeTabs.Trigger>
      </NativeTabs>
    );
  }

  return (
    <Tabs backBehavior="initialRoute">
      <Tabs.Screen name="(home)" options={{
        title: t("tabs.history"),
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="library-outline" size={size} color={color} />
          ),
        headerShown: false
      }} />
      <Tabs.Screen name="new-scan" options={{
        title: t("tabs.scan"),
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="barcode-outline" size={size} color={color} />
        ),
      }} listeners={{
        tabPress: (event) => {
          event.preventDefault();
          router.push("/scanner");
        },
      }} />
      <Tabs.Screen name="about" options={{
        title: t("tabs.about"),
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="information-circle-outline" size={size} color={color} />
        )
      }} />
    </Tabs>
  );
}
