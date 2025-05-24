// User types
export type UserRole = 'customer' | 'vendor' | 'rider' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // In a real app, this would not be stored in the client
  role: UserRole;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  
  // Role-specific information
  vendorInfo?: VendorInfo;
  customerInfo?: CustomerInfo;
  riderInfo?: RiderInfo;
  adminInfo?: AdminInfo;
}

export interface VendorInfo {
  id?: string;
  name?: string;
  storeId?: string;
  storeName?: string;
  description?: string;
  logo?: string;
  banner?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  categories?: string[];
  tags?: string[];
  rating?: number;
  reviewCount?: number;
  isOpen?: boolean;
  openingHours?: {
    day: string;
    open: string;
    close: string;
    isOpen: boolean;
  }[];
  deliveryFee?: number;
  minOrderAmount?: number;
  maxDeliveryDistance?: number;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface CustomerInfo {
  id?: string;
  addresses?: Address[];
  defaultAddressId?: string;
  phone?: string;
  dateOfBirth?: string;
  preferences?: {
    categories?: string[];
    dietary?: string[];
  };
  walletBalance?: number;
  loyaltyPoints?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface RiderInfo {
  id?: string;
  vehicleType?: 'bicycle' | 'motorcycle' | 'car' | 'van';
  vehicleDetails?: {
    make?: string;
    model?: string;
    year?: string;
    color?: string;
    licensePlate?: string;
  };
  isOnline?: boolean;
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
  rating?: number;
  reviewCount?: number;
  completedDeliveries?: number;
  walletBalance?: number;
  documents?: {
    id: string;
    type: string;
    url: string;
    verified: boolean;
    uploadedAt: string;
  }[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminInfo {
  id?: string;
  permissions?: string[];
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Address type
export interface Address {
  id: string;
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

// Product types
export interface Product {
  id: string;
  vendorId: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  images: string[];
  category: string;
  subcategory?: string;
  tags: string[];
  options?: ProductOption[];
  variants?: ProductVariant[];
  inventory: number;
  unit?: string;
  isAvailable: boolean;
  isFeatured?: boolean;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductOption {
  id: string;
  name: string;
  required: boolean;
  multiple: boolean;
  choices: {
    id: string;
    name: string;
    price: number;
  }[];
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  salePrice?: number;
  inventory: number;
  isAvailable: boolean;
  attributes: {
    [key: string]: string;
  };
}

// Service types
export interface Service {
  id: string;
  vendorId: string;
  name: string;
  description: string;
  price: number;
  priceType: 'fixed' | 'hourly' | 'starting_at';
  images: string[];
  category: string;
  subcategory?: string;
  tags: string[];
  duration?: number; // in minutes
  isAvailable: boolean;
  isFeatured?: boolean;
  rating?: number;
  reviewCount?: number;
  serviceAreas?: string[];
  availabilitySchedule?: {
    day: string;
    slots: {
      start: string;
      end: string;
    }[];
  }[];
  createdAt: string;
  updatedAt: string;
}

// Order types
export interface Order {
  id: string;
  customerId: string;
  vendorId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  tip?: number;
  discount?: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethodType;
  paymentStatus: PaymentStatus;
  deliveryAddress: Address;
  deliveryInstructions?: string;
  riderId?: string;
  estimatedDeliveryTime?: string;
  actualDeliveryTime?: string;
  createdAt: string;
  updatedAt: string;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
}

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'preparing' 
  | 'ready_for_pickup' 
  | 'out_for_delivery' 
  | 'delivered' 
  | 'cancelled';

export type PaymentMethodType = 
  | 'credit_card' 
  | 'debit_card' 
  | 'wallet' 
  | 'cash_on_delivery';

export type PaymentStatus = 
  | 'pending' 
  | 'completed' 
  | 'failed' 
  | 'refunded' 
  | 'partially_refunded';

export interface OrderItem {
  id: string;
  productId?: string;
  serviceId?: string;
  name: string;
  price: number;
  quantity: number;
  options?: {
    name: string;
    choice: string;
    price: number;
  }[];
  subtotal: number;
  notes?: string;
}

// Cart types
export interface CartItem {
  id: string;
  productId?: string;
  serviceId?: string;
  vendorId: string;
  name: string;
  price: number;
  salePrice?: number;
  image: string;
  quantity: number;
  options?: {
    name: string;
    choice: string;
    price: number;
  }[];
  notes?: string;
}

// Review types
export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  targetId: string; // productId, serviceId, vendorId, or riderId
  targetType: 'product' | 'service' | 'vendor' | 'rider';
  rating: number;
  comment?: string;
  images?: string[];
  createdAt: string;
  updatedAt: string;
  reply?: {
    userId: string;
    userName: string;
    comment: string;
    createdAt: string;
  };
}

// Category types
export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  image?: string;
  parentId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Message types
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  attachments?: {
    id: string;
    type: 'image' | 'file';
    url: string;
    name?: string;
  }[];
  isRead: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  createdAt: string;
  updatedAt: string;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: 'order' | 'promotion' | 'system' | 'chat';
  data?: any;
  isRead: boolean;
  createdAt: string;
}

// Map related types
export interface MapMarker {
  id: string;
  title: string;
  description?: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  type: 'pickup' | 'dropoff' | 'rider' | 'vendor' | 'customer';
}

export interface Route {
  origin: {
    latitude: number;
    longitude: number;
  };
  destination: {
    latitude: number;
    longitude: number;
  };
  waypoints?: {
    latitude: number;
    longitude: number;
  }[];
  distance?: string;
  duration?: string;
}

// Wallet and payment types
export interface WalletTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'payment' | 'refund' | 'transfer';
  status: 'pending' | 'completed' | 'failed';
  reference?: string;
  description: string;
  createdAt: string;
}

// Payment method interface for the app
export interface PaymentMethod {
  id: string;
  userId: string;
  type: 'card' | 'bank' | 'wallet';
  isDefault: boolean;
  details: {
    last4?: string;
    brand?: string;
    expiryMonth?: string;
    expiryYear?: string;
    bankName?: string;
    accountLast4?: string;
  };
  createdAt: string;
}