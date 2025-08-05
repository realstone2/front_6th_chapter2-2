import { useCallback, useState } from "react";
import { Coupon } from "../types";

import useFilterSearchParams from "../hooks/useFilterSearchParams";
import { AdminPage } from "./components/AdminPage";
import { MainPage } from "./components/MainPage";
import { useCart } from "./hooks/useCart";
import { useCoupons } from "./hooks/useCoupons";
import { useProducts } from "./hooks/useProducts";
import {
  calculateCartTotal,
  calculateItemTotal,
  getCartItemCount,
} from "./utils/cartUtils";
import { useDebouncedCallback } from "./utils/hooks/useDebounce";

interface Notification {
  id: string;
  message: string;
  type: "error" | "success" | "warning";
}

const App = () => {
  const {
    products,
    filteredProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useProducts();

  const { coupons, addCoupon, removeCoupon } = useCoupons();

  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { filterSearchParams, setFilterSearchParams } = useFilterSearchParams();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (!value) {
      setFilterSearchParams({ searchTerm: "" });
      return;
    }

    debouncedSetSearchTerm(value);
  };

  const debouncedSetSearchTerm = useDebouncedCallback((value: string) => {
    setFilterSearchParams({ searchTerm: value });
  }, 500);

  const addNotification = useCallback(
    (message: string, type: "error" | "success" | "warning" = "success") => {
      const id = Date.now().toString();
      setNotifications((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 3000);
    },
    []
  );

  const {
    cart,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    getProductRemainingStock,
  } = useCart();

  const totalItemCount = getCartItemCount(cart);

  return (
    <div className="min-h-screen bg-gray-50">
      {notifications.length > 0 && (
        <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-md shadow-md text-white flex justify-between items-center ${
                notif.type === "error"
                  ? "bg-red-600"
                  : notif.type === "warning"
                  ? "bg-yellow-600"
                  : "bg-green-600"
              }`}
            >
              <span className="mr-2">{notif.message}</span>
              <button
                onClick={() =>
                  setNotifications((prev) =>
                    prev.filter((n) => n.id !== notif.id)
                  )
                }
                className="text-white hover:text-gray-200"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
      <header className="bg-white shadow-sm sticky top-0 z-40 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center flex-1">
              <h1 className="text-xl font-semibold text-gray-800">SHOP</h1>
              {/* 검색창 - 안티패턴: 검색 로직이 컴포넌트에 직접 포함 */}
              {!isAdmin && (
                <div className="ml-8 flex-1 max-w-md">
                  <input
                    type="text"
                    defaultValue={filterSearchParams.searchTerm ?? ""}
                    onChange={handleSearchChange}
                    placeholder="상품 검색..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}
            </div>
            <nav className="flex items-center space-x-4">
              <button
                onClick={() => setIsAdmin(!isAdmin)}
                className={`px-3 py-1.5 text-sm rounded transition-colors ${
                  isAdmin
                    ? "bg-gray-800 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {isAdmin ? "쇼핑몰로 돌아가기" : "관리자 페이지로"}
              </button>
              {!isAdmin && (
                <div className="relative">
                  <svg
                    className="w-6 h-6 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {totalItemCount}
                    </span>
                  )}
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage
            products={products}
            coupons={coupons}
            addNotification={addNotification}
            addProduct={addProduct}
            updateProduct={updateProduct}
            deleteProduct={deleteProduct}
            addCoupon={addCoupon}
            removeCoupon={removeCoupon}
          />
        ) : (
          <MainPage
            products={products}
            filteredProducts={filteredProducts}
            filterSearchParams={{
              searchTerm: filterSearchParams.searchTerm ?? "",
            }}
            cart={cart}
            addToCart={addToCart}
            updateCartItemQuantity={updateCartItemQuantity}
            removeFromCart={removeFromCart}
            clearCart={clearCart}
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
            addNotification={addNotification}
            calculateCartTotal={() => calculateCartTotal(cart, selectedCoupon)}
            calculateItemTotal={(item) => calculateItemTotal(item, cart)}
            coupons={coupons}
            getProductRemainingStock={getProductRemainingStock}
          />
        )}
      </main>
    </div>
  );
};

export default App;
