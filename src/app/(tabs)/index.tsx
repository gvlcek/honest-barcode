import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";

export default function App() {
  const insets = useSafeAreaInsets();

  return (
    <View className="scan-screen">
      <View
        className="scan-header"
        style={{
          paddingTop: insets.top + 32,
          paddingLeft: insets.left + 24,
          paddingRight: insets.right + 24,
        }}
      >
        <View
          className="scan-logo-placeholder"
          accessible={false}
        />
        <View className="scan-header-copy">
          <Text className="scan-greeting">Welcome to</Text>
          <Text className="scan-title">HonestBarcode</Text>
        </View>
      </View>

      <View className="scan-body">
        <Pressable
          className="scan-button"
          accessibilityRole="button"
          style={({ pressed }) => ({ opacity: pressed ? 0.75 : 1 })}
          onPress={() => router.push("/scanner")}
        >
          <Text className="scan-button-label">Start scanning</Text>
        </Pressable>
      </View>
    </View>
  );
}
