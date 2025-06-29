"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, useTheme } from "next-themes";
import React, { ReactNode, useState } from "react";
import { DevelopmentDialog } from "@/components/(public)/development-dialog";
import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider as ClerkProviderClerk } from "@clerk/nextjs";
import { dark } from "@clerk/themes";


export default function Provider({ children }: { children: ReactNode }) {


  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ClerkProvider>
        {children}
      </ClerkProvider>
    </ThemeProvider>
  );
}

export function ClerkProvider({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
    const queryClient = new QueryClient();
  const [open, setOpen] = useState(true);

  
  const isDark = theme === "dark";
  return (
    <ClerkProviderClerk
      appearance={{
        baseTheme: isDark ? dark : undefined,
      }}
    >
     <QueryClientProvider client={queryClient}>
          <DevelopmentDialog open={open} onOpenChange={setOpen} />
          <Toaster />
          {children}
      </QueryClientProvider>
    </ClerkProviderClerk>
  );
}