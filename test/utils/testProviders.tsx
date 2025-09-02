import React, { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";

export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
      },
    },
  });
}

export function withProviders(ui: React.ReactElement, client?: QueryClient) {
  const queryClient = client ?? createTestQueryClient();
  const Wrapper = ({ children }: PropsWithChildren): JSX.Element => (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </SafeAreaProvider>
  );

  return { ui, Wrapper, queryClient };
}
