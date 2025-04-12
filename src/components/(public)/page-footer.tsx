"use client";

import Link from "next/link";
import { IconBox } from "@tabler/icons-react";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PageFooter() {
  const { theme, setTheme } = useTheme();

  return (
    <footer className="bg-muted/30 border-t border-border py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Link href="/" className="flex items-center">
              <IconBox className="size-6 text-primary" />
              <span className="ml-2 text-lg font-bold text-foreground">
                InvenTree
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <SunIcon className="size-5" />
              ) : (
                <MoonIcon className="size-5" />
              )}
            </Button>
          </div>

          <div className="flex flex-wrap gap-6">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Home
            </Link>
            <Link
              href="/features"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              About
            </Link>
            <Link
              href="/request-demo"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Schedule Demo
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
