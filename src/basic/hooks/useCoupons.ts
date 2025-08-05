import { useCallback, useState } from "react";
import { Coupon } from "../../types";
import { initialCoupons } from "../constants/coupon";
import { isCouponDuplicate, generateCouponCode } from "../utils/couponUtils";

export const useCoupons = () => {
  const [coupons, _setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem("coupons");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialCoupons;
      }
    }
    return initialCoupons;
  });

  const setCoupons: React.Dispatch<React.SetStateAction<Coupon[]>> =
    useCallback(
      (coupons) => {
        _setCoupons((prev) => {
          const newValue =
            typeof coupons === "function" ? coupons(prev) : coupons;
          localStorage.setItem("coupons", JSON.stringify(newValue));
          return newValue;
        });
      },
      [_setCoupons]
    );

  // 쿠폰 추가
  const addCoupon = useCallback(
    (couponData: Coupon) => {
      setCoupons((prev) => [...prev, couponData]);
      return couponData;
    },
    [setCoupons]
  );

  // 쿠폰 삭제
  const removeCoupon = useCallback(
    (couponCode: string) => {
      setCoupons((prev) => prev.filter((coupon) => coupon.code !== couponCode));
    },
    [setCoupons]
  );

  // 쿠폰 코드로 쿠폰 찾기
  const getCouponByCode = useCallback(
    (code: string) => {
      return coupons.find((coupon) => coupon.code === code);
    },
    [coupons]
  );

  // 쿠폰 존재 여부 확인
  const isCouponExists = useCallback(
    (code: string) => {
      return coupons.some((coupon) => coupon.code === code);
    },
    [coupons]
  );

  // 쿠폰 목록 가져오기
  const getAllCoupons = useCallback(() => {
    return coupons;
  }, [coupons]);

  // 쿠폰 코드 자동 생성
  const generateUniqueCouponCode = useCallback(() => {
    let code: string;
    do {
      code = generateCouponCode();
    } while (isCouponExists(code));
    return code;
  }, [isCouponExists]);

  return {
    coupons,
    addCoupon,
    removeCoupon,

    getCouponByCode,
    isCouponExists,
    getAllCoupons,
    generateUniqueCouponCode,
  };
};
