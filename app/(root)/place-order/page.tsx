import { auth } from "@/auth";
import CheckoutSteps from "@/components/shared/CheckoutSteps";
import { getMyCart } from "@/lib/actions/cart.actions";
import { getUserById } from "@/lib/actions/user.actions";
import { ShippingAddress } from "@/types";
import { Metadata } from "next";
import {redirect} from 'next/navigation';


export const metadata: Metadata = {
    title: 'Place Order'
}

export default async function PlaceOrderPage () {

    const cart = await getMyCart();
    const session = await auth();
    const userId = session?.user?.id;

    if(!userId) throw new Error('User not found');

    const user = await getUserById(userId);

    if(!cart || cart.items.length === 0) redirect('/cart');
    if(!user.address) redirect('/shipping-address');
    if(!user.paymentMethod) redirect('/payment-method');

    const userAddress = user.address as ShippingAddress;

    return (
        <>
        <CheckoutSteps current={3} />
        </>
    );
}