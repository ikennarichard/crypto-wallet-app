import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { CartesianChart, Line, useChartPressState } from "victory-native";

const screenWidth = Dimensions.get("window").width;

// Type definitions
interface DataPoint {
  x: number;
  y: number;
  label?: string;
}

interface CryptoLineChartProps {
  data?: DataPoint[];
  period?: "1h" | "24h" | "7d" | "1m" | "3m" | "1y";
  color?: string;
  showGradient?: boolean;
}

// Sample mock data
const sampleData: DataPoint[] = Array.from({ length: 30 }).map((_, i) => ({
  x: i,
  y: 50000 + Math.sin(i / 2) * 1500 + Math.random() * 1000,
  label: `Nov ${i + 1}`,
}));

// Format large numbers with K/M/B suffix
const formatNumber = (num: number): string => {
  if (num >= 1000000000) return `${(num / 1000000000).toFixed(2)}B`;
  if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
  return num.toFixed(2);
};

const CryptoLineChart: React.FC<CryptoLineChartProps> = ({
  data = sampleData,
  period = "1m",
  color = "#4A90E2",
  showGradient = true,
}) => {
  const { state, isActive } = useChartPressState({ x: 0, y: { highTmp: 0 } });
  // Validate data
  if (!data || data.length === 0) {
    return <View style={styles.container} />;
  }

  // Calculate chart dimensions
  const chartWidth = Math.min(screenWidth - 32, 600);
  const chartHeight = 240;

  const DATA = Array.from({ length: 31 }, (_, i) => ({
    day: i,
    highTmp: 40 + 30 * Math.random(),
  }));

  return (
    <View style={{ height: 300 }}>
      <CartesianChart data={DATA} xKey="day" yKeys={["highTmp"]}>
        {({ points }) => (
          <Line points={points.highTmp} color="red" strokeWidth={3} />
        )}
      </CartesianChart>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  tooltip: {
    position: "absolute",
    top: 10,
    backgroundColor: "#1c1c1e",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#4A90E2",
  },
  tooltipText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});

export default CryptoLineChart;
