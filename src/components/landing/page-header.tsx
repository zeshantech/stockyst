"use client";

import Link from "next/link";
import { IconBox, IconCalendar } from "@tabler/icons-react";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

interface PageHeaderProps {
  showBackToHome?: boolean;
}

export function PageHeader({ showBackToHome = true }: PageHeaderProps) {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  // Navigation items
  const navItems = [
    { name: "Features", href: "/features" },
    { name: "Pricing", href: "/pricing" },
    { name: "About", href: "/about" },
  ];

  // Check if we're on the homepage
  const isHomePage = pathname === "/";

  return (
    <header className="border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-12">
            <Link href="/" className="flex items-center">
              <IconBox className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-foreground">
                InvenTree
              </span>
            </Link>

            {/* Navigation Menu - Hidden on mobile */}
            <nav className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
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

            {showBackToHome && !isHomePage ? (
              <Link
                href="/"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Back to Home
              </Link>
            ) : (
              <Link href="/request-demo">
                <Button
                  variant="default"
                  size="sm"
                  className="flex items-center gap-1.5"
                >
                  <IconCalendar className="size-4" />
                  Schedule Demo
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
