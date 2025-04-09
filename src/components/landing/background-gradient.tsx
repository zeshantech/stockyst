"use client";

import { motion } from "framer-motion";

export function BackgroundGradient() {
  return (
    <div
      className={`absolute inset-0 -z-10 h-full w-full dark:bg-[radial-gradient(rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[radial-gradient(#dbdde1_1px,transparent_1px)] [background-size:20px_20px] bg-fixed overflow-hidden`}
      aria-hidden="true"
    >
      <div
        className="absolute top-0 -left-[25%] -z-10 transform-gpu blur-3xl"
        aria-hidden="true"
      >
        <div
          className="aspect-[1155/678] w-[72.1875rem] bg-indigo-300 dark:bg-purple-800 opacity-30"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
      <div
        className="absolute bottom-0 -right-[25%] -z-10 transform-gpu blur-3xl"
        aria-hidden="true"
      >
        <div
          className="aspect-[1155/678] w-[72.1875rem] bg-indigo opacity-30"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
      {/* Additional subtle animated gradient orbs */}
      <motion.div
        animate={{
          x: [0, 10, 0],
          y: [0, 15, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary rounded-full mix-blend-multiply blur-3xl opacity-10"
      />
    </div>
  );
}
