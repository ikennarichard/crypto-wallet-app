export const BASE_URL = "https://api.coingecko.com/api/v3";

const cak = process.env.COINGECKO_API_KEY

export const getApiHeaders = () => {
  if (cak) {
    return {
      "x-cg-demo-api-key": cak,
    };
  }
  return {};
};
