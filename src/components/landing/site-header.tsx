"use client";

import Link from "next/link";
import { IconBox, IconMenu2 } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "lucide-react";

export function SiteHeader() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <IconBox className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-foreground">
                InvenTree
              </span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/features"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              About
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hidden md:flex"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <SunIcon className="size-5" />
              ) : (
                <MoonIcon className="size-5" />
              )}
            </Button>
            <Link href="/h" className="hidden md:inline-flex">
              <Button variant="outline" size="sm">
                Log In
              </Button>
            </Link>
            <Link href="/h" className="hidden md:inline-flex">
              <Button size="sm">Sign Up</Button>
            </Link>
            <button className="md:hidden text-foreground">
              <IconMenu2 className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
