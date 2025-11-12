import { CryptoCard } from "@/components/CryptoCard";
import LoadingState from "@/components/LoadingState";
import { useFavorites } from "@/context/FavortesContext";
import { getCoins } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Heart, TrendingDown, TrendingUp } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  Animated,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function Favorites() {
  const [refreshing, setRefreshing] = useState(false);
  const { favorites, toggleFavorite } = useFavorites();
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const router = useRouter();

  const {
    data: coins,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["coins"],
    queryFn: getCoins,
    refetchInterval: 30000,
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const favoriteCoins = useMemo(() => {
    if (!coins) return [];
    return coins.filter((coin) => favorites.includes(coin.id));
  }, [coins, favorites]);

  // Calculate portfolio stats
  const portfolioStats = useMemo(() => {
    if (favoriteCoins.length === 0) {
      return {
        totalValue: 0,
        avgChange: 0,
        positiveCount: 0,
        negativeCount: 0,
      };
    }

    const totalChange = favoriteCoins.reduce(
      (sum, coin) => sum + coin.price_change_percentage_24h,
      0
    );
    const avgChange = totalChange / favoriteCoins.length;
    const positiveCount = favoriteCoins.filter(
      (coin) => coin.price_change_percentage_24h > 0
    ).length;
    const negativeCount = favoriteCoins.length - positiveCount;

    return {
      totalValue: favoriteCoins.reduce(
        (sum, coin) => sum + coin.current_price,
        0
      ),
      avgChange,
      positiveCount,
      negativeCount,
    };
  }, [favoriteCoins]);

  // Header animation
  const headerScale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.95],
    extrapolate: "clamp",
  });

  return (
    <View className="flex-1 bg-black">
      <LinearGradient
        colors={["#1A5D4D", "#000000", "#000000"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <Animated.View
        style={{ transform: [{ scale: headerScale }] }}
        className="relative z-10 pt-12 pb-4 px-4"
      >
        <View className="mb-6">
          <View className="flex-row items-center mb-2">
            <Text className="text-3xl font-bold text-white">Favorites</Text>
          </View>
          <Text className="text-gray-400 text-base">
            {favoriteCoins.length > 0
              ? `Tracking ${favoriteCoins.length} ${
                  favoriteCoins.length === 1 ? "coin" : "coins"
                }`
              : "No favorites yet"}
          </Text>
        </View>

        {favoriteCoins.length > 0 ? (
          <View className="mb-6">
            <View className="relative overflow-hidden rounded-2xl mb-3">
              <View className="bg-black/30 backdrop-blur-xl p-6 border border-gray-700/50">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-gray-400 text-sm">
                    Average 24h Change
                  </Text>
                </View>
                <Text
                  className={`text-4xl font-bold ${
                    portfolioStats.avgChange >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {portfolioStats.avgChange >= 0 ? "+" : ""}
                  {portfolioStats.avgChange.toFixed(2)}%
                </Text>
              </View>
            </View>

              <Text className="text-white mb-3">Token Trends</Text>
            <View className="flex-row gap-3">
              <View className="flex-1 bg-gray-900/60 backdrop-blur-xl p-4 rounded-2xl border border-gray-700/50">
                <View className="flex-row items-center mb-2">
                  <TrendingUp size={16} color="green" />
                </View>
                <Text className="text-white font-bold text-2xl">
                  {portfolioStats.positiveCount}
                </Text>
              </View>

              <View className="flex-1 bg-gray-900/60 backdrop-blur-xl p-4 rounded-2xl border border-gray-700/50">
                <View className="flex-row items-center mb-2">
                  <TrendingDown size={16} color="red" />
                </View>
                <Text className="text-white font-bold text-2xl">
                  {portfolioStats.negativeCount}
                </Text>
              </View>
            </View>
          </View>
        ) : null}
      </Animated.View>

      {isLoading ? (
        <LoadingState />
      ) : favoriteCoins.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <View className="relative mb-8">
            <View className="absolute inset-0 bg-pink-500/20 blur-3xl rounded-full scale-150" />
            <View className="relative w-32 h-32 bg-gray-800/50 rounded-full items-center justify-center border-2 border-gray-700/50">
              <Heart className="w-16 h-16 text-gray-600" />
            </View>
          </View>

          <Text className="text-2xl font-bold text-white mb-3 text-center">
            No Favorites Yet
          </Text>
          <Text className="text-gray-400 text-center mb-8 leading-6">
            Start adding coins to your favorites by tapping the heart icon on
            any coin card
          </Text>

          <Pressable
            onPress={() => router.push("/")}
            className="bg-gradient-to-r from-pink-500 to-purple-500 px-8 py-4 rounded-full"
          >
            <View className="flex-row items-center">
              <Text className="text-white font-bold text-lg">
                Explore Coins
              </Text>
            </View>
          </Pressable>
        </View>
      ) : (
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1 px-4"
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#ec4899"
              colors={["#ec4899"]}
            />
          }
        >
          <View className="space-y-3 mb-6 gap-3">
            {favoriteCoins.map((coin) => (
              <Animated.View
                key={coin.id}
                style={{
                  opacity: 1,
                  transform: [{ translateY: 0 }],
                }}
              >
                <CryptoCard
                  coin={coin}
                  isFavorite={true}
                  onToggleFavorite={toggleFavorite}
                />
              </Animated.View>
            ))}
          </View>

          <View className="h-8" />
        </Animated.ScrollView>
      )}
    </View>
  );
}
