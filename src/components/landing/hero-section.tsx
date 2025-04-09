"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { IconChevronRight, IconDiamond } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-7xl py-20 text-center mx-auto relative z-10 md:py-32 flex flex-col items-center justify-center"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="inline-block mb-6"
      >
        <div className="flex items-center justify-center space-x-2 py-1.5 px-4 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary">
          <IconDiamond className="size-4" />
          <span>Launching v2.0 - Early Access Available</span>
          <span className="flex size-3 relative ml-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/40 opacity-75"></span>
            <span className="relative inline-flex rounded-full size-3 bg-primary/80"></span>
          </span>
        </div>
      </motion.div>
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight text-foreground">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="block"
        >
          Modern Inventory Management
        </motion.span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mt-2 block"
        >
          Simplified
        </motion.span>
      </h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto"
      >
        The complete platform for growing businesses to manage inventory, track
        stock levels, and optimize supply chains.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <Link href="/h">
          <Button
            size="lg"
            className="px-8 h-12 text-base relative overflow-hidden group w-full sm:w-auto"
          >
            <span className="relative flex items-center">
              Get Started{" "}
              <IconChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Button>
        </Link>
        <Button
          size="lg"
          variant="outline"
          className="px-8 h-12 text-base border-2 w-full sm:w-auto"
        >
          Book a Demo
        </Button>
      </motion.div>
    </motion.div>
  );
}
