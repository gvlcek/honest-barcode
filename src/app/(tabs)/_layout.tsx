import { router, Tabs } from "expo-router";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { useTranslation } from "react-i18next";

export const unstable_settings = {
  anchor: "(home)",
};

export default function TabsLayout() {
  const { t } = useTranslation();
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
