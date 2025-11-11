export type Coin = {
  id: string;
  price_change_percentage_24h: number;
  image: string;
  name: string;
  symbol: string;
  current_price: number;
  total_volume: number;
};

export interface CoinDetail extends Coin {
  description?: {
    en: string;
  };
  market_data?: {
    current_price: { usd: number };
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_30d: number;
    market_cap: { usd: number };
    total_volume: { usd: number };
  };
}
