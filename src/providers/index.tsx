"use client";

import React, { ReactNode } from "react";
import QueryProviders from "./query.provider";
import GoogleAuthProvider from "./google-auth.provider";
import { ThemeProvider } from "./theme.provider";
import { LanguageProvider } from "./language.provider";
import { AuthProvider } from "./auth.provider";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <LanguageProvider>
        <AuthProvider>
          <GoogleAuthProvider>
            <QueryProviders>
              <TooltipProvider>
                {children}
              </TooltipProvider>
            </QueryProviders>
          </GoogleAuthProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
