import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { RefreshCw } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";

type Props = {
  coinId?: string;
  days?: number | string;
  vsCurrency?: string;
  height?: number;
};

export default function CryptoPriceTrendChart({
  coinId = "bitcoin",
  days = 7,
  vsCurrency = "usd",
  height = 220,
}: Props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [labels, setLabels] = useState<string[]>([]);
  const [dataPoints, setDataPoints] = useState<number[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(days);

  const fetchKey = `${coinId}_prices_${vsCurrency}_${selectedPeriod}`;

  const fetchData = useCallback(
    async (force = false) => {
      try {
        setError(null);
        if (!force) {
          const cached = await AsyncStorage.getItem(fetchKey);
          if (cached) {
            const parsed = JSON.parse(cached);
            if (Date.now() - parsed.fetchedAt < 1000 * 60 * 2) {
              setLabels(parsed.labels);
              setDataPoints(parsed.dataPoints);
              setLoading(false);
              return;
            }
          }
        }

        setLoading(true);
        const daysQuery =
          typeof selectedPeriod === "number"
            ? String(selectedPeriod)
            : selectedPeriod;
        const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${vsCurrency}&days=${daysQuery}&interval=hourly`;

        const resp = await axios.get(url);
        if (!resp.data) throw new Error(`CoinGecko error ${resp.status}`);
        const json = resp.data;
        if (!Array.isArray(json.prices)) throw new Error("Unexpected response");

        const prices: [number, number][] = json.prices;
        const points = prices.map((p) => Number(p[1]));
        const rawLabels = prices.map((p) => new Date(p[0]));

        const maxLabels = 6;
        const step = Math.max(1, Math.floor(points.length / maxLabels));

        const chartLabels = Array(points.length).fill("");
        rawLabels.forEach((_, idx) => {
          if (idx % step === 0)
            chartLabels[idx] = formatLabel(rawLabels[idx], selectedPeriod);
        });

        setLabels(chartLabels);
        setDataPoints(points);

        await AsyncStorage.setItem(
          fetchKey,
          JSON.stringify({
            fetchedAt: Date.now(),
            labels: chartLabels,
            dataPoints: points,
          })
        );

        setLoading(false);
      } catch (err: any) {
        setLoading(false);
        setError(err.message || "Failed to fetch data");
      }
    },
    [coinId, selectedPeriod, vsCurrency, fetchKey]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData(true);
    setRefreshing(false);
  };

  const periods = [
    { label: "1D", value: 1 },
    { label: "7D", value: 7 },
    { label: "1M", value: 30 },
    { label: "3M", value: 90 },
    { label: "1Y", value: 365 },
  ];

  if (loading) {
    return (
      <View className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6">
        <View className="items-center justify-center" style={{ height }}>
          <ActivityIndicator size="large" color="#22d3ee" />
          <Text className="text-gray-400 mt-4">Loading chart...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6">
        <View className="items-center justify-center" style={{ height }}>
          <Text className="text-red-400 text-center mb-4">Error: {error}</Text>
          <Pressable
            onPress={() => fetchData(true)}
            className="bg-cyan-500/20 px-6 py-3 rounded-full"
          >
            <Text className="text-cyan-400 font-semibold">Retry</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const screenWidth = Dimensions.get("window").width - 32;
  const isPositiveTrend =
    dataPoints.length > 1 && dataPoints[dataPoints.length - 1] > dataPoints[0];

  const chartConfig = {
    backgroundColor: "transparent",
    backgroundGradientFrom: "rgba(17, 24, 39, 0.6)",
    backgroundGradientTo: "rgba(17, 24, 39, 0.6)",
    decimalPlaces: 2,
    color: (opacity = 1) =>
      isPositiveTrend
        ? `rgba(34, 211, 238, ${opacity})`
        : `rgba(239, 68, 68, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(156, 163, 175, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "0",
    },
    propsForBackgroundLines: {
      strokeDasharray: "",
      stroke: "rgba(75, 85, 99, 0.2)",
    },
  };

  return (
    <View className="relative overflow-hidden rounded-2xl">
      {/* Gradient Border */}
      <LinearGradient
        colors={["#22d3ee", "#a855f7"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="absolute inset-0 opacity-30"
      />

      <View className="m-[1px] bg-gray-900/80 backdrop-blur-xl rounded-2xl overflow-hidden">
        <ScrollView
          horizontal={false}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#22d3ee"
              colors={["#22d3ee"]}
            />
          }
        >
          {/* Period Selector */}
          <View className="p-4 border-b border-gray-700/50">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-white font-bold text-lg">
                Price History
              </Text>
              <Pressable
                onPress={onRefresh}
                className="p-2 bg-gray-800/50 rounded-full"
              >
                <RefreshCw
                  className={`w-4 h-4 text-cyan-400 ${
                    refreshing ? "animate-spin" : ""
                  }`}
                />
              </Pressable>
            </View>

            <View className="flex-row gap-2">
              {periods.map((period) => (
                <Pressable
                  key={period.value}
                  onPress={() => setSelectedPeriod(period.value)}
                  className={`flex-1 py-2 rounded-lg ${
                    selectedPeriod === period.value
                      ? "bg-cyan-500/20 border border-cyan-500/50"
                      : "bg-gray-800/50 border border-gray-700/50"
                  }`}
                >
                  <Text
                    className={`text-center font-semibold ${
                      selectedPeriod === period.value
                        ? "text-cyan-400"
                        : "text-gray-400"
                    }`}
                  >
                    {period.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Chart */}
          <View className="p-4">
            <LineChart
              data={{ labels, datasets: [{ data: dataPoints }] }}
              width={screenWidth - 64}
              height={height}
              withDots={false}
              withInnerLines={true}
              withOuterLines={false}
              withShadow={false}
              yAxisLabel={vsCurrency === "usd" ? "$" : ""}
              chartConfig={chartConfig}
              bezier
              style={{
                borderRadius: 12,
              }}
            />

            <View className="mt-4 flex-row items-center justify-center">
              <View
                className={`w-2 h-2 rounded-full mr-2 ${
                  isPositiveTrend ? "bg-cyan-400" : "bg-red-400"
                }`}
              />
              <Text className="text-gray-400 text-xs">
                Last {String(selectedPeriod)} day(s) · CoinGecko
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

function formatLabel(d: Date, days: number | string) {
  if (typeof days === "string" || Number(days) > 7) {
    return `${d.getMonth() + 1}/${d.getDate()}`;
  }
  return `${pad(d.getHours())}:00`;
}

function pad(n: number) {
  return n < 10 ? `0${n}` : String(n);
}
