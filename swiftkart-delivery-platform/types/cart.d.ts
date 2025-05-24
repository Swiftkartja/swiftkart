import { CartItem } from './index';

declare module 'zustand' {
  interface StoreApi<T> {
    setState: (
      partial: T | Partial<T> | ((state: T) => T | Partial<T>),
      replace?: boolean
    ) => void;
    getState: () => T;
    subscribe: (listener: (state: T, prevState: T) => void) => () => void;
  }
}

export interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getSubtotal: () => number;
  loadCart: () => Promise<void>;
}
