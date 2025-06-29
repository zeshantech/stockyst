"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { IconArrowRight, IconDeviceAnalytics, IconShield, IconUsers } from "@tabler/icons-react";
import { useClerk } from "@clerk/nextjs";

interface CTASectionProps {
  className?: string;
  title?: string;
  description?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonLink?: string;
}

export function CTASection({ className, title = "Ready to transform your inventory management?", description = "Join thousands of businesses that trust Stockyst to streamline their inventory processes. Get started today with our risk-free trial.", primaryButtonText = "Start Free Trial", secondaryButtonText = "Schedule Demo", secondaryButtonLink = "/request-demo" }: CTASectionProps) {
  const { openSignIn } = useClerk();

  return (
    <section className={cn("py-20 relative overflow-hidden", className)}>
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl opacity-50" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/20 rounded-full filter blur-3xl opacity-50" />
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-pattern" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left side: Content */}
          <div className="lg:col-span-7">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="rounded-2xl border border-border bg-card p-8 md:p-12 relative overflow-hidden">
              {/* Badge */}
              <div className="inline-flex items-center rounded-full border border-border bg-background px-4 py-1 text-sm mb-8">
                <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
                <span className="text-foreground font-medium">Limited Time Offer</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold mb-4 max-w-xl">{title}</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl">{description}</p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button size="lg" className="group" onClick={() => openSignIn()}>
                  {primaryButtonText}
                  <IconArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button href={secondaryButtonLink} size="lg" variant="outline">
                  {secondaryButtonText}
                </Button>
              </div>

              {/* Stats or testimonial */}
              <div className="flex flex-col sm:flex-row gap-6 mt-8 pt-8 border-t border-border">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary rounded-lg p-2">
                    <IconUsers className="size-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">5,000+</p>
                    <p className="text-sm text-muted-foreground">Active Users</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary rounded-lg p-2">
                    <IconDeviceAnalytics className="size-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">99.9%</p>
                    <p className="text-sm text-muted-foreground">Uptime</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary rounded-lg p-2">
                    <IconShield className="size-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">ISO 27001</p>
                    <p className="text-sm text-muted-foreground">Certified</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right side: Social proof */}
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }} className="lg:col-span-5">
            <div className="rounded-2xl border border-border bg-card p-8 md:p-10">
              <h3 className="text-xl font-semibold mb-6">Trusted by industry leaders</h3>

              {/* Logos grid */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="flex items-center justify-center p-4 bg-muted/30 rounded-lg h-16">
                    <div className="w-full h-4 bg-muted/70 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>

              {/* Testimonial */}
              <div className="relative">
                <div className="absolute -top-4 -left-2 text-primary/20 text-6xl">"</div>
                <blockquote className="relative z-10 px-2">
                  <p className="text-muted-foreground italic mb-4">Stockyst has transformed our warehouse operations, reducing errors by 78% and saving us countless hours of manual work.</p>
                  <footer className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-full"></div>
                    <div>
                      <p className="font-medium">Sarah Johnson</p>
                      <p className="text-sm text-muted-foreground">Operations Director, TechSupply Inc.</p>
                    </div>
                  </footer>
                </blockquote>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
