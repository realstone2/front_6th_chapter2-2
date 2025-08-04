import React from "react";

import { ProductCard } from "./ProductCard";
import { Product } from "../../types";

interface ProductListProps {
  products: Product[];
  filteredProducts: Product[];
  debouncedSearchTerm: string;
  onAddToCart: (product: Product) => void;
  formatPrice: (price: number, productId?: string) => string;
  getRemainingStock: (product: Product) => number;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  filteredProducts,
  debouncedSearchTerm,
  onAddToCart,
  formatPrice,
  getRemainingStock,
}) => {
  return (
    <section className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">전체 상품</h2>
        <div className="text-sm text-gray-600">총 {products.length}개 상품</div>
      </div>
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            "{debouncedSearchTerm}"에 대한 검색 결과가 없습니다.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              remainingStock={getRemainingStock(product)}
              onAddToCart={onAddToCart}
              formatPrice={formatPrice}
            />
          ))}
        </div>
      )}
    </section>
  );
};
