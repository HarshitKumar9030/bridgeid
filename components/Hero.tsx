"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="min-h-[100svh] flex flex-col items-center justify-center py-24 md:py-32 px-6 sm:px-12 gap-8 text-center bg-transparent mt-12 md:mt-0">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-6xl w-full flex flex-col gap-6 md:gap-8 items-center"
      >
        <span className="text-secondary text-xs sm:text-sm md:text-base font-semibold tracking-[0.1em] sm:tracking-[0.15em] uppercase mb-4 text-balance">
          The Undocumented Reality
        </span>
        
        <h1 className="text-5xl sm:text-[5rem] md:text-[8rem] lg:text-[10rem] font-bold tracking-tighter text-foreground leading-[1] md:leading-[0.9] flex flex-col items-center w-full">
          <span>Building</span>
          <span className="font-serif font-medium italic text-primary mt-0 md:mt-[-0.05em] opacity-90 text-[1.1em]">
            progressive
          </span>
          <span className="mt-0 md:mt-[-0.05em]">identity.</span>
        </h1>
        
        <p className="mt-8 md:mt-12 text-lg sm:text-xl md:text-2xl text-muted-foreground w-full max-w-sm sm:max-w-2xl leading-relaxed sm:leading-[1.4] mx-auto font-medium text-balance">
          We are NOT heavy identity infrastructure. We are <strong className="text-foreground tracking-tight">trust, usability, and speed.</strong> Establish verifiable identity offline, without documents, in <strong className="text-primary italic font-serif">minutes, not months.</strong>
        </p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto mt-12 md:mt-16"
        >
          <button className="flex h-12 md:h-14 w-full sm:w-auto items-center justify-center gap-3 rounded-full bg-foreground px-8 font-semibold text-background hover:scale-105 transition-transform duration-300">
            Create Identity <ArrowRight size={18} />
          </button>
          <button className="flex h-12 md:h-14 w-full sm:w-auto items-center justify-center gap-3 rounded-full bg-foreground/10 px-8 font-medium text-foreground hover:bg-foreground/15 transition-colors duration-300">
            Learn More
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}



