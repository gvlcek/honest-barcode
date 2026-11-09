import { useEffect } from "react";
import "../../global.css";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import { useColorScheme } from "react-native";
import { useFonts } from "expo-font";
import { SQLiteProvider } from "expo-sqlite";
import { initializeDatabase } from "@/database/database";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n";
import { useDeviceLanguage } from "@/hooks/useDeviceLanguage";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  useDeviceLanguage();
  const colorScheme = useColorScheme();
  const [fontsLoaded, fontError] = useFonts({
    "sans-bold": require("../../assets/fonts/PlusJakartaSans-Bold.ttf"),
    "sans-extrabold": require("../../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
    "sans-light": require("../../assets/fonts/PlusJakartaSans-Light.ttf"),
    "sans-medium": require("../../assets/fonts/PlusJakartaSans-Medium.ttf"),
    "sans-regular": require("../../assets/fonts/PlusJakartaSans-Regular.ttf"),
    "sans-semibold": require("../../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
  });

  useEffect(() => {
    if (fontError) {
      throw fontError;
    }
  }, [fontError]);

  if (!fontsLoaded) {
    return null; // or a loading indicator
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <I18nextProvider i18n={i18n}>
        <SQLiteProvider
          databaseName="honest-barcode.db"
          onInit={initializeDatabase}
        >
          <Stack>
            <Stack.Screen
              name="(tabs)"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="scanner"
              options={{ presentation: "fullScreenModal", headerShown: false }}
            />
          </Stack>
        </SQLiteProvider>
      </I18nextProvider>
    </ThemeProvider>
  );
}
