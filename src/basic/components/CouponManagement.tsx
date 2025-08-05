import { useState } from "react";
import { Coupon } from "../../types";
import { CouponForm } from "./CouponForm";
import {
  getCouponDisplayText,
  validateCouponData,
  isCouponDuplicate,
} from "../utils/couponUtils";

interface CouponManagementProps {
  coupons: Coupon[];
  onAddCoupon: (coupon: Coupon) => void;
  onRemoveCoupon: (couponCode: string) => void;
  addNotification: (
    message: string,
    type: "error" | "success" | "warning"
  ) => void;
}

export const CouponManagement: React.FC<CouponManagementProps> = ({
  coupons,
  onAddCoupon,
  onRemoveCoupon,
  addNotification,
}) => {
  const [showCouponForm, setShowCouponForm] = useState(false);

  const handleAddCoupon = (coupon: Coupon) => {
    // 검증 로직을 먼저 수행
    if (!validateCouponData(coupon)) {
      return;
    }

    // 중복 검사
    if (isCouponDuplicate(coupons, coupon.code)) {
      addNotification("이미 존재하는 쿠폰 코드입니다.", "error");
      return;
    }

    // 검증 통과 후 쿠폰 추가
    onAddCoupon(coupon);
    addNotification("쿠폰이 추가되었습니다.", "success");
    setShowCouponForm(false);
  };

  const handleRemoveCoupon = (couponCode: string) => {
    onRemoveCoupon(couponCode);
    addNotification("쿠폰이 삭제되었습니다.", "success");
  };

  const handleCancelForm = () => {
    setShowCouponForm(false);
  };

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold">쿠폰 관리</h2>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coupons.map((coupon) => (
            <div
              key={coupon.code}
              className="relative bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{coupon.name}</h3>
                  <p className="text-sm text-gray-600 mt-1 font-mono">
                    {coupon.code}
                  </p>
                  <div className="mt-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-indigo-700">
                      {getCouponDisplayText(coupon)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveCoupon(coupon.code)}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 transition-colors">
            <button
              onClick={() => setShowCouponForm(!showCouponForm)}
              className="text-gray-400 hover:text-gray-600 flex flex-col items-center"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <p className="mt-2 text-sm font-medium">새 쿠폰 추가</p>
            </button>
          </div>
        </div>

        {showCouponForm && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <CouponForm
              onSubmit={handleAddCoupon}
              onCancel={handleCancelForm}
              addNotification={addNotification}
            />
          </div>
        )}
      </div>
    </section>
  );
};
