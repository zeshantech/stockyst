"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  IconBrandGithub,
  IconBrandTwitter,
  IconBrandDiscord,
  IconBrandLinkedin,
  IconArrowRight,
} from "@tabler/icons-react";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

export function SiteFooter() {
  const { theme, setTheme } = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div className="py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-3 text-foreground">
                Stay updated
              </h3>
              <p className="text-muted-foreground mb-2">
                Get notified about new features and updates.
              </p>
            </div>
            <div>
              <div className="flex gap-2 w-full max-w-md">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1"
                />
                <Button>
                  Subscribe
                  <IconArrowRight size={16} className="ml-2" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                By subscribing, you agree to our Privacy Policy.
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Main Footer Links */}
        <div className="py-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <div className="font-bold text-xl text-foreground">InvenTree</div>
            </Link>
            <p className="text-sm text-muted-foreground">
              Powerful inventory management solution for businesses of all
              sizes.
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-4 text-foreground">Product</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/features"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/integrations"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Integrations
                </Link>
              </li>
              <li>
                <Link
                  href="/changelog"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Changelog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4 text-foreground">Resources</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/docs"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="/api"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  API
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/guides"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Guides
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4 text-foreground">Company</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  About
                </Link>
              </li>

              <li>
                <Link
                  href="/careers"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/partners"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Partners
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4 text-foreground">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cookies
                </Link>
              </li>
              <li>
                <Link
                  href="/licenses"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Licenses
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator />

        {/* Bottom Footer */}
        <div className="py-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-muted-foreground mb-4 md:mb-0">
            © {currentYear} InvenTree. All rights reserved.
          </div>

          <div className="flex space-x-4 items-center">
            <div className="flex border border-border items-center rounded-full p-0.5 gap-1">
              <Button
                size={"iconSm"}
                variant={"ghost"}
                className="rounded-full"
                onClick={() => setTheme("light")}
              >
                <SunIcon />
              </Button>
              <Button
                size={"iconSm"}
                variant={"ghost"}
                className="rounded-full"
                onClick={() => setTheme("dark")}
              >
                <MoonIcon />
              </Button>
            </div>
            <Link
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-accent transition-colors text-foreground"
            >
              <IconBrandTwitter size={20} />
            </Link>
            <Link
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-accent transition-colors text-foreground"
            >
              <IconBrandGithub size={20} />
            </Link>
            <Link
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Discord"
              className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-accent transition-colors text-foreground"
            >
              <IconBrandDiscord size={20} />
            </Link>
            <Link
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-accent transition-colors text-foreground"
            >
              <IconBrandLinkedin size={20} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
