"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  IconBox,
  IconChevronRight,
  IconArrowRight,
  IconDevices,
  IconCloudUpload,
  IconShieldCheck,
} from "@tabler/icons-react";

interface HeroSectionProps {
  className?: string;
}

export function HeroSection({ className = "" }: HeroSectionProps) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section
      className={`relative overflow-hidden bg-gradient-to-b from-background to-muted/30 pt-24 pb-16 ${className}`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(#3a3a3a_1px,transparent_1px)] [background-size:20px_20px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content Column */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="text-center lg:text-left"
          >
            <motion.div
              variants={item}
              className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 mb-6"
            >
              <span className="text-xs font-medium text-primary">
                New Release
              </span>
              <div className="mx-2 h-4 w-px bg-primary/20" />
              <span className="text-xs text-primary">Free tier available</span>
              <IconChevronRight className="ml-2 h-3.5 w-3.5 text-primary" />
            </motion.div>

            <motion.h1
              variants={item}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
            >
              Streamline Your <br className="hidden md:inline" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                Inventory Management
              </span>
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-6 text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0"
            >
              Powerful tools to track, organize, and optimize your inventory
              with real-time insights and seamless integrations.
            </motion.p>

            <motion.div
              variants={item}
              className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link href="/request-demo">
                <Button size="lg" className="w-full sm:w-auto group">
                  Schedule Demo
                  <IconArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/features">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Explore Features
                </Button>
              </Link>
            </motion.div>

            <motion.div
              variants={item}
              className="mt-10 grid grid-cols-3 gap-2 md:gap-8 max-w-md mx-auto lg:mx-0"
            >
              <div className="flex flex-col items-center lg:items-start">
                <p className="text-2xl md:text-3xl font-bold text-foreground">
                  99.9%
                </p>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Uptime guarantee
                </p>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <p className="text-2xl md:text-3xl font-bold text-foreground">
                  5K+
                </p>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Active users
                </p>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <p className="text-2xl md:text-3xl font-bold text-foreground">
                  24/7
                </p>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Expert support
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Image/Demo Column */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="relative"
          >
            <div className="relative rounded-lg overflow-hidden shadow-2xl shadow-primary/10 border border-primary/10">
              <div className="aspect-video bg-gradient-to-br from-muted/80 via-background to-muted/80 relative">
                {/* Placeholder for dashboard screenshot or video */}
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                  alt="Stockyst Dashboard"
                  className={`w-full h-full object-cover opacity-90 ${
                    isVideoPlaying ? "hidden" : "block"
                  }`}
                />

                {/* Video play button */}
                {!isVideoPlaying && (
                  <button
                    onClick={() => setIsVideoPlaying(true)}
                    className="absolute inset-0 w-full h-full flex items-center justify-center group"
                  >
                    <div className="bg-primary/90 text-primary-foreground h-16 w-16 rounded-full flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8 5.14V19.14L19 12.14L8 5.14Z"
                          fill="currentColor"
                        />
                      </svg>
                    </div>
                  </button>
                )}

                {/* Embed video (only shown when play is clicked) */}
                {isVideoPlaying && (
                  <video
                    src="./demo-video.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    title="Stockyst Demo"
                    className="absolute inset-0 w-full h-full"
                  />
                )}
              </div>
            </div>

            {/* Floating features badges */}
            <div className="absolute -bottom-5 -left-5 bg-background rounded-lg p-4 shadow-lg flex items-center border border-border">
              <div className="bg-primary/10 p-2 rounded-full mr-3">
                <IconDevices className="size-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Cross-Platform</p>
                <p className="text-xs text-muted-foreground">
                  Web, mobile & desktop
                </p>
              </div>
            </div>

            <div className="absolute -top-5 -right-5 bg-background rounded-lg p-4 shadow-lg flex items-center border border-border">
              <div className="bg-primary/10 p-2 rounded-full mr-3">
                <IconCloudUpload className="size-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Real-time Sync</p>
                <p className="text-xs text-muted-foreground">
                  Data always current
                </p>
              </div>
            </div>

            <div className="absolute top-1/2 -right-6 transform -translate-y-1/2 hidden lg:block bg-background rounded-lg p-4 shadow-lg flex items-center border border-border">
              <div className="bg-primary/10 p-2 rounded-full mr-3">
                <IconShieldCheck className="size-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Enterprise Security</p>
                <p className="text-xs text-muted-foreground">
                  End-to-end encryption
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Curved separator */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 116"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 51.76C277 109.92 554 109.92 720 87.84C886 65.76 1110 -0.480022 1440 0.599978V115.6H0V51.76Z"
            fill="currentColor"
            className="text-background/60"
          />
        </svg>
      </div>
    </section>
  );
}
