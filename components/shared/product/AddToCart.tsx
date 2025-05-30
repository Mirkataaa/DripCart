"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus, Minus, Loader } from "lucide-react";
import { Cart, CartItem, CartResponse } from "@/types";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import toast from "react-hot-toast";
import { useTransition } from "react";

export default function AddToCart({
  cart,
  item,
}: {
  cart?: Cart;
  item: CartItem;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleCartAction = (res: CartResponse) => {
    if (!res.success) {
      toast.error(res.message as string);
      return;
    }

    toast.custom((t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <Button
          variant="ghost"
          onClick={() => router.push("/cart")}
          className="w-full"
        >
          {res.message}
        </Button>
      </div>
    ));
  };

  const handleAddToCart = async () => {
    startTransition(async () => {
      const res = await addItemToCart(item);
      handleCartAction(res);
    });
  };

  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId);
      handleCartAction(res);
    });
  };

  // Check if item is in cart

  const existItem =
    cart && cart.items.find((x) => x.productId === item.productId);

  return existItem ? (
    <div>
      <Button type="button" variant="outline" onClick={handleRemoveFromCart}>
        {isPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Minus className="h-4 w-4 " />
        )}
      </Button>
      <span className="px-2">{existItem.qty}</span>
      <Button type="button" variant="outline" onClick={handleAddToCart}>
        {isPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4 " />
        )}
      </Button>
    </div>
  ) : (
    <Button className="w-full" type="button" onClick={handleAddToCart}>
      {isPending ? <Loader className="w-4 h-4 animate-spin" /> : ""}Add To Cart
    </Button>
  );
}
