import { formatNumber } from "@/lib/utils";
import { Coin } from "@/types";
import { clsx as cn } from "clsx";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Animated, Image, Pressable, Text, View } from "react-native";

interface CryptoCardProps {
  coin: Coin;
}

export const CryptoCard = ({ coin }: CryptoCardProps) => {
  const router = useRouter();
  const isPositive = coin.price_change_percentage_24h > 0;
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      friction: 8,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
    }).start();
  };

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
        backgroundColor: "rgba(255,255,255,0.1)",
        borderRadius: 8,
        padding: 8,
      }}
    >
      <Pressable
        onPress={() => router.push(`detail/${coin.id}`)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        className="relative overflow-hidden rounded-2xl"
      >
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center flex-1">
            <View className="relative mr-3">
              <View className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full" />
              <View className="relative w-12 h-12 bg-gray-800 rounded-full items-center justify-center border border-gray-700">
                <Image
                  source={{ uri: coin.image }}
                  alt={coin.name}
                  className="w-10 h-10 rounded-full"
                />
              </View>
            </View>

            <View className="flex-1">
              <Text className="font-bold text-white text-lg" numberOfLines={1}>
                {coin.name}
              </Text>
              <Text style={{ color: "white" }} className="text-sm uppercase">
                {coin.symbol}
              </Text>
            </View>
          </View>

          <View className="gap-2">
            <View>
              <Text
                className="text-md text-end text-white"
                style={{ marginLeft: "auto" }}
              >
                {formatNumber(coin.current_price)}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Text
                style={{ marginLeft: "auto" }}
                className={cn(
                  "text-sm",
                  isPositive ? "text-green-400" : "text-red-500"
                )}
              >
                {isPositive ? "+" : ""}
                {coin.price_change_percentage_24h.toFixed(2)}%
              </Text>
            </View>
          </View>
        </View>

        <View className="space-y-3">
          <View className="absolute inset-0 pointer-events-none">
            <LinearGradient
              colors={["transparent", "rgba(255,255,255,0.05)", "transparent"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="absolute inset-0 opacity-0"
            />
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};
