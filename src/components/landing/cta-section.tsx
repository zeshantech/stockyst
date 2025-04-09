"use client";

import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-16 bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to transform your inventory management?
        </h2>
        <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
          Join thousands of businesses that have simplified their inventory
          processes with InvenTree.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            size="lg"
            variant="secondary"
            className="text-primary font-medium"
          >
            Start Your Free Trial
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white/10"
          >
            Schedule a Demo
          </Button>
        </div>
      </div>
    </section>
  );
}
