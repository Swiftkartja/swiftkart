import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform, View, Text } from "react-native";
import { useAuthStore } from "@/store/auth-store";
import { ErrorBoundary } from "./error-boundary";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc, trpcClient } from "@/lib/trpc";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Create a client
const queryClient = new QueryClient();

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error("Font loading error:", error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync().catch(err => {
        console.error("Error hiding splash screen:", err);
      });
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <RootLayoutNav />
          </AuthProvider>
        </QueryClientProvider>
      </trpc.Provider>
    </ErrorBoundary>
  );
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, userRole } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Add error handling and logging
    try {
      const inAuthGroup = segments[0] === 'auth';
      const inVendorDashboard = segments[0] === 'vendor-dashboard';
      const inRiderDashboard = segments[0] === 'rider-dashboard';
      const inAdminDashboard = segments[0] === 'admin-dashboard';
      
      console.log("Auth state:", { isAuthenticated, userRole, currentSegment: segments[0] });
      
      // Handle authentication routing
      if (!isAuthenticated && !inAuthGroup) {
        // Redirect to the login page if not authenticated
        console.log("Redirecting to login (not authenticated)");
        router.replace('/auth/login');
      } else if (isAuthenticated && inAuthGroup) {
        // Redirect to the appropriate dashboard based on user role
        console.log("Redirecting to role dashboard (authenticated in auth group)");
        navigateToRoleDashboard(userRole);
      } 
      
      // Handle role-based access restrictions
      if (isAuthenticated) {
        // Prevent customers from accessing dashboards
        if (userRole === 'customer' && (inVendorDashboard || inRiderDashboard || inAdminDashboard)) {
          console.log("Redirecting customer away from restricted dashboard");
          router.replace('/(tabs)');
        }
        
        // Prevent vendors from accessing rider or admin dashboards
        if (userRole === 'vendor' && (inRiderDashboard || inAdminDashboard)) {
          console.log("Redirecting vendor away from restricted dashboard");
          router.replace('/vendor-dashboard');
        }
        
        // Prevent riders from accessing vendor or admin dashboards
        if (userRole === 'rider' && (inVendorDashboard || inAdminDashboard)) {
          console.log("Redirecting rider away from restricted dashboard");
          router.replace('/rider-dashboard');
        }
        
        // Admin can access everything, no restrictions needed
      }
    } catch (error) {
      console.error("Error in auth routing:", error);
      // Fallback to login page if there's an error in routing logic
      router.replace('/auth/login');
    }
  }, [isAuthenticated, segments, userRole]);

  const navigateToRoleDashboard = (role: string | null) => {
    if (!role) {
      console.log("No role found, defaulting to login");
      router.replace('/auth/login');
      return;
    }
    
    try {
      console.log(`Navigating to dashboard for role: ${role}`);
      switch (role) {
        case 'customer':
          router.replace('/(tabs)');
          break;
        case 'vendor':
          router.replace('/vendor-dashboard');
          break;
        case 'rider':
          router.replace('/rider-dashboard');
          break;
        case 'admin':
          router.replace('/admin-dashboard');
          break;
        default:
          console.log(`Unknown role: ${role}, defaulting to customer view`);
          router.replace('/(tabs)');
      }
    } catch (error) {
      console.error("Error navigating to role dashboard:", error);
      // Fallback to login page if there's an error
      router.replace('/auth/login');
    }
  };

  // Add a fallback UI in case children fail to render
  try {
    return <>{children}</>;
  } catch (error) {
    console.error("Error rendering auth provider children:", error);
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Something went wrong. Please restart the app.</Text>
      </View>
    );
  }
}

function RootLayoutNav() {
  const { userRole } = useAuthStore();
  
  // Helper function to check if user has required role(s)
  const checkAccess = (requiredRoles: string | string[]) => {
    if (!userRole) return false;
    
    if (Array.isArray(requiredRoles)) {
      return requiredRoles.includes(userRole);
    }
    
    return requiredRoles === userRole;
  };
  
  // Add error handling for the navigation rendering
  try {
    return (
      <Stack
        screenOptions={{
          headerBackTitle: "Back",
        }}
      >
        {/* Public routes accessible to customers */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        
        {/* Role-specific dashboards with conditional access */}
        {checkAccess(['vendor', 'admin']) && (
          <Stack.Screen name="vendor-dashboard" options={{ headerShown: false }} />
        )}
        
        {checkAccess(['rider', 'admin']) && (
          <Stack.Screen name="rider-dashboard" options={{ headerShown: false }} />
        )}
        
        {checkAccess('admin') && (
          <Stack.Screen name="admin-dashboard" options={{ headerShown: false }} />
        )}
        
        {/* Customer-specific screens */}
        <Stack.Screen name="edit-profile" options={{ title: "Edit Profile" }} />
        <Stack.Screen name="addresses" options={{ title: "My Addresses" }} />
        <Stack.Screen name="payment-methods" options={{ title: "Payment Methods" }} />
        <Stack.Screen name="favorites" options={{ title: "Favorites" }} />
        <Stack.Screen name="notifications" options={{ title: "Notifications" }} />
        <Stack.Screen name="help" options={{ title: "Help & Support" }} />
        <Stack.Screen name="settings" options={{ title: "Settings" }} />
        <Stack.Screen name="cart" options={{ title: "Cart" }} />
        <Stack.Screen name="checkout" options={{ title: "Checkout" }} />
        <Stack.Screen name="wallet" options={{ title: "Wallet" }} />
        
        {/* Shared screens */}
        <Stack.Screen name="vendor/[id]" options={{ title: "Vendor Details" }} />
        <Stack.Screen name="product/[id]" options={{ title: "Product Details" }} />
        <Stack.Screen name="service/[id]" options={{ title: "Service Details" }} />
        <Stack.Screen name="order/[id]" options={{ title: "Order Details" }} />
        <Stack.Screen name="chat/[id]" options={{ title: "Chat" }} />
        <Stack.Screen name="track-order/[id]" options={{ title: "Track Order" }} />
      </Stack>
    );
  } catch (error) {
    console.error("Error rendering navigation:", error);
    // Provide a fallback UI if navigation fails
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Navigation error. Please restart the app.</Text>
      </View>
    );
  }
}