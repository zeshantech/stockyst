"use client";

export function FAQSection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently asked questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Get answers to common questions about InvenTree's platform and
            services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="space-y-2">
            <h3 className="text-xl font-medium">
              How easy is it to get started?
            </h3>
            <p className="text-muted-foreground">
              Getting started with InvenTree is simple. Our guided setup process
              will have you up and running in minutes, with optional data import
              tools to bring in your existing inventory records.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-medium">
              Can I integrate with my existing tools?
            </h3>
            <p className="text-muted-foreground">
              Yes! InvenTree integrates with popular e-commerce platforms,
              accounting software, and shipping providers. Our API also allows
              for custom integrations with your unique tech stack.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-medium">
              Is there a free trial available?
            </h3>
            <p className="text-muted-foreground">
              Absolutely. We offer a 14-day free trial on all plans with no
              credit card required. Experience the full platform before making a
              commitment.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-medium">How secure is my data?</h3>
            <p className="text-muted-foreground">
              We take security seriously. InvenTree uses enterprise-grade
              encryption, regular security audits, and follows industry best
              practices to keep your data safe and secure.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
