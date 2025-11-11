import { pallete } from "@/constants/colors";
import { useCryptoChart } from "@/hooks/useCryptoChart";
import { formatNumber } from "@/lib/utils";
import { RefreshCw } from "lucide-react-native";
import React, { useState } from "react";
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
  height = 320,
}: Props) {
  const [selectedPeriod, setSelectedPeriod] = useState(days);

  const { data, isLoading, error, refetch, isRefetching } = useCryptoChart({
    coinId,
    vsCurrency,
    selectedPeriod,
  });

  const onRefresh = async () => {
    refetch();
  };

  const periods = [
    { label: "1D", value: 1 },
    { label: "7D", value: 7 },
    { label: "1M", value: 30 },
    { label: "3M", value: 90 },
    { label: "1Y", value: 365 },
  ];

  if (isLoading) {
    return (
      <View className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6">
        <View className="items-center justify-center" style={{ height }}>
          <ActivityIndicator size="large" color="#22d3ee" />
          <Text className="text-gray-400 mt-4">Loading chart...</Text>
        </View>
      </View>
    );
  }

  if (!data || error) {
    return (
      <View className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6">
        <View className="items-center justify-center" style={{ height }}>
          <Text className="text-red-400 text-center mb-4">
            Error: {error?.message}
          </Text>
          <Pressable
            onPress={() => refetch()}
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
    data.dataPoints.length > 1 &&
    data.dataPoints[data.dataPoints.length - 1] > data.dataPoints[0];

  // chart config
  const chartConfig = {
    backgroundColor: "#0f172a",
    backgroundGradientFrom: "#1e293b",
    backgroundGradientFromOpacity: 1,
    backgroundGradientTo: "#0f172a",
    backgroundGradientToOpacity: 1,
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(191, 255, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(148, 163, 184, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "3",
      strokeWidth: "3",
      stroke: pallete.lime,
      fill: pallete.lime,
      shadowColor: "#22d3ee",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: 8,
    },
    propsForBackgroundLines: {
      strokeDasharray: "",
      stroke: "#1e293b",
      strokeWidth: 1,
      strokeOpacity: 0.3,
    },
    propsForLabels: {
      fontSize: 10,
      fontWeight: "600",
    },
    fillShadowGradient: "#06b6d4",
    fillShadowGradientOpacity: 0.3,
    strokeWidth: 3,
  };

  return (
    <View className="relative overflow-hidden mb-3">
      <View className="m-[1px] backdrop-blur-xl overflow-hidden">
        <ScrollView
          horizontal={false}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
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
                    isRefetching ? "animate-spin" : ""
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
          <View>
            <LineChart
              data={{
                labels: data.labels,
                datasets: [
                  {
                    data: data.dataPoints,
                    color: (opacity = 1) => `rgba(34, 211, 238, ${opacity})`,
                    strokeWidth: 3,
                  },
                ],
              }}
              width={screenWidth}
              height={height}
              withDots={true}
              withInnerLines={true}
              withOuterLines={false}
              withShadow={true}
              withVerticalLabels={true}
              withHorizontalLabels={true}
              yAxisLabel={vsCurrency === "usd" ? "$" : ""}
              chartConfig={chartConfig}
              bezier
              style={{
                borderRadius: 16,
                marginVertical: 6,
              }}
              segments={4}
              formatYLabel={(value) => formatNumber(Number(value), 1)}
            />

            <View className="mt-4 flex-row items-center justify-center">
              <View
                className={`w-2 h-2 rounded-full mr-2 ${
                  isPositiveTrend ? "bg-cyan-400" : "bg-red-400"
                }`}
              />
              <Text className="text-gray-400 text-xs">
                Last {String(selectedPeriod)} day(s) 
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
