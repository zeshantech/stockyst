"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { IconArrowRight } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/landing/page-header";
import { PageFooter } from "@/components/landing/page-footer";
import { FeaturesComponent } from "@/components/landing/features-component";
import {
  IconBarcode,
  IconTruck,
  IconReport,
  IconDashboard,
  IconAlertCircle,
  IconSettings,
} from "@tabler/icons-react";

// Extended features for the dedicated page
const extendedFeatures = [
  {
    icon: IconBarcode,
    title: "Barcode Scanning",
    description:
      "Quickly scan items in and out of inventory with built-in barcode support for mobile and desktop.",
    highlighted: true,
  },
  {
    icon: IconTruck,
    title: "Supply Chain Management",
    description:
      "Track orders, manage suppliers, and optimize your entire supply chain from a single dashboard.",
    highlighted: false,
  },
  {
    icon: IconReport,
    title: "Custom Reports",
    description:
      "Generate detailed reports and export data in multiple formats for analysis and sharing.",
    highlighted: false,
  },
  {
    icon: IconDashboard,
    title: "Customizable Dashboard",
    description:
      "Design your perfect workflow with drag-and-drop widgets and personalized views.",
    highlighted: true,
  },
  {
    icon: IconAlertCircle,
    title: "Stock Alerts",
    description:
      "Receive notifications when inventory levels fall below thresholds or when items need reordering.",
    highlighted: false,
  },
  {
    icon: IconSettings,
    title: "Workflow Automation",
    description:
      "Set up custom rules and automate repetitive tasks to save time and reduce errors.",
    highlighted: false,
  },
];

export default function FeaturesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <PageHeader />

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Powerful Features for Modern Inventory Management
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Discover how InvenTree helps businesses of all sizes streamline
                their inventory processes and boost efficiency.
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <Link href="/pricing">
                  <Button size="lg" className="gap-2">
                    View Pricing <IconArrowRight size={16} />
                  </Button>
                </Link>
                <Link href="/request-demo">
                  <Button variant="outline" size="lg">
                    Schedule Demo
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Core Features Section */}
        <FeaturesComponent />

        {/* Extended Features */}
        <FeaturesComponent
          title="Advanced Capabilities"
          subtitle="Take your inventory management to the next level with these powerful features."
          features={extendedFeatures}
          className="bg-muted/30"
        />

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-primary/10 rounded-2xl p-8 md:p-12 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:bg-[radial-gradient(#6b7280_1px,transparent_1px)]" />
              </div>

              <div className="relative z-10 text-center max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to transform your inventory management?
                </h2>
                <p className="text-lg md:text-xl mb-8">
                  Join thousands of businesses that trust InvenTree to manage
                  their inventory efficiently.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link href="/">
                    <Button size="lg" className="w-full sm:w-auto">
                      Start Free Trial
                    </Button>
                  </Link>
                  <Link href="/request-demo">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto"
                    >
                      Schedule Demo
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <PageFooter />
    </div>
  );
}
