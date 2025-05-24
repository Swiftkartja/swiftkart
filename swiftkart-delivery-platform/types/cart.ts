import { CartItem } from './index';

export interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getSubtotal: () => number;
  loadCart: () => Promise<void>;
}

export type SetState = (fn: (state: CartState) => Partial<CartState>) => void;
export type GetState = () => CartState;
