import { Text, View } from "react-native";

export default function ScannerGuide() {
  return (
    <View className="scanner-guide" pointerEvents="none">
      <View className="scanner-guide-frame" accessible={false}>
        <View className="scanner-guide-corner scanner-guide-top-left" />
        <View className="scanner-guide-corner scanner-guide-top-right" />
        <View className="scanner-guide-corner scanner-guide-bottom-left" />
        <View className="scanner-guide-corner scanner-guide-bottom-right" />
      </View>
      <Text className="scanner-guide-hint">
        Position a barcode or QR code inside the frame
      </Text>
    </View>
  );
}
