import CryptoPriceTrendChart from "@/components/CryptoPriceTrencdChart";
import { ErrorState } from "@/components/ErrorState";
import FavoriteButton from "@/components/FavoriteButton";
import LoadingState from "@/components/LoadingState";
import { palette } from "@/constants/colors";
import { useFavorites } from "@/context/FavortesContext";
import { getCoinDetail } from "@/lib/api";
import { formatNumber } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { clsx as cn } from "clsx";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Activity, Award, TrendingDown, TrendingUp } from "lucide-react-native";
import React from "react";
import {
  Animated,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CoinDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const { isFavorite, toggleFavorite } = useFavorites();

  const {
    data: coin,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["coinDetail", id],
    queryFn: () => getCoinDetail(id!),
    enabled: !!id,
    refetchInterval: 60000,
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const handleFavoritePress = () => {
    toggleFavorite(id);
  };

  const headerScale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: "clamp",
  });

  if (isError) {
    return (
      <View className="flex-1 bg-black">
        <View className="flex-1 justify-center p-4">
          <ErrorState
            message={
              error instanceof Error
                ? error.message
                : "Failed to load coin details"
            }
            onRetry={refetch}
          />
        </View>
      </View>
    );
  }

  if (isLoading) {
    return <LoadingState />;
  }

  if (!coin) return null;

  const isPositive = coin.price_change_percentage_24h > 0;

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginHorizontal: 12,
          marginTop: 15,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          className="flex-row items-center bg-gray-900/80 backdrop-blur-xl px-4 py-3 rounded-full border border-gray-700/50"
        >
          <Text className="text-white font-semibold">Back</Text>
        </Pressable>

        <FavoriteButton
          item={coin}
          isFavorite={isFavorite(id)}
          onToggleFavorite={handleFavoritePress}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <Animated.View
          style={{
            opacity: headerOpacity,
            transform: [{ scale: headerScale }],
          }}
          className="pt10 pb-8 px-4"
        >
          <View className="items-center mb-6">
            <View className="relative mb-4">
              <View className="absolute inset-0 blur-3xl rounded-full scale-150" />
              <View className="relative w-24 h-24 bg-gray-800 rounded-full items-center justify-center border-2 border-gray-700">
                <Image
                  source={{ uri: coin.image.large }}
                  alt={coin.name}
                  className="w-20 h-20 rounded-full"
                />
              </View>
            </View>

            <View className="">
              <Text className="text-3xl font-bold text-white mb-1">
                {coin.name}
              </Text>
            </View>
            <Text className="text-gray-400 text-lg uppercase">
              {coin.symbol}
            </Text>

            <View
              className="flex-row items-baseline self-start gap-1"
              style={{ marginInline: "auto" }}
            >
              <Text className="text-2xl font-bold text-white">
                {formatNumber(coin.market_data.current_price.usd)}
              </Text>
              <View className="flex-row">
                <Text
                  className={cn(
                    "text-xs font-light",
                    isPositive ? "text-green-400" : "text-red-400"
                  )}
                >
                  {isPositive ? "+" : ""}
                  {coin.market_data.price_change_percentage_24h}%
                </Text>
                {isPositive ? (
                  <TrendingUp className="mr-2" size={10} color={palette.lime} />
                ) : (
                  <TrendingDown className="mr-2" size={10} color="tomato" />
                )}
              </View>
            </View>
          </View>

          <CryptoPriceTrendChart coinId={coin.id} />

          <View
            className="flex-row flex-wrap gap-3 mb-6"
            style={{ marginBlockStart: 12 }}
          >
            <View className="flex-1 min-w-[45%] bg-gray-900/60 backdrop-blur-xl p-4 rounded-2xl border border-gray-700/50">
              <Text className="text-gray-400 text-xs mb-1">Market Cap</Text>
              <Text className="text-white font-bold text-lg">
                ${formatNumber(coin.market_data.market_cap.usd, 1)}
              </Text>
            </View>

            <View className="flex-1 min-w-[45%] bg-gray-900/60 backdrop-blur-xl p-4 rounded-2xl border border-gray-700/50">
              <Text className="text-gray-400 text-xs mb-1">24h Volume</Text>
              <Text className="text-white font-bold text-lg">
                ${formatNumber(coin.market_data.total_volume.usd, 1)}
              </Text>
            </View>

            <View className="flex-1 min-w-[45%] bg-gray-900/60 backdrop-blur-xl p-4 rounded-2xl border border-gray-700/50">
              <Text className="text-gray-400 text-xs mb-1">24h High</Text>
              <Text className="text-green-400 font-bold text-lg">
                {formatNumber(coin.market_data.high_24h.usd)}
              </Text>
            </View>

            <View className="flex-1 min-w-[45%] bg-gray-900/60 backdrop-blur-xl p-4 rounded-2xl border border-gray-700/50">
              <Text className="text-gray-400 text-xs mb-1">24h Low</Text>
              <Text className="text-red-400 font-bold text-lg">
                {formatNumber(coin.market_data.low_24h.usd)}
              </Text>
            </View>
          </View>
        </Animated.View>

        <View className="px-4 mb-6">
          <View className="flex-row items-center mb-3">
            <View
              className="w-1 h-6 rounded-full"
              style={{ backgroundColor: palette.lime }}
            />
            <Activity
              className="w-5 h-5"
              color={palette.lime}
              // style={{ backgroundColor: pallete.lime }}
            />
            <Text
              className="text-xl font-bold text-white"
              style={{ marginLeft: 8 }}
            >
              Market Stats
            </Text>
          </View>

          <View className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden">
            <View className="flex-row border-b border-gray-700/50 p-4">
              <View className="flex-1">
                <Text className="text-gray-400 text-sm mb-1">Rank</Text>
                <View className="flex-row items-center">
                  <Award className="mr-1" size={18} color={palette.lime} />
                  <Text className="text-white font-bold text-lg">
                    #{coin.market_cap_rank}
                  </Text>
                </View>
              </View>

              <View className="flex-1">
                <Text className="text-gray-400 text-sm mb-1">
                  All-Time High
                </Text>
                <Text className="text-white font-bold text-lg">
                  {formatNumber(coin.market_data.ath.usd)}
                </Text>
              </View>
            </View>

            <View className="p-4">
              <Text className="text-gray-400 text-sm mb-1">
                Circulating Supply
              </Text>
              <Text className="text-white font-bold text-lg">
                {coin.market_data.circulating_supply
                  ? formatNumber(coin.market_data.circulating_supply, 1)
                  : "N/A"}
              </Text>
            </View>
          </View>
        </View>

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default CoinDetail;
