"use client";

import { KeycloakProvider } from "@/contexts/keycloak-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import React, { ReactNode, useState } from "react";
import { DevelopmentDialog } from "@/components/(public)/development-dialog";

export default function Provider({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient();
  const [open, setOpen] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <KeycloakProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <DevelopmentDialog open={open} onOpenChange={setOpen} />
          {children}
        </ThemeProvider>
      </KeycloakProvider>
    </QueryClientProvider>
  );
}
