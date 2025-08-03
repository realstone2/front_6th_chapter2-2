import { CartItem, Product } from "../../types";

/**
 * 가격 포맷팅 (관리자 모드 지원)
 */
export const formatPrice = (
  price: number,
  isAdmin: boolean = false,
  product?: Product,
  cart?: CartItem[]
): string => {
  if (product && cart) {
    const cartItem = cart.find((item) => item.product.id === product.id);
    const remaining = product.stock - (cartItem?.quantity || 0);

    if (remaining <= 0) {
      return "품절";
    }
  }

  if (isAdmin) {
    return `${price.toLocaleString()}원`;
  }

  return `${price.toLocaleString()}원`;
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
