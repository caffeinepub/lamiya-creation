import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Product {
    id: bigint;
    name: string;
    description: string;
    sizes: Array<string>;
    stock: bigint;
    imageUrl: string;
    category: string;
    price: bigint;
}
export interface CartItem {
    size: string;
    productId: bigint;
    quantity: bigint;
}
export interface Order {
    status: string;
    deliveryAddress: string;
    deliveryName: string;
    orderId: bigint;
    totalAmount: bigint;
    items: Array<CartItem>;
}
export interface backendInterface {
    addProduct(name: string, description: string, price: bigint, category: string, sizes: Array<string>, stock: bigint, imageUrl: string): Promise<bigint>;
    addToCart(productId: bigint, size: string, quantity: bigint): Promise<void>;
    checkout(deliveryName: string, deliveryAddress: string): Promise<bigint>;
    clearCart(): Promise<void>;
    deleteProduct(id: bigint): Promise<void>;
    getAllProducts(): Promise<Array<Product>>;
    getOrders(): Promise<Array<Order>>;
    getProductById(id: bigint): Promise<Product>;
    removeFromCart(productId: bigint, size: string): Promise<void>;
    updateProduct(id: bigint, name: string, description: string, price: bigint, category: string, sizes: Array<string>, stock: bigint, imageUrl: string): Promise<void>;
}
