"use client";

import { KeycloakProvider } from "@/contexts/keycloak-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import React, { ReactNode } from "react";

export default function Provider({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <KeycloakProvider>

        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </KeycloakProvider>
    </QueryClientProvider>
  );
}
