"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  IconBarcode,
  IconTruck,
  IconReport,
  IconDashboard,
  IconAlertCircle,
  IconSettings,
  IconDeviceAnalytics,
  IconChartBar,
  IconCloudUpload,
  IconShield,
  IconRotate,
  IconDeviceLaptop,
  IconUsers,
  IconApi,
  IconDeviceMobile,
  IconBrandApple,
  IconBrandAndroid,
  IconBrandWindows,
} from "@tabler/icons-react";

// Core features that define the product
const coreFeatures = [
  {
    icon: IconDeviceAnalytics,
    title: "Real-time Analytics",
    description:
      "Get instant insights into your inventory with powerful real-time dashboards and custom reports.",
    benefits: [
      "Track stock levels in real-time across locations",
      "Visualize sales trends and inventory forecasts",
      "Custom reports with exportable data",
      "Automated low-stock alerts and notifications",
    ],
    highlighted: true,
  },
  {
    icon: IconTruck,
    title: "Supply Chain Management",
    description:
      "Streamline your supply chain with automated ordering, supplier management, and fulfillment tracking.",
    benefits: [
      "Automated purchase orders when stock runs low",
      "Supplier management and performance tracking",
      "Delivery scheduling and shipment tracking",
      "Cost optimization and inventory forecasting",
    ],
    highlighted: false,
  },
  {
    icon: IconBarcode,
    title: "Barcode & RFID Support",
    description:
      "Scan and track items with ease using integrated barcode and RFID technology on any device.",
    benefits: [
      "Instant scanning with mobile device cameras",
      "Support for 1D/2D barcodes and QR codes",
      "RFID integration for bulk scanning",
      "Batch processing for rapid inventory counts",
    ],
    highlighted: true,
  },
];

// Extended features for different aspects of the system
const extendedFeatures = {
  automation: [
    {
      icon: IconRotate,
      title: "Automated Reordering",
      description:
        "Set up automatic reordering when stock levels reach your defined thresholds.",
    },
    {
      icon: IconSettings,
      title: "Workflow Automation",
      description:
        "Set up custom rules and automate repetitive tasks to save time and reduce errors.",
    },
    {
      icon: IconAlertCircle,
      title: "Smart Alerts",
      description:
        "Receive notifications when inventory levels fall below thresholds or when items need attention.",
    },
  ],
  reporting: [
    {
      icon: IconReport,
      title: "Custom Reports",
      description:
        "Generate detailed reports and export data in multiple formats for analysis and sharing.",
    },
    {
      icon: IconChartBar,
      title: "Advanced Analytics",
      description:
        "Gain deep insights into your inventory performance with advanced analytics tools.",
    },
    {
      icon: IconDashboard,
      title: "Customizable Dashboard",
      description:
        "Design your perfect workflow with drag-and-drop widgets and personalized views.",
    },
  ],
  security: [
    {
      icon: IconShield,
      title: "Enterprise Security",
      description:
        "Rest easy with enterprise-grade security features and role-based access control.",
    },
    {
      icon: IconCloudUpload,
      title: "Cloud-Based Solution",
      description:
        "Access your data securely from anywhere with our reliable cloud infrastructure.",
    },
    {
      icon: IconUsers,
      title: "Team Collaboration",
      description:
        "Work together seamlessly with role-based access controls and real-time updates.",
    },
  ],
  integration: [
    {
      icon: IconApi,
      title: "API Access",
      description:
        "Integrate with your existing tools and systems using our comprehensive API.",
    },
    {
      icon: IconDeviceLaptop,
      title: "Cross-Platform",
      description:
        "Access your inventory from any device with our web-based interface.",
    },
    {
      icon: IconDeviceMobile,
      title: "Mobile Apps",
      description:
        "Native mobile apps for iOS and Android with barcode scanning capabilities.",
    },
  ],
};

// Platform support badges
const platformSupport = [
  {
    icon: IconBrandApple,
    label: "iOS App",
  },
  {
    icon: IconBrandAndroid,
    label: "Android App",
  },
  {
    icon: IconBrandWindows,
    label: "Windows App",
  },
  {
    icon: IconDeviceLaptop,
    label: "Web App",
  },
];

function FeatureCard({
  icon: Icon,
  title,
  description,
  benefits,
  highlighted = false,
  delay = 0,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  benefits?: string[];
  highlighted?: boolean;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="relative"
    >
      <Card
        className={cn(
          "h-full overflow-hidden transition-all hover:shadow-lg",
          highlighted ? "border-primary shadow-md" : ""
        )}
      >
        <CardHeader className="pb-4">
          <div
            className={cn(
              "w-12 h-12 rounded-lg flex items-center justify-center mb-4",
              highlighted
                ? "bg-primary/20 text-primary"
                : "bg-muted text-foreground"
            )}
          >
            <Icon className="h-6 w-6" />
          </div>
          <CardTitle className="text-xl text-foreground mb-2">
            {title}
          </CardTitle>
          <p className="text-muted-foreground">{description}</p>
        </CardHeader>
        {benefits && (
          <CardContent>
            <ul className="space-y-2">
              {benefits.map((benefit, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: delay + index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-2 text-sm"
                >
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
                </motion.li>
              ))}
            </ul>
          </CardContent>
        )}
      </Card>
    </motion.div>
  );
}

function CompactFeatureCard({
  icon: Icon,
  title,
  description,
  delay = 0,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <Card className="h-full hover:shadow-md transition-all">
        <CardHeader>
          <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
            <Icon className="h-5 w-5" />
          </div>
          <CardTitle className="text-lg mb-2">{title}</CardTitle>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardHeader>
      </Card>
    </motion.div>
  );
}

export function ClientFeatures() {
  return (
    <section className="py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <Badge className="mb-4" variant="secondary">
            Features
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            Everything You Need for Modern Inventory Management
          </h1>
          <p className="text-xl text-muted-foreground">
            InvenTree combines powerful features with intuitive design to create
            the most effective inventory management system available.
          </p>
        </motion.div>

        {/* Core Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {coreFeatures.map((feature, index) => (
            <FeatureCard key={index} {...feature} delay={index * 0.2} />
          ))}
        </div>

        {/* Platform Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-24"
        >
          {platformSupport.map((platform, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 bg-muted/50 text-muted-foreground rounded-full px-4 py-2"
            >
              <platform.icon className="h-4 w-4" />
              <span className="text-sm font-medium">{platform.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Extended Features */}
        <div className="bg-muted/30 rounded-3xl p-8 mb-24">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Powerful Features for Every Need
            </h2>
            <p className="text-lg text-muted-foreground">
              Discover all the tools and features that make InvenTree the
              perfect solution for your inventory management needs.
            </p>
          </div>

          <Tabs defaultValue="automation" className="w-full">
            <TabsList className="w-full justify-start mb-8 bg-transparent">
              <TabsTrigger value="automation">Automation</TabsTrigger>
              <TabsTrigger value="reporting">Reporting</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="integration">Integration</TabsTrigger>
            </TabsList>
            {(
              Object.keys(extendedFeatures) as Array<
                keyof typeof extendedFeatures
              >
            ).map((category) => (
              <TabsContent key={category} value={category}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {extendedFeatures[category].map((feature, index) => (
                    <CompactFeatureCard
                      key={index}
                      {...feature}
                      delay={index * 0.1}
                    />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-6">
            Ready to Transform Your Inventory Management?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="min-w-[200px]">
              Get Started
            </Button>
            <Button size="lg" variant="outline" className="min-w-[200px]">
              Schedule Demo
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
