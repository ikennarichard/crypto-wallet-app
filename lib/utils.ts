// if type is 0 thats currency
export const formatNumber = (num: number, type = 0) => {
  if (num === null || num === undefined || isNaN(num)) return "–";

  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
    style: type === 0 ? "currency" : "decimal",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};
