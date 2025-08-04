import { useState, useEffect, useCallback } from "react";

/**
 * useState와 useEffect를 활용한 간단한 useSearchParams 훅
 * URL의 search parameters를 구독하고 업데이트할 수 있습니다.
 */
export function useSearchParams(): [
  URLSearchParams,
  (params: URLSearchParams | Record<string, string>) => void
] {
  const [searchParams, setSearchParamsState] = useState(() => {
    if (typeof window === "undefined") {
      return new URLSearchParams();
    }
    return new URLSearchParams(window.location.search);
  });

  // URL 변경 감지
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handlePopState = () => {
      setSearchParamsState(new URLSearchParams(window.location.search));
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // searchParams 업데이트 함수
  const setSearchParams = useCallback(
    (params: URLSearchParams | Record<string, string>) => {
      if (typeof window === "undefined") return;

      const newSearchParams =
        params instanceof URLSearchParams
          ? params
          : new URLSearchParams(params);

      const newUrl = `${window.location.pathname}${
        newSearchParams.toString() ? `?${newSearchParams.toString()}` : ""
      }${window.location.hash}`;

      history.replaceState(null, "", newUrl);
      setSearchParamsState(newSearchParams);
    },
    []
  );

  return [searchParams, setSearchParams];
}
