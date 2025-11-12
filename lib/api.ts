import { Coin, CoinDetail } from "@/types";
import axios from "axios";
import { BASE_URL, getApiHeaders } from "./config";

export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchWithErrorHandling<T>(url: string): Promise<T> {
  try {
    const response = await axios.get(url, { headers: getApiHeaders() });

    if (!response) {
      throw new ApiError(`Failed to fetch data`);
    }

    return await response.data;
  } catch (error) {
    console.error(error);
    if (error instanceof ApiError) {
      throw error;
    }
    if (error instanceof TypeError) {
      throw new ApiError("Network error. Please check your connection.");
    }
    throw new ApiError("An unexpected error occurred. Please try again.");
  }
}

export const getCoins = async (): Promise<Coin[]> => {
  return fetchWithErrorHandling<Coin[]>(
    `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&sparkline=false`
  );
};

export const getCoinDetail = async (id: string): Promise<CoinDetail> => {
  return fetchWithErrorHandling<CoinDetail>(
    `${BASE_URL}/coins/${id}?localization=false&tickers=false&community_data=false&developer_data=false`
  );
};