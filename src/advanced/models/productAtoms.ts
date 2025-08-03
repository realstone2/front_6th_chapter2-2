import { atom } from "jotai";
import { initialProducts } from "../constants/product";
import { Product } from "../../types";
import { atomWithStorage, createJSONStorage } from "jotai/utils";

// 기본 atoms
export const productsAtom = atomWithStorage<Product[]>(
  "products",
  initialProducts,
  createJSONStorage(),
  { getOnInit: true }
);
