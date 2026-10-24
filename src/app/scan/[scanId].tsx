import React from 'react'
import { View, Text } from 'react-native'
import { useLocalSearchParams } from "expo-router";

const ScanDetailScreen = () => {
  const { scanId } = useLocalSearchParams<{ scanId: string }>();
  
  // Render the scan details based on the scanId
    return (
        <View>
        <Text>Scan Details for ID: {scanId}</Text>
        </View>
    )
};

export default ScanDetailScreen