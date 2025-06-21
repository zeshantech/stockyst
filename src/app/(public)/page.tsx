"use client";

import * as React from "react";
import { BackgroundGradient } from "@/components/(public)/background-gradient";
import { SiteHeader } from "@/components/(public)/site-header";
import { HeroSection } from "@/components/(public)/hero-section";
import { DashboardPreview } from "@/components/(public)/dashboard-preview";
import { FeaturesSection   } from "@/components/(public)/features-section";
import { TestimonialSection } from "@/components/(public)/testimonial-section";
import { CTASection } from "@/components/(public)/cta-section";
import { FAQSection } from "@/components/(public)/faq-section";
import { SiteFooter } from "@/components/(public)/site-footer";
import { SubscriptionManager } from "@/components/subscription/subscription-manager";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const [apiResponse, setApiResponse] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const callApi = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/call-external-api', {
        method: 'GET',
      });
      
      if (!response.ok) {
        throw new Error('Failed to call API');
      }
      
      const data = await response.json();
      setApiResponse(data);
      console.log(data);
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Background Gradient */}
      <BackgroundGradient />

      {/* Header */}
      <SiteHeader />

      {/* Main Content */}
      <main className="flex-grow pt-16">
        <Button 
          onClick={callApi} 
          disabled={isLoading}
          className="mb-4 mx-auto block"
        >
          {isLoading ? 'Calling API...' : 'Call API'}
        </Button>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {apiResponse && (
          <div className="bg-muted p-4 rounded-md mb-4 mx-auto max-w-md">
            <pre className="text-sm overflow-auto">{JSON.stringify(apiResponse, null, 2)}</pre>
          </div>
        )}
        
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
