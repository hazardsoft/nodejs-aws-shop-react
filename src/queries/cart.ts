import axios, { AxiosError } from "axios";
import React from "react";
import { useQuery, useQueryClient, useMutation } from "react-query";
import API_PATHS from "~/constants/apiPaths";
import { Cart } from "~/models/Cart";
import { CartItem } from "~/models/CartItem";

export type CartResponse = {
  data: {
    cart: Cart;
  };
};

export function useCart() {
  return useQuery<CartItem[], AxiosError>("cart", async () => {
    const res = await axios.get<CartResponse>(
      `${API_PATHS.cart}/profile/cart`,
      {
        headers: {
          Authorization: `Basic ${localStorage.getItem("authorization_token")}`,
        },
      }
    );
    return res.data.data.cart.items;
  });
}

export function useCartData() {
  const queryClient = useQueryClient();
  return queryClient.getQueryData<CartItem[]>("cart");
}

export function useInvalidateCart() {
  const queryClient = useQueryClient();
  return React.useCallback(
    () => queryClient.invalidateQueries("cart", { exact: true }),
    []
  );
}

export function useUpsertCart() {
  return useMutation(async (updatedCartItem: CartItem) => {
    const res = await axios.put<CartResponse>(
      `${API_PATHS.cart}/profile/cart`,
      updatedCartItem,
      {
        headers: {
          Authorization: `Basic ${localStorage.getItem("authorization_token")}`,
        },
      }
    );
    return res.data.data.cart.items;
  });
}
