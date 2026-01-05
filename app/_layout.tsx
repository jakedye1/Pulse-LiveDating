import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { AppModeProvider } from "@/context/AppModeContext";
import { AuthProvider } from "@/context/AuthContext";
import Colors from "@/constants/colors";
import { trpc, trpcClient } from "@/lib/trpc";

SplashScreen.preventAutoHideAsync();

SystemUI.setBackgroundColorAsync(Colors.voidBlack);

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ 
        headerShown: false,
        contentStyle: { backgroundColor: Colors.voidBlack } 
      }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="create-account" options={{ headerShown: false }} />
        <Stack.Screen name="otp" options={{ headerShown: false }} />
        <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="legal-consent" options={{ headerShown: false }} />
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
        <Stack.Screen name="notifications" options={{ headerShown: false }} />
        <Stack.Screen name="edit-profile" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="paywall" options={{ headerShown: false, presentation: 'modal', gestureEnabled: false }} />
        
        {/* Onboarding Flow */}
        <Stack.Screen name="age-gate" options={{ headerShown: false }} />
        <Stack.Screen name="basic-info" options={{ headerShown: false }} />
        <Stack.Screen name="mode-selection" options={{ headerShown: false }} />
        <Stack.Screen name="interested-in" options={{ headerShown: false }} />
        <Stack.Screen name="location-permission" options={{ headerShown: false }} />
        <Stack.Screen name="photo-upload" options={{ headerShown: false }} />
        <Stack.Screen name="bio-interests" options={{ headerShown: false }} />
        <Stack.Screen name="account-review-pending" options={{ headerShown: false }} />
        <Stack.Screen name="subscription-selection" options={{ headerShown: false }} />
        <Stack.Screen name="verification-onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding-paywall" options={{ headerShown: false, gestureEnabled: false }} />
        
        {/* Discovery & Swipe */}
        <Stack.Screen name="swipe-tutorial" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="out-of-profiles" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="daily-limit-reached" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="super-like-sent" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="boost-active" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="likes-you" options={{ headerShown: false }} />
        
        {/* Live Video */}
        <Stack.Screen name="live-match-found" options={{ headerShown: false, presentation: 'fullScreenModal' }} />
        <Stack.Screen name="live-poor-connection" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="live-audio-only" options={{ headerShown: false, presentation: 'fullScreenModal' }} />
        <Stack.Screen name="live-call-ended" options={{ headerShown: false, presentation: 'modal' }} />
        
        {/* Safety & Moderation */}
        <Stack.Screen name="safety-center" options={{ headerShown: false }} />
        <Stack.Screen name="account-standing" options={{ headerShown: false }} />
        <Stack.Screen name="strike-1" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="strike-3-ban" options={{ headerShown: false, presentation: 'fullScreenModal', gestureEnabled: false }} />
        <Stack.Screen name="appeal-form" options={{ headerShown: false }} />
        
        {/* Settings */}
        <Stack.Screen name="notification-settings" options={{ headerShown: false }} />
        <Stack.Screen name="logout-confirmation" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="dating-preferences" options={{ headerShown: false }} />
        <Stack.Screen name="privacy-settings" options={{ headerShown: false }} />
        <Stack.Screen name="blocked-users" options={{ headerShown: false }} />
        <Stack.Screen name="verification" options={{ headerShown: false }} />
        
        {/* Legal & Support */}
        <Stack.Screen name="terms-of-service" options={{ headerShown: false }} />
        <Stack.Screen name="privacy-policy" options={{ headerShown: false }} />
        <Stack.Screen name="community-guidelines" options={{ headerShown: false }} />
        <Stack.Screen name="safety-tips" options={{ headerShown: false }} />
        <Stack.Screen name="contact-support" options={{ headerShown: false }} />
        <Stack.Screen name="report-problem" options={{ headerShown: false }} />
        
        {/* User Profiles */}
        <Stack.Screen name="users/[id]" options={{ headerShown: false }} />
        
        {/* Chat & Call */}
        <Stack.Screen name="chat/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="call/[id]" options={{ headerShown: false, gestureEnabled: false, animation: 'fade' }} />
        
        {/* System Screens */}
        <Stack.Screen name="offline-mode" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="server-error" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="maintenance" options={{ headerShown: false, presentation: 'fullScreenModal', gestureEnabled: false }} />
        
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  useEffect(() => {
    console.log('[RootLayout] Mounted');
    SplashScreen.hideAsync();
  }, []);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppModeProvider>
            <GestureHandlerRootView style={{ flex: 1, backgroundColor: Colors.voidBlack }}>
              <RootLayoutNav />
            </GestureHandlerRootView>
          </AppModeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
