import { Button, Text, View } from "react-native";
import { router, Stack } from "expo-router";

const ScannerScreen = () => {
  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Button title="Close" onPress={() => router.back()} />
          ),
        }}
      />
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Scanner</Text>
      </View>
    </>
  )
}

export default ScannerScreen
