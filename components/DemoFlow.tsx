"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function DemoFlow() {
  const steps = [
    { title: "Create Identity", desc: "Volunteer provisions an initial record." },
    { title: "Boost Trust", desc: "NGO verifications attach instantly." },
    { title: "Generate Keys", desc: "Worker receives QR identification." },
    { title: "Find Value", desc: "Worker scans to apply for local employment." },
    { title: "Validate", desc: "Employer inspects unforgeable skill histories." },
    { title: "Integrate", desc: "Graph state updates immediately upon matching." },
  ];

  const targetRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: targetRef });

  const xTransform = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

  return (
    <section ref={targetRef} className="h-[300vh] w-full bg-transparent text-foreground relative z-10">
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden w-full items-start px-0 pt-24 pb-12">
        <h2 className="text-5xl sm:text-[4rem] md:text-[5rem] font-bold tracking-tighter text-primary mb-10 md:mb-16 px-6 sm:px-12 md:px-24">
          <span className="font-serif italic font-medium opacity-90 pr-2 md:pr-3">Flow</span>state.
        </h2>

        <motion.div style={{ x: xTransform }} className="flex gap-6 md:gap-12 px-6 sm:px-12 md:px-24 w-full flex-nowrap pb-8 pt-4">
          {steps.map((step, index) => (
            <div
              key={index} 
              className="flex-shrink-0 w-[85vw] sm:w-[350px] md:w-[420px] flex flex-col gap-4 bg-muted/30 p-8 md:p-10 rounded-[2rem] backdrop-blur-sm group hover:bg-muted/50 transition-colors"
            >
              <span className="text-secondary font-bold text-4xl md:text-6xl mb-2 sm:mb-4 group-hover:scale-105 transition-transform origin-left">0{index + 1}</span>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground">
                {step.title}
              </h3>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
          {/* Spacer to allow deep scrolling at the end on mobile */}
          <div className="flex-shrink-0 w-6 md:w-32 h-1 block pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
}



