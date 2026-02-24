import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface CartItem {
  productId: bigint;
  productName: string;
  productImage: string;
  price: bigint;
  size: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  total: bigint;
  addItem: (item: CartItem) => void;
  removeItem: (productId: bigint, size: string) => void;
  updateQuantity: (productId: bigint, size: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((newItem: CartItem) => {
    setItems(prev => {
      const existing = prev.find(
        i => i.productId === newItem.productId && i.size === newItem.size
      );
      if (existing) {
        return prev.map(i =>
          i.productId === newItem.productId && i.size === newItem.size
            ? { ...i, quantity: i.quantity + newItem.quantity }
            : i
        );
      }
      return [...prev, newItem];
    });
  }, []);

  const removeItem = useCallback((productId: bigint, size: string) => {
    setItems(prev => prev.filter(i => !(i.productId === productId && i.size === size)));
  }, []);

  const updateQuantity = useCallback((productId: bigint, size: string, quantity: number) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(i => !(i.productId === productId && i.size === size)));
    } else {
      setItems(prev =>
        prev.map(i =>
          i.productId === productId && i.size === size ? { ...i, quantity } : i
        )
      );
    }
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const total = items.reduce((sum, i) => sum + i.price * BigInt(i.quantity), BigInt(0));

  return (
    <CartContext.Provider value={{ items, itemCount, total, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
