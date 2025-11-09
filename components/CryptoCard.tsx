import { Card } from "@/components/ui/card";
import { clsx as cn } from "clsx";
import { useRouter } from "expo-router";
import { Heart } from "lucide-react-native";
import { Image, Pressable, Text, View } from "react-native";

type Coin = {
  id: string;
  price_change_percentage_24h: number;
  image: string;
  name: string;
  symbol: string;
  current_price: number;
  total_volume: number;
};

interface CryptoCardProps {
  coin: Coin;
  isFavorite: boolean;
  onToggleFavorite: (coinId: string) => void;
}

export const CryptoCard = ({
  coin,
  isFavorite,
  onToggleFavorite,
}: CryptoCardProps) => {
  const router = useRouter();
  const isPositive = coin.price_change_percentage_24h > 0;

  return (
    <Card className="glass-card p-4 cursor-pointer hover:scale-[1.02] transition-all duration-300 hover:shadow-[0_0_30px_hsl(193_95%_55%_/_0.3)]">
      <Pressable onPress={() => router.navigate(`/coin/${coin.id}`)}>
        <View className="flex items-center justify-between mb-3">
          <View className="flex items-center gap-3">
            <Image
              source={{ uri: coin.image }}
              alt={coin.name}
              className="w-10 h-10"
            />
            <View>
              <Text className="font-semibold text-foreground">{coin.name}</Text>
              <Text className="text-sm text-muted-foreground uppercase">
                {coin.symbol}
              </Text>
            </View>
          </View>
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              onToggleFavorite(coin.id);
            }}
            className="p-2 hover:scale-110 transition-transform"
          >
            <Heart
              className={cn(
                "w-5 h-5",
                isFavorite
                  ? "fill-destructive text-destructive"
                  : "text-muted-foreground"
              )}
            />
          </Pressable>
        </View>
        <View className="flex items-end justify-between">
          <View>
            <Text className="text-2xl font-bold text-foreground">
              $
              {coin.current_price.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
            <p className="text-xs text-muted-foreground">
              Vol: ${(coin.total_volume / 1e9).toFixed(2)}B
            </p>
          </View>
          <View
            className={cn(
              "px-3 py-1 rounded-full text-sm font-semibold",
              isPositive
                ? "bg-success/20 text-success"
                : "bg-destructive/20 text-destructive"
            )}
          >
            {isPositive ? "+" : ""}
            {coin.price_change_percentage_24h.toFixed(2)}%
          </View>
        </View>
      </Pressable>
    </Card>
  );
};
