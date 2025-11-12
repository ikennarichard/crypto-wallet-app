import React from "react";
import { Text, View } from "react-native";

export default function LoadingState() {
  return (
    <View className="flex-1 bg-transparent">
      <View className="flex-1 justify-center items-center">
        <View className="w-16 h-16 border-4 border-gray-400 border-t-transparent rounded-full animate-spin" />
        <Text className="text-gray-400 mt-4">Loading details...</Text>
      </View>
    </View>
  );
}
