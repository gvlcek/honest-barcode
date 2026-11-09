import { Stack } from "expo-router";

export const unstable_settings = {
  anchor: "index",
};

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="scan/[scanId]"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
