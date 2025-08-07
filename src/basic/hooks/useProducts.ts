import { useCallback, useState } from "react";

import useFilterSearchParams from "../../hooks/useFilterSearchParams";
import { Product } from "../../types";
import { initialProducts } from "../constants/product";
import { generateProductId, validateProductData } from "../utils/productUtils";

export const useProducts = () => {
  const [products, _setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem("products");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialProducts;
      }
    }
    return initialProducts;
  });

  const setProducts: React.Dispatch<React.SetStateAction<Product[]>> =
    useCallback(
      (products) => {
        _setProducts((prev) => {
          const newValue =
            typeof products === "function" ? products(prev) : products;
          localStorage.setItem("products", JSON.stringify(newValue));
          return newValue;
        });
      },
      [_setProducts]
    );

  const { filterSearchParams } = useFilterSearchParams();

  // 상품 추가
  const addProduct = useCallback((productData: Omit<Product, "id">) => {
    if (!validateProductData(productData)) {
      throw new Error("Invalid product data");
    }

    const newProduct: Product = {
      ...productData,
      id: generateProductId(),
    };

    setProducts((prev: Product[]) => [...prev, newProduct]);
    return newProduct;
  }, []);

  // 상품 수정
  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts((prev: Product[]) =>
      prev.map((product: Product) =>
        product.id === id ? { ...product, ...updates } : product
      )
    );
  }, []);

  const deleteProduct = useCallback((productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  // 상품 삭제
  const removeProduct = useCallback((id: string) => {
    setProducts((prev: Product[]) =>
      prev.filter((product: Product) => product.id !== id)
    );
  }, []);

  const filteredProducts = filterSearchParams.searchTerm
    ? products.filter(
        (product) =>
          product.name
            .toLowerCase()
            .includes(filterSearchParams.searchTerm?.toLowerCase() ?? "") ||
          (product.description &&
            product.description
              .toLowerCase()
              .includes(filterSearchParams.searchTerm?.toLowerCase() ?? ""))
      )
    : products;

  return {
    products,
    filteredProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    removeProduct,
  };
};
