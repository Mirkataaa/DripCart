export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Drip Cart';
export const APP_DESCRIPTION = process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'A modern ecommerce store build with NextJS';
export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
export const LATEST_PRODUCTS_LIMIT = Number(process.env.LATEST_PRODUCTS_LIMIT) || 4;
export const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;


export const signInDefaultValues = {
    email: '',
    password: ''
};

export const signUnDefaultValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
};

export const shippingAddressDefaultValues = {
    fullName: '',
    streetAddress: '',
    city: '',
    postalCode: '',
    country: '',
};

export const PAYMENT_METHODS = process.env.PAYMENT_METHODS ? process.env.PAYMENT_METHODS.split(', ') : ['PayPal' , 'Stripe' , 'CashOnDelivery'];
export const DEFAULT_PAYMENT_METHOD = process.env.DEFAULT_PAYMENT_METHOD || 'PayPal';