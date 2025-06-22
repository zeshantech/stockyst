import * as React from "react";
import { BackgroundGradient } from "@/components/(public)/background-gradient";
import { SiteHeader } from "@/components/(public)/site-header";
import { HeroSection } from "@/components/(public)/hero-section";
import { DashboardPreview } from "@/components/(public)/dashboard-preview";
import { FeaturesSection } from "@/components/(public)/features-section";
import { TestimonialSection } from "@/components/(public)/testimonial-section";
import { CTASection } from "@/components/(public)/cta-section";
import { FAQSection } from "@/components/(public)/faq-section";
import { SiteFooter } from "@/components/(public)/site-footer";
import { SubscriptionManager } from "@/components/subscription/subscription-manager";

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
        <section className="py-20 bg-gradient-to-b from-background to-muted/50">
          <SubscriptionManager showTitle={true} />
        </section>

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
