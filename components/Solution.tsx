"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { CheckCircle2, ShieldCheck, Database, Link as LinkIcon, Fingerprint } from "lucide-react";

export function Solution() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3 } } };

  const itemVariants: Variants = {
    hidden: { opacity: 0, filter: "blur(8px)", y: 40 },
    show: { opacity: 1, filter: "blur(0px)", y: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as const } } };

  return (
    <section id="solution" className="py-24 md:py-40 px-6 sm:px-12 bg-transparent flex flex-col items-center justify-center text-foreground relative z-10 selection:bg-secondary/40 w-full overflow-hidden">
      <div className="max-w-7xl w-full flex flex-col gap-16 md:gap-24 items-center text-center md:text-left">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] as const }}
          className="flex flex-col gap-6 md:gap-8 w-full"
        >
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter text-foreground leading-[1.1] max-w-4xl mx-auto md:mx-0 text-balance">
            A dynamic network of <br className="hidden sm:block" /> <span className="font-serif italic text-primary">verifiable logic.</span>
          </h2>
          <p className="text-xl sm:text-2xl md:text-3xl text-muted-foreground w-full max-w-4xl mx-auto md:mx-0 leading-[1.4] font-medium text-balance">
            BridgeID enables individuals to progressively construct their digital identity through verified community interactions. No central authority required.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 w-full pt-12 md:pt-16 border-t border-white/5"
        >
          <motion.div variants={itemVariants} className="flex flex-col gap-4 md:gap-8 items-center md:items-start text-center md:text-left group">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center text-primary group-hover:scale-105 transition-transform duration-500">
              <Fingerprint size={32} className="md:w-10 md:h-10" strokeWidth={1} />
            </div>
            <h3 className="text-3xl md:text-5xl font-semibold tracking-tight">1. Minutes, Not Months</h3>
            <p className="text-lg md:text-2xl text-muted-foreground leading-relaxed text-balance">
              Create a progressive profile instantly <strong className="text-foreground font-medium">without prior documents.</strong> Built for low-data environments and offline QR scanning so nobody is left stranded in the field.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col gap-4 md:gap-8 items-center md:items-start text-center md:text-left group">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-secondary/10 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center text-secondary group-hover:scale-105 transition-transform duration-500">
              <ShieldCheck size={32} className="md:w-10 md:h-10" strokeWidth={1} />
            </div>
            <h3 className="text-3xl md:text-5xl font-semibold tracking-tight">2. Decentralized Trust</h3>
            <p className="text-lg md:text-2xl text-muted-foreground leading-relaxed text-balance">
              Replaces top-down bureaucratic control. A dynamic 0-100 Trust Score accrues via NGO validations (+50) and active community verifications (+30).
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col gap-4 md:gap-8 items-center md:items-start text-center md:text-left group">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-accent/10 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center text-accent group-hover:scale-105 transition-transform duration-500">
              <Database size={32} className="md:w-10 md:h-10" strokeWidth={1} />
            </div>
            <h3 className="text-3xl md:text-5xl font-semibold tracking-tight">3. Identity Graphs</h3>
            <p className="text-lg md:text-2xl text-muted-foreground leading-relaxed text-balance">
              Interconnected nodes establishing proof. People, employers, and charities interact, building reputation matrices that constantly resist fraud organically.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col gap-4 md:gap-8 items-center md:items-start text-center md:text-left group">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center text-primary group-hover:scale-105 transition-transform duration-500">
              <LinkIcon size={32} className="md:w-10 md:h-10" strokeWidth={1} />
            </div>
            <h3 className="text-3xl md:text-5xl font-semibold tracking-tight">4. Usage & Allocation</h3>
            <p className="text-lg md:text-2xl text-muted-foreground leading-relaxed text-balance">
              Organizations route aid, filter urgent needs, securely track distribution metrics, and match workers leveraging trust-scores as verification proofs.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}



