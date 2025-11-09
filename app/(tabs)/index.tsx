import { CryptoCard } from "@/components/CryptoCard";
import Searchbar from "@/components/Searchbar";
import { useFavorites } from "@/context/FavortesContext";
import { getCoins } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { View, Text } from "react-native";

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const { favorites, toggleFavorite } = useFavorites();

  const {
    data: coins,
    isLoading,
  } = useQuery({
    queryKey: ["coins"],
    queryFn: getCoins,
    refetchInterval: 30000,
  });

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

  return (
    <View className="min-h-screen p-4 max-w-7xl mx-auto">
      <View className="space-y-6">
        <Searchbar value={searchQuery} onChange={setSearchQuery} />

        {isLoading ? (
          <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Loader2 className="h-32 bg-muted/20 animate-spin" />
          </View>
        ) : (
          <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCoins.map((coin) => (
              <CryptoCard
                key={coin.id}
                coin={coin}
                isFavorite={favorites.includes(coin.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </View>
        )}

        {!isLoading && filteredCoins.length === 0 && (
          <View className="text-center py-12">
            <Text className="text-muted-foreground">
              No coins found matching your search
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
