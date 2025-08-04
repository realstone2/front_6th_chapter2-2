import { useCallback, useState, useEffect } from "react";
import { CartItem, Product } from "../../types";
import { getRemainingStock } from "../utils/cartUtils";

export const useCart = (
  addNotification?: (
    message: string,
    type: "error" | "success" | "warning"
  ) => void
) => {
  const [cart, _setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const setCart: React.Dispatch<React.SetStateAction<CartItem[]>> = useCallback(
    (cart) => {
      _setCart((prev) => {
        const newValue = typeof cart === "function" ? cart(prev) : cart;
        if (newValue.length > 0) {
          localStorage.setItem("cart", JSON.stringify(newValue));
        } else {
          localStorage.removeItem("cart");
        }
        return newValue;
      });
    },
    [_setCart]
  );

  // 장바구니에 상품 추가
  const addToCart = useCallback(
    (product: Product, quantity: number = 1) => {
      const remainingStock = getRemainingStock(product, cart);

      if (quantity > remainingStock) {
        addNotification?.(
          `재고는 ${remainingStock}개까지만 있습니다.`,
          "error"
        );
        return;
      }

      setCart((prev) => {
        const existingItem = prev.find(
          (item) => item.product.id === product.id
        );

        if (existingItem) {
          return prev.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          return [...prev, { product, quantity }];
        }
      });
    },
    [cart, addNotification]
  );

  // 장바구니에서 상품 수량 변경
  const updateCartItemQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(productId);
        return;
      }

      setCart((prev) => {
        const item = prev.find((item) => item.product.id === productId);
        if (!item) return prev;

        // 상품의 총 재고만큼만 허용
        if (quantity > item.product.stock) {
          addNotification?.(
            `재고는 ${item.product.stock}개까지만 있습니다.`,
            "error"
          );
          return prev;
        }

        return prev.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        );
      });
    },
    [addNotification]
  );

  // 장바구니에서 상품 제거
  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  // 장바구니 비우기
  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // 상품의 재고 확인
  const getProductRemainingStock = useCallback(
    (product: Product) => {
      return getRemainingStock(product, cart);
    },
    [cart]
  );

  // 장바구니에 상품이 있는지 확인
  const isInCart = useCallback(
    (productId: string) => {
      return cart.some((item) => item.product.id === productId);
    },
    [cart]
  );

  // 장바구니 아이템 가져오기
  const getCartItem = useCallback(
    (productId: string) => {
      return cart.find((item) => item.product.id === productId);
    },
    [cart]
  );

  return {
    cart,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    getProductRemainingStock,
    isInCart,
    getCartItem,
  };
};
