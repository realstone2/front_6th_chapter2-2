import { CartItem, Product } from "../../types";

export const formatPrice = (price: number, isSoldOut: boolean): string => {
  if (isSoldOut) {
    return "SOLD OUT";
  }

  return price.toLocaleString();
};

/**
 * 날짜를 YYYY-MM-DD 형식으로 포맷
 */
export const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

/**
 * 소수를 퍼센트로 변환 (0.1 → 10%)
 */
export const formatPercentage = (rate: number): string => {
  return `${(rate * 100).toFixed(0)}%`;
};
