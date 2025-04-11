"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  IconChartBar,
  IconCloudUpload,
  IconShield,
  IconRotate,
  IconDeviceLaptop,
  IconUsers,
} from "@tabler/icons-react";

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  highlighted?: boolean;
  delay?: number;
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  highlighted = false,
  delay = 0,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <Card
        className={cn(
          "h-full overflow-hidden transition-all hover:shadow-md",
          highlighted ? "border-primary shadow" : ""
        )}
      >
        <CardHeader className="pb-2">
          <div
            className={cn(
              "w-12 h-12 rounded-lg flex items-center justify-center",
              highlighted
                ? "bg-primary/20 text-primary"
                : "bg-muted text-foreground"
            )}
          >
            <Icon className="size-6" />
          </div>
          <CardTitle className="mt-4 text-foreground">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

const defaultFeatures = [
  {
    icon: IconChartBar,
    title: "Real-time Analytics",
    description:
      "Get instant insights into your inventory with powerful analytics and customizable dashboards.",
    highlighted: false,
  },
  {
    icon: IconCloudUpload,
    title: "Cloud-Based Solution",
    description:
      "Access your inventory from anywhere, on any device, with our secure cloud platform.",
    highlighted: true,
  },
  {
    icon: IconShield,
    title: "Secure Data Storage",
    description:
      "Rest easy knowing your data is protected with enterprise-grade security protocols.",
    highlighted: false,
  },
  {
    icon: IconRotate,
    title: "Automated Reordering",
    description:
      "Set up automatic reordering when stock levels reach your defined thresholds.",
    highlighted: false,
  },
  {
    icon: IconDeviceLaptop,
    title: "Multi-platform Access",
    description:
      "Mobile and desktop apps that keep you connected to your inventory on any device.",
    highlighted: true,
  },
  {
    icon: IconUsers,
    title: "Team Collaboration",
    description:
      "Work together with role-based access controls and real-time updates.",
    highlighted: false,
  },
];

interface FeaturesComponentProps {
  title?: string;
  subtitle?: string;
  features?: Array<{
    icon: React.ElementType;
    title: string;
    description: string;
    highlighted?: boolean;
  }>;
  className?: string;
}

export function FeaturesComponent({
  title = "Everything you need to manage inventory",
  subtitle = "Our platform brings all your inventory management needs into one place, with powerful features designed for growing businesses.",
  features = defaultFeatures,
  className,
}: FeaturesComponentProps) {
  return (
    <section className={cn("py-20", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4 text-foreground"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            {title}
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            {subtitle}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              highlighted={feature.highlighted}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
