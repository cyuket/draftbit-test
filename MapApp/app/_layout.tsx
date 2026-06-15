import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider } from "../context/ThemeContext";
import { useTheme } from "../hooks/useTheme";
import { Gesture, GestureHandlerRootView } from "react-native-gesture-handler";

// Single QueryClient instance shared by the whole app.
// staleTime of 5 min means cached location data is reused on navigation without a refetch.
// retry: 2 retries failed network requests twice before surfacing an error.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5,
    },
  },
});

// Inner shell that reads the active theme so StatusBar style stays in sync with
// dark/light mode. Kept separate from RootLayout because useTheme requires ThemeProvider.
function AppShell() {
  const { theme } = useTheme();
  return (
    <>
      <StatusBar style={theme.statusBar} />
      <Stack>
        {/* Both screens hide the default Expo Router header in favour of custom UI */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="location/[id]" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

// Root layout wraps the entire app with React Query and Theme providers.
// Expo Router renders this file automatically as the top-level layout.
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AppShell />
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
