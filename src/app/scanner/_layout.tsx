import { Stack } from "expo-router";

export const unstable_settings = {
  anchor: "index",
};

export default function ScannerLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "" }} />
      <Stack.Screen name="scan/[scanId]" options={{ headerShown: false }} />
    </Stack>
  );
}
