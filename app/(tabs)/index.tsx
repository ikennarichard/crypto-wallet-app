import { CryptoCard } from "@/components/CryptoCard";
import LoadingState from "@/components/LoadingState";
import ProfileHeader from "@/components/ProfileHeader";
import Searchbar from "@/components/Searchbar";
import { getCoins } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo, useState } from "react";
import { Animated, RefreshControl, StyleSheet, Text, View } from "react-native";

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = new Animated.Value(0);

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

  const filteredCoins = useMemo(() => {
    if (!coins) return [];

    let filtered = coins;

    if (searchQuery) {
      filtered = filtered.filter(
        (coin) =>
          coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [coins, searchQuery]);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.95],
    extrapolate: "clamp",
  });

  return (
    <View className="flex-1 bg-background">
      <LinearGradient
        colors={["#1A5D4D", "#0B2520", "#000000"]}
        start={{ x: 0.4, y: -0.5 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <View className="absolute inset-0 overflow-hidden">
        <View className="absolute top-20 -right-20 w-80 h-80 bg-green-200/10 blur-3xl opacity-20" />
        <View className="absolute -bottom-20 -left-20 w-96 h-96 bg-green-200/10 blur-3xl opacity-30" />
      </View>

      <ProfileHeader />

      <Animated.View
        style={{ opacity: headerOpacity }}
        className="relative z-10 pt-12 pb-4 px-4"
      >
        <Searchbar value={searchQuery} onChange={setSearchQuery} />
      </Animated.View>

      {isLoading ? (
        <LoadingState />
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
              tintColor="#22d3ee"
              colors={["#22d3ee"]}
            />
          }
        >
          <View className="mb-6">
            <View className="flex-row items-center mb-3 justify-between">
              <Text className="text-lg text-white">All Tokens</Text>
              <Text className="text-sm text-white">Price</Text>
            </View>
            <View className="space-y-3 gap-5">
              {filteredCoins.map((coin, index) => (
                <Animated.View
                  key={coin.id}
                  style={{
                    opacity: 1,
                    transform: [
                      {
                        translateY: 0,
                      },
                    ],
                  }}
                >
                  <CryptoCard coin={coin} />
                </Animated.View>
              ))}
            </View>
          </View>

          {/* Empty State */}
          {filteredCoins.length === 0 && (
            <View className="items-center justify-center py-3">
              <Text className="text-xl font-semibold text-white mb-2">
                No coins found
              </Text>
              <Text className="text-gray-400 text-center px-8">
                Try adjusting your search query to find what you&apos;re looking
                for
              </Text>
            </View>
          )}
        </Animated.ScrollView>
      )}
    </View>
  );
}
