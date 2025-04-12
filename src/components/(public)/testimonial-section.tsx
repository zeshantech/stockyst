"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { IconStar, IconStarFilled, IconQuote } from "@tabler/icons-react";

// TestimonialCard Component
interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar?: string;
  highlighted?: boolean;
  delay?: number;
  colorScheme?: "primary" | "secondary" | "accent" | "muted" | "destructive";
}

function TestimonialCard({
  quote,
  author,
  role,
  company,
  avatar,
  highlighted = false,
  delay = 0,
  colorScheme = "primary",
}: TestimonialCardProps) {
  // Color mapping based on the colorScheme prop and CSS variables
  const colors = {
    primary: {
      bg: "bg-primary/20",
      text: "text-primary",
      border: "border-primary/30",
      shadow: "shadow-primary/10",
      highlight: "from-primary/5 to-background",
      starFill: "text-primary",
      starEmpty: "text-primary/20",
    },
    secondary: {
      bg: "bg-secondary/20",
      text: "text-secondary-foreground",
      border: "border-secondary/30",
      shadow: "shadow-secondary/10",
      highlight: "from-secondary/10 to-background",
      starFill: "text-secondary",
      starEmpty: "text-secondary/20",
    },
    accent: {
      bg: "bg-accent/20",
      text: "text-accent-foreground",
      border: "border-accent/30",
      shadow: "shadow-accent/10",
      highlight: "from-accent/10 to-background",
      starFill: "text-accent-foreground",
      starEmpty: "text-accent-foreground/20",
    },
    muted: {
      bg: "bg-muted/50",
      text: "text-muted-foreground",
      border: "border-muted/50",
      shadow: "shadow-muted/10",
      highlight: "from-muted/20 to-background",
      starFill: "text-muted-foreground",
      starEmpty: "text-muted-foreground/20",
    },
    destructive: {
      bg: "bg-destructive/10",
      text: "text-destructive",
      border: "border-destructive/20",
      shadow: "shadow-destructive/5",
      highlight: "from-destructive/5 to-background",
      starFill: "text-destructive",
      starEmpty: "text-destructive/20",
    },
  };

  const colorClasses = colors[colorScheme];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
    >
      <Card
        className={cn(
          "h-full overflow-hidden transition-all",
          highlighted
            ? cn(
                `border-${
                  colorScheme === "primary" ? "primary/40" : colorScheme
                }/30 shadow-md`,
                colorClasses.shadow
              )
            : "border-border hover:border-border/80 hover:shadow-sm"
        )}
      >
        <CardHeader
          className={cn(
            "pb-0",
            highlighted ? `bg-gradient-to-br ${colorClasses.highlight}` : ""
          )}
        >
          <div className="flex items-center mb-3">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star}>
                  {star <= 5 ? (
                    <IconStarFilled
                      className={cn("size-4", colorClasses.starFill)}
                    />
                  ) : (
                    <IconStar
                      className={cn("size-4", colorClasses.starEmpty)}
                    />
                  )}
                </span>
              ))}
            </div>
          </div>
          <div className="relative">
            <IconQuote
              className={cn(
                "h-8 w-8 absolute -top-4 -left-2 opacity-10",
                colorClasses.text
              )}
            />
            <p className="text-foreground mb-6 italic relative">{quote}</p>
          </div>
        </CardHeader>
        <CardContent
          className={cn(
            "pt-4 flex items-center gap-3",
            highlighted ? `bg-gradient-to-br ${colorClasses.highlight}` : ""
          )}
        >
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold",
              colorClasses.bg,
              colorClasses.text
            )}
          >
            {avatar ? (
              <img
                src={avatar}
                alt={author}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              author.substring(0, 2).toUpperCase()
            )}
          </div>
          <div>
            <div className="font-medium text-sm">{author}</div>
            <div className="text-xs text-muted-foreground">
              {role}, {company}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function TestimonialSection() {
  const testimonials = [
    {
      quote:
        "InvenTree has revolutionized how we manage our warehouse. Stock levels are always accurate, and we've reduced order processing time by 35%.",
      author: "Sarah Johnson",
      role: "Operations Manager",
      company: "TechSupply Co.",
      colorScheme: "primary" as const,
      highlighted: true,
    },
    {
      quote:
        "The dashboard gives me instant visibility into our entire inventory. I can make decisions faster with real-time data at my fingertips.",
      author: "Michael Chen",
      role: "Inventory Specialist",
      company: "Horizon Electronics",
      colorScheme: "secondary" as const,
    },
    {
      quote:
        "We've eliminated stockouts completely since implementing InvenTree. The automated reordering has been a game-changer for our business.",
      author: "Jessica Williams",
      role: "Supply Chain Director",
      company: "GreenPath Manufacturing",
      colorScheme: "accent" as const,
    },
    {
      quote:
        "The mobile app lets me check stock levels from anywhere. Perfect for our team who's always on the move between locations.",
      author: "Daniel Rodriguez",
      role: "Warehouse Supervisor",
      company: "Velocity Logistics",
      colorScheme: "destructive" as const,
    },
    {
      quote:
        "Integration with our e-commerce platform was seamless. Now our online and offline inventory is always in perfect sync.",
      author: "Rachel Thompson",
      role: "E-commerce Manager",
      company: "Urban Retail Group",
      colorScheme: "primary" as const,
      highlighted: true,
    },
    {
      quote:
        "Customer support is outstanding. Any question we've had has been answered quickly, making our transition to InvenTree smooth.",
      author: "Thomas Clark",
      role: "IT Director",
      company: "Pinnacle Solutions",
      colorScheme: "secondary" as const,
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary mb-4"
          >
            Customer Stories
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4 text-foreground"
          >
            Trusted by businesses worldwide
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-muted-foreground"
          >
            See how companies of all sizes use InvenTree to transform their
            inventory management
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              quote={testimonial.quote}
              author={testimonial.author}
              role={testimonial.role}
              company={testimonial.company}
              highlighted={testimonial.highlighted}
              delay={0.3 + index * 0.1}
              colorScheme={testimonial.colorScheme}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
