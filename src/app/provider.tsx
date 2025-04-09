"use client";

import { KeycloakAuthProvider } from "@/contexts/KeycloakProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import React, { ReactNode } from "react";

export default function Provider({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <KeycloakAuthProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </KeycloakAuthProvider>
    </QueryClientProvider>
  );
}
