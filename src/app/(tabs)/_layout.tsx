import { Tabs } from "expo-router";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { useTranslation } from "react-i18next";

export default function TabsLayout() {
  const { t } = useTranslation();
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{
        title: t("tabs.scan"),
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="barcode-outline" size={size} color={color} />
          ),
        headerShown: false
      }} />
      <Tabs.Screen name="(history)" options={{
        title: t("tabs.history"),
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="library-outline" size={size} color={color} />
          ),
      }} />
      <Tabs.Screen name="about" options={{
        title: t("tabs.about"),
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="information-circle-outline" size={size} color={color} />
        )
      }} />
    </Tabs>
  );
}
