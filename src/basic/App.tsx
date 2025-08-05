import { useCallback, useState } from "react";
import { Coupon } from "../types";

import useFilterSearchParams from "../hooks/useFilterSearchParams";
import { AdminPage } from "./components/AdminPage";
import { MainPage } from "./components/MainPage";
import { Header } from "./Header";
import { useCart } from "./hooks/useCart";
import { useCoupons } from "./hooks/useCoupons";
import { useProducts } from "./hooks/useProducts";
import {
  calculateCartTotal,
  calculateItemTotal,
  getCartItemCount,
} from "./utils/cartUtils";

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
  const { filterSearchParams } = useFilterSearchParams();

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
      <Header
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        cart={cart}
        totalItemCount={totalItemCount}
      />

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
