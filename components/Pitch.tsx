"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

export function Pitch() {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2 } } };

  const item: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as const } } };

  return (
    <section className="py-24 md:py-40 px-6 sm:px-12 bg-transparent flex flex-col items-center justify-center text-center relative z-10 w-full overflow-hidden">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-6xl w-full flex flex-col gap-10 sm:gap-24 items-center"
      >
        <motion.span variants={item} className="text-secondary text-xs md:text-base font-semibold tracking-[0.2em] uppercase mb-2 md:mb-4 opacity-80 backdrop-blur-sm bg-secondary/10 px-4 md:px-6 py-2 rounded-full w-fit">
          The Last Mile
        </motion.span>

        <motion.h2 variants={item} className="text-[3rem] sm:text-5xl md:text-[6rem] lg:text-[8rem] font-bold tracking-tighter text-foreground leading-[0.9] text-balance">
          Identity is the <br className="block sm:hidden" /> <span className="font-serif italic text-primary font-medium">gateway</span><br className="hidden sm:block"/> to opportunity.
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12 w-full mt-6 md:mt-12 text-left pt-8 md:pt-12 border-t border-white/5">
          <motion.div variants={item} className="flex flex-col text-center sm:text-left items-center sm:items-start">
            <h4 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-3 md:mb-4 text-foreground">Bridge Layer</h4>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground leading-relaxed text-balance">BridgeID is not a replacement for government identity systems - it empowers people before formal identity arises.</p>
          </motion.div>
          <motion.div variants={item} className="flex flex-col text-center sm:text-left items-center sm:items-start">
            <h4 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-3 md:mb-4 text-foreground">Bottom-up</h4>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground leading-relaxed text-balance">Built from local communities instead of centralized bureaucratic hubs, using cryptographic reputation webs.</p>
          </motion.div>
        </div>

        {/* Impact Proof Section */}
        <motion.div variants={item} className="mt-16 md:mt-32 w-full flex flex-col md:flex-row gap-12 lg:gap-24 items-start md:items-center text-left py-12 md:py-16 border-y border-white/5 relative z-10">
          <div className="flex-1 w-full lg:max-w-2xl">
            <h3 className="text-sm font-semibold tracking-widest text-primary uppercase mb-6">Impact Proof</h3>
            <p className="text-2xl sm:text-3xl md:text-4xl text-foreground font-medium leading-snug md:leading-tight text-balance">
              In a pilot scenario, a worker with no documents was onboarded in under 2 minutes and matched to a local employer using skill tags.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-12 shrink-0 md:w-auto">
            <div className="flex flex-col gap-2">
              <span className="text-5xl md:text-6xl font-bold tracking-tighter text-foreground">0</span>
              <span className="text-sm md:text-base text-muted-foreground uppercase tracking-wider font-semibold">Documents Required</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-5xl md:text-6xl font-bold tracking-tighter text-foreground">&lt; 2m</span>
              <span className="text-sm md:text-base text-muted-foreground uppercase tracking-wider font-semibold">Setup Time</span>
            </div>
            <div className="flex flex-col gap-2 col-span-1 sm:col-span-2">
              <span className="text-5xl md:text-6xl font-bold tracking-tighter text-foreground">100%</span>
              <span className="text-sm md:text-base text-muted-foreground uppercase tracking-wider font-semibold">Skill Matched to Employer</span>
            </div>
          </div>
        </motion.div>

        <motion.div variants={item} className="mt-16 md:mt-32 w-full flex justify-center">
          <h1 className="text-[15vw] md:text-[12vw] font-bold tracking-tighter text-foreground leading-none opacity-5 hover:opacity-10 transition-opacity duration-700 select-none">
            BRIDGEID.
          </h1>
        </motion.div>
      </motion.div>
    </section>
  );
}



