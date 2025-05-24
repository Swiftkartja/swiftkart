import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockUsers } from '@/mocks/users';
import { User, UserRole } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  userRole: UserRole | null;
  
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  checkAccess: (roles: UserRole | UserRole[]) => boolean;
  updateUser: (userData: Partial<User>) => void;
  
  // Password reset functions
  resetPassword: (email: string) => Promise<void>;
  verifyResetCode: (email: string, code: string) => Promise<boolean>;
  updatePassword: (email: string, newPassword: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      userRole: null,
      
      login: async (email: string, password: string, role: UserRole) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // First check if user exists with this email
          const userByEmail = mockUsers.find(
            u => u.email.toLowerCase() === email.toLowerCase()
          );
          
          if (!userByEmail) {
            throw new Error('User not found');
          }
          
          // Then check if the role matches
          if (userByEmail.role !== role) {
            throw new Error('Invalid user role');
          }
          
          // Finally check the password
          if (userByEmail.password !== password) {
            throw new Error('Invalid password');
          }
          
          set({ 
            user: userByEmail, 
            isAuthenticated: true, 
            isLoading: false,
            userRole: userByEmail.role
          });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Authentication failed',
            isAuthenticated: false,
            user: null,
            userRole: null
          });
          throw error;
        }
      },
      
      register: async (name: string, email: string, password: string, role: UserRole) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Check if user already exists
          const existingUser = mockUsers.find(
            u => u.email.toLowerCase() === email.toLowerCase()
          );
          
          if (existingUser) {
            throw new Error('User already exists');
          }
          
          // Create new user with all required properties from User type
          const newUser: User = {
            id: `user-${Date.now()}`,
            name,
            email,
            password,
            role,
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          
          // In a real app, we would save this to a database
          // For this demo, we'll just set it in the store
          set({ 
            user: newUser, 
            isAuthenticated: true, 
            isLoading: false,
            userRole: newUser.role
          });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Registration failed',
            isAuthenticated: false,
            user: null,
            userRole: null
          });
          throw error;
        }
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false, userRole: null });
      },
      
      checkAccess: (roles) => {
        const { userRole } = get();
        
        if (!userRole) return false;
        
        if (Array.isArray(roles)) {
          return roles.includes(userRole);
        }
        
        return roles === userRole;
      },
      
      updateUser: (userData) => {
        const { user } = get();
        if (user) {
          set({ 
            user: { 
              ...user, 
              ...userData,
              updatedAt: new Date().toISOString()
            } 
          });
        }
      },
      
      resetPassword: async (email: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Check if user exists
          const user = mockUsers.find(
            u => u.email.toLowerCase() === email.toLowerCase()
          );
          
          if (!user) {
            throw new Error('User not found');
          }
          
          // In a real app, we would send an email with a reset code
          // For this demo, we'll just simulate success
          set({ isLoading: false });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Password reset failed'
          });
          throw error;
        }
      },
      
      verifyResetCode: async (email: string, code: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // For demo purposes, any 6-digit code will work
          // In a real app, we would verify against a stored code
          const isValid = code === '123456';
          
          if (!isValid) {
            throw new Error('Invalid reset code');
          }
          
          set({ isLoading: false });
          return true;
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Code verification failed'
          });
          throw error;
        }
      },
      
      updatePassword: async (email: string, newPassword: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Check if user exists
          const user = mockUsers.find(
            u => u.email.toLowerCase() === email.toLowerCase()
          );
          
          if (!user) {
            throw new Error('User not found');
          }
          
          // In a real app, we would update the password in the database
          // For this demo, we'll just simulate success
          set({ isLoading: false });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Password update failed'
          });
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);