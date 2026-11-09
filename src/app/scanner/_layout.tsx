import { Stack } from "expo-router";
import { useState, type ContextType } from "react";
import { ScanDraftContext } from "@/models/ScanDraftContext";

export const unstable_settings = {
  anchor: "index",
};

export default function ScannerLayout() {
  const [thumbnail, setThumbnail] = useState<ContextType<typeof ScanDraftContext>["thumbnail"]>(null);
  return (
    <ScanDraftContext.Provider value={{ thumbnail, setThumbnail }}>
      <Stack>
        <Stack.Screen name="index" options={{ title: "" }} />
        <Stack.Screen name="scan/[scanId]" options={{ headerShown: false }} />
      </Stack>
    </ScanDraftContext.Provider>
  );
}
