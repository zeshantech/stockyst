"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  IconDeviceAnalytics,
  IconTruckDelivery,
  IconBarcode,
  IconDeviceDesktop,
  IconDeviceMobile,
  IconBrandApple,
  IconBrandAndroid,
  IconBrandWindows,
  IconReportAnalytics,
  IconUsers,
  IconApi,
  IconChartBar,
} from "@tabler/icons-react";

interface FeatureTabProps {
  title: string;
  description: string;
  icon: React.ElementType;
  image: string;
  benefits: string[];
}

const features: FeatureTabProps[] = [
  {
    title: "Real-time Analytics",
    description:
      "Get instant insights into your inventory with powerful real-time dashboards and custom reports.",
    icon: IconDeviceAnalytics,
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    benefits: [
      "Track stock levels in real-time across locations",
      "Visualize sales trends and inventory forecasts",
      "Custom reports with exportable data",
      "Automated low-stock alerts and notifications",
    ],
  },
  {
    title: "Supply Chain Management",
    description:
      "Streamline your supply chain with automated ordering, supplier management, and fulfillment tracking.",
    icon: IconTruckDelivery,
    image:
      "https://images.unsplash.com/photo-1566232392379-b3af689e08ed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    benefits: [
      "Automated purchase orders when stock runs low",
      "Supplier management and performance tracking",
      "Delivery scheduling and shipment tracking",
      "Cost optimization and inventory forecasting",
    ],
  },
  {
    title: "Barcode & RFID Support",
    description:
      "Scan and track items with ease using integrated barcode and RFID technology on any device.",
    icon: IconBarcode,
    image:
      "https://images.unsplash.com/photo-1515630278258-407f66498ffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    benefits: [
      "Instant scanning with mobile device cameras",
      "Support for 1D/2D barcodes and QR codes",
      "RFID integration for bulk scanning",
      "Batch processing for rapid inventory counts",
    ],
  },
  {
    title: "Multi-platform Access",
    description:
      "Access your inventory system from anywhere on any device with our cross-platform apps.",
    icon: IconDeviceDesktop,
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    benefits: [
      "Responsive web interface for desktop and tablets",
      "Native mobile apps for iOS and Android",
      "Offline capability with automatic syncing",
      "Desktop applications for Windows and macOS",
    ],
  },
];

interface FeaturesSectionProps {
  className?: string;
}

export function FeaturesSection({ className }: FeaturesSectionProps) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className={cn("py-20 overflow-hidden", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need for
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 ml-2">
                Modern Inventory
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              InvenTree combines powerful features and intuitive design to
              create the most effective inventory management system available.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Feature tabs navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-4 space-y-2"
          >
            {features.map((feature, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={cn(
                  "w-full text-left p-4 rounded-lg transition-all duration-200 flex items-start gap-4 border",
                  activeTab === index
                    ? "bg-primary/5 border-primary/20 shadow-sm"
                    : "hover:bg-muted border-transparent"
                )}
              >
                <div
                  className={cn(
                    "rounded-lg p-2 mt-1",
                    activeTab === index
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <feature.icon className="size-5" />
                </div>
                <div>
                  <h3
                    className={cn(
                      "font-medium",
                      activeTab === index
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className={cn(
                      "text-sm line-clamp-2 mt-1",
                      activeTab === index
                        ? "text-muted-foreground"
                        : "text-muted-foreground/70"
                    )}
                  >
                    {feature.description}
                  </p>
                </div>
              </button>
            ))}

            <div className="mt-6 ml-4">
              <Button
                variant="link"
                className="gap-1 p-0 h-auto font-normal"
                href="/features"
              >
                View all features
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-1 size-3"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Button>
            </div>
          </motion.div>

          {/* Feature content display */}
          <div className="lg:col-span-8 relative">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{
                  opacity: activeTab === index ? 1 : 0,
                  y: activeTab === index ? 0 : 20,
                  scale: activeTab === index ? 1 : 0.95,
                }}
                transition={{ duration: 0.4 }}
                className={cn(
                  "absolute inset-0 w-full",
                  activeTab === index ? "relative" : "pointer-events-none"
                )}
              >
                <div className="bg-muted/30 rounded-xl border border-border overflow-hidden">
                  <div className="relative h-60 md:h-80 overflow-hidden">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                  </div>

                  <div className="p-6 md:p-8">
                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <feature.icon className="size-6 text-primary" />
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {feature.description}
                    </p>

                    <h4 className="font-medium mb-3">Key Benefits:</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {feature.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-primary mt-0.5"
                          >
                            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                            <path d="m9 12 2 2 4-4" />
                          </svg>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Additional features grid */}
        <div className="mt-20">
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold mb-8 text-center"
          >
            More Powerful Features
          </motion.h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: IconDeviceMobile,
                title: "Mobile App",
                desc: "Manage inventory on the go with our mobile app",
              },
              {
                icon: IconReportAnalytics,
                title: "Custom Reports",
                desc: "Generate detailed reports and export data",
              },
              {
                icon: IconUsers,
                title: "Team Collaboration",
                desc: "Multi-user access with permission controls",
              },
              {
                icon: IconApi,
                title: "API Access",
                desc: "Connect with other tools via our developer API",
              },
              {
                icon: IconBrandAndroid,
                title: "Android Support",
                desc: "Native Android app for mobile scanning",
              },
              {
                icon: IconBrandApple,
                title: "iOS Support",
                desc: "Native iOS app with barcode scanning",
              },
              {
                icon: IconBrandWindows,
                title: "Desktop Apps",
                desc: "Native apps for Windows and macOS",
              },
              {
                icon: IconChartBar,
                title: "Analytics & Insights",
                desc: "Advanced data analysis and tracking",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
              >
                <div className="bg-card rounded-lg border border-border p-5 h-full">
                  <div className="bg-primary/10 text-primary rounded-lg p-2 inline-flex mb-3">
                    <item.icon className="size-5" />
                  </div>
                  <h4 className="font-medium mb-2">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
