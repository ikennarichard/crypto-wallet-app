import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { FavoritesProvider } from "@/context/FavortesContext";
import "@/global.css";
import { queryClient } from "@/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <GluestackUIProvider mode="light">
        <StatusBar style="auto" />
        <FavoritesProvider>
          <Stack
            initialRouteName="(tabs)"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="detail/[id]" />
          </Stack>
        </FavoritesProvider>
      </GluestackUIProvider>
    </QueryClientProvider>
  );
}
