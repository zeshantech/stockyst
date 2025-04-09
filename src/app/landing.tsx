"use client";

import * as React from "react";
import { BackgroundGradient } from "@/components/landing/background-gradient";
import { SiteHeader } from "@/components/landing/site-header";
import { HeroSection } from "@/components/landing/hero-section";
import { DashboardPreview } from "@/components/landing/dashboard-preview";
import { FeaturesSection } from "@/components/landing/features-section";
import { TestimonialSection } from "@/components/landing/testimonial-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { CTASection } from "@/components/landing/cta-section";
import { FAQSection } from "@/components/landing/faq-section";
import { SiteFooter } from "@/components/landing/site-footer";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Background Gradient */}
      <BackgroundGradient />

      {/* Header */}
      <SiteHeader />

      {/* Main Content */}
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <HeroSection />

        {/* Dashboard Preview */}
        <DashboardPreview />

        {/* Features Section */}
        <FeaturesSection />

        {/* Testimonial Section */}
        <TestimonialSection />

        {/* Pricing Section */}
        <PricingSection />

        {/* CTA Section */}
        <CTASection />

        {/* FAQ Section */}
        <FAQSection />
      </main>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}
