import { create } from "zustand";
import { useToast } from "@/components/ui/use-toast";

import { persist } from "zustand/middleware";
// create type for our cart

type Cart = {
  items: Item[];
  totalPrice: number;
};

type Item = {
  name: string;
  price: number;
  qty: number;
  img: string;
  size?: string;
  color?: string;
  id: string;
};
const initialState: Cart = {
  items: [],
  totalPrice: 0,
};

export const cartStore = create<Cart>()(
  persist(() => initialState, {
    name: "cartStore",
  })
);

export default function useCartServices() {
  const { toast } = useToast();
  const { items, totalPrice } = cartStore();
  return {
    items,
    totalPrice,
    increase: (item: Item) => {
      const exist = items.find((x) => x.id === item.id);

      const updatedCartItems = exist
        ? items.map((x) =>
            x.id === item.id ? { ...exist, qty: exist.qty + 1 } : x
          )
        : [...items, { ...item, qty: 1 }];

      const { totalPrice } = calcPrice(updatedCartItems);
      cartStore.setState({
        items: updatedCartItems,
        totalPrice,
      });
      toast({
        description: "Product added ✔",
      });
    },
    remove: (item: Item) => {
      const updatedCartItems = items.filter((x) => x.id !== item.id);
      const { totalPrice } = calcPrice(updatedCartItems);
      cartStore.setState({
        items: updatedCartItems,
        totalPrice,
      });
      toast({
        description: "Product removed 🤔",
      });
    },
    clear: () => {
      cartStore.setState({
        items: [],
        totalPrice: 0,
      });
      toast({
        description: "Cart emptied  🤔",
      });
    },
    decrease: (item: Item) => {
      const exist = items.find((x) => x.id === item.id);

      if (exist?.qty === 1) return;
      const updatedCartItems = exist
        ? items.map((x) =>
            x.id === item.id ? { ...exist, qty: exist.qty - 1 } : x
          )
        : [];
      const { totalPrice } = calcPrice(updatedCartItems);
      cartStore.setState({
        items: updatedCartItems,
        totalPrice,
      });
      toast({
        description: "Product quantity reduced 🤔",
      });
    },
    init: () => cartStore.setState(initialState),
  };
}
const calcPrice = (items: Item[]) => {
  const totalPrice = items.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  return {
    totalPrice,
  };
};
