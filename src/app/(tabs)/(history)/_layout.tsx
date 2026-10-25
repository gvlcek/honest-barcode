import { Stack } from "expo-router";

export const unstable_settings = {
  anchor: "history",
};

export default function HistoryLayout() {
  return (
    <Stack>
      <Stack.Screen name="history" options={{ title: "History" }} />
      <Stack.Screen
        name="scan/[scanId]"
        options={{ title: "", headerBackButtonDisplayMode: "minimal" }}
      />
    </Stack>
  );
}
