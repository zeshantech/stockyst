"use client";

import { motion } from "framer-motion";
import {
  IconHeartHandshake,
  IconTargetArrow,
  IconStar,
  IconChartBar,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const defaultTeamMembers = [
  {
    name: "Zeshan Shakil",
    role: "Software Engineer",
    bio: "Passionate software engineer and inventory management specialist developing innovative solutions for businesses of all sizes.",
    image: "/zeshan.jpeg",
  },
];

const defaultCompanyValues = [
  {
    title: "Customer-First",
    description:
      "We build software that solves real problems for real businesses.",
    icon: IconHeartHandshake,
  },
  {
    title: "Innovative Thinking",
    description:
      "We continuously seek better ways to manage inventory challenges.",
    icon: IconTargetArrow,
  },
  {
    title: "Simplicity",
    description: "We make complex inventory management simple and accessible.",
    icon: IconStar,
  },
  {
    title: "Data-Driven",
    description:
      "We believe in making decisions based on data and measurable results.",
    icon: IconChartBar,
  },
];

interface AboutComponentProps {
  title?: string;
  subtitle?: string;
  yearFounded?: number;
  teamMembers?: Array<{
    name: string;
    role: string;
    bio: string;
    image: string;
  }>;
  companyValues?: Array<{
    title: string;
    description: string;
    icon: React.ElementType;
  }>;
  className?: string;
  showCompanyStory?: boolean;
  showTeam?: boolean;
  showValues?: boolean;
}

export function AboutComponent({
  title = "Simplifying inventory management since 2021",
  subtitle = "InvenTree is built to make inventory management accessible to businesses of all sizes, helping them optimize operations and drive growth without complexity.",
  yearFounded = 2021,
  teamMembers = defaultTeamMembers,
  companyValues = defaultCompanyValues,
  className = "",
  showCompanyStory = true,
  showTeam = true,
  showValues = true,
}: AboutComponentProps) {
  const currentYear = new Date().getFullYear();
  const yearsInBusiness = currentYear - yearFounded;

  return (
    <div className={className}>
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="mb-4">Our Story</Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                {title}
              </h1>
              <p className="text-xl text-muted-foreground mb-8">{subtitle}</p>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full border-2 border-background overflow-hidden">
                  <img
                    src="/zeshan.jpeg"
                    alt="Zeshan Shakil"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-muted-foreground">
                  Created by{" "}
                  <span className="text-primary font-medium">
                    Zeshan Shakil
                  </span>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-video bg-muted rounded-xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1553413077-190dd305871c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                  alt="Inventory management"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      {showCompanyStory && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="relative rounded-xl overflow-hidden"
              >
                <img
                  src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80"
                  alt="Inventory system"
                  className="w-full h-full object-cover aspect-video"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold mb-6 text-foreground">
                  Our Story
                </h2>
                <div className="space-y-4 text-lg text-muted-foreground">
                  <p>
                    InvenTree was founded in {yearFounded} by Zeshan Shakil, who
                    experienced firsthand the challenges of inventory management
                    while working with businesses of various sizes.
                  </p>
                  <p>
                    After noticing that existing solutions were either too
                    complex and expensive for small businesses or too simplistic
                    for growing companies with complex needs, Zeshan was
                    inspired to create a scalable platform that could grow with
                    businesses at any stage.
                  </p>
                  <p>
                    Starting with a passion for solving real-world problems,
                    InvenTree was developed to create an intuitive user
                    experience without sacrificing powerful functionality.
                  </p>
                  <p>
                    Today, after {yearsInBusiness} years of continuous
                    development and improvement, InvenTree helps businesses
                    worldwide streamline their inventory processes with a focus
                    on simplicity, power, and flexibility.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Company Values */}
      {showValues && (
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge className="mb-4">Our Values</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                What drives us
              </h2>
              <p className="text-lg text-muted-foreground">
                These core principles guide everything we do, from product
                development to customer relationships.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {companyValues.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                        <value.icon className="size-6 text-primary" />
                      </div>
                      <CardTitle>{value.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Team Section */}
      {showTeam && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge className="mb-4">Meet the Creator</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                The Mind Behind InvenTree
              </h2>
              <p className="text-lg text-muted-foreground">
                InvenTree was created with passion to solve real-world inventory
                management challenges.
              </p>
            </div>

            <div className="flex justify-center">
              {teamMembers.map(
                (
                  member: {
                    name: string;
                    role: string;
                    bio: string;
                    image: string;
                  },
                  index: number
                ) => (
                  <motion.div
                    key={member.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="max-w-md"
                  >
                    <Card className="h-full overflow-hidden">
                      <div className="aspect-square overflow-hidden">
                        <img
                          src="/zeshan.jpeg"
                          alt={member.name}
                          className="w-full h-full object-cover transition-transform hover:scale-105"
                        />
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{member.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {member.role}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-sm">
                          {member.bio}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
