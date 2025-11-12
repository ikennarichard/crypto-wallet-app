import { BASE_URL, getApiHeaders } from "@/lib/config";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface ChartData {
  labels: string[];
  dataPoints: number[];
}

interface UseCryptoChartParams {
  coinId: string;
  vsCurrency: string;
  selectedPeriod: string | number;
}

function formatLabel(date: Date, period: number): string {
  if (period === 1) {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (period <= 7) {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } else if (period <= 30) {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    });
  }
}

export function useCryptoChart({
  coinId,
  vsCurrency,
  selectedPeriod,
}: UseCryptoChartParams) {
  return useQuery({
    queryKey: ["chart", coinId, vsCurrency, selectedPeriod],
    queryFn: async () => {
      const url = `${BASE_URL}/coins/${coinId}/market_chart?vs_currency=${vsCurrency}&days=${selectedPeriod}&interval=daily`;

      const response = await axios.get(url, { headers: getApiHeaders() });
      console.log(response, url);

      if (!response.data.prices || !Array.isArray(response.data.prices)) {
        throw new Error("Unexpected API response format");
      }

      const data = response.data;

      const prices: [number, number][] = data.prices;
      const points = prices.map((p) => p[1]);
      const rawLabels = prices.map((p) => new Date(p[0]));

      const maxLabels = 6;
      const step = Math.max(1, Math.floor(points.length / maxLabels));

      const chartLabels = Array(points.length).fill("");
      rawLabels.forEach((date, idx) => {
        if (idx % step === 0) {
          chartLabels[idx] = formatLabel(date, Number(selectedPeriod));
        }
      });

      return {
        labels: chartLabels,
        dataPoints: points,
      };
    },
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    retry: 1,
  });
}
