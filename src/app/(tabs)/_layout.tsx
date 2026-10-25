import { Tabs } from "expo-router";
import { Ionicons } from "@react-native-vector-icons/ionicons";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{
        title: "Scan",
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="barcode-outline" size={size} color={color} />
          ),
        headerShown: false
      }} />
      <Tabs.Screen name="history" options={{
        title: "History",
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="library-outline" size={size} color={color} />
          ),
      }} />
      <Tabs.Screen name="about" options={{
        title: "About",
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="information-circle-outline" size={size} color={color} />
        )
      }} />
    </Tabs>
  );
}
