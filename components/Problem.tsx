"use client";

"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ShieldAlert, Users, Layers } from "lucide-react";
import { motion } from "framer-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Problem() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".problem-fade",
        { opacity: 0, y: 80, filter: "blur(10px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.4,
          stagger: 0.15,
          ease: "power4.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
          },
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, { scope: containerRef });

  return (
    <section id="problem" ref={containerRef} className="py-24 md:py-40 px-6 sm:px-12 bg-transparent text-foreground relative z-10 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-12 md:gap-32 w-full">
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-6 md:gap-8 w-full max-w-5xl">
          <h2 className="problem-fade text-5xl sm:text-[4rem] md:text-[5rem] font-medium leading-[1] tracking-tight">
            The <span className="font-serif italic text-accent opacity-90 pr-2">invisible</span> millions.
          </h2>
          <p className="problem-fade text-xl sm:text-2xl md:text-3xl text-muted-foreground leading-[1.3] font-medium max-w-4xl text-balance">
            Millions live in poverty not just due to lack of money, but due to <strong className="text-foreground font-semibold">lack of identity.</strong> Without formal records, access to jobs, banking, healthcare, and welfare is impossible. 
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-8 w-full border-t border-white/5 pt-12 md:pt-16">
          <div className="problem-fade flex flex-col gap-4 md:gap-6 items-center sm:items-start text-center sm:text-left group">
            <div className="text-secondary transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6 bg-secondary/10 p-4 md:p-6 rounded-full w-fit">
              <ShieldAlert size={32} className="md:w-10 md:h-10" strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">No Trust</h3>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed balance">Unable to prove who they are or what their skills are to employers.</p>
          </div>
          <div className="problem-fade flex flex-col gap-4 md:gap-6 items-center sm:items-start text-center sm:text-left group">
            <div className="text-primary transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6 bg-primary/10 p-4 md:p-6 rounded-full w-fit">
              <Users size={32} className="md:w-10 md:h-10" strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">No Ecosystem</h3>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed balance">Disconnected from verified NGOs, modern employers, and welfare programs.</p>
          </div>
          <div className="problem-fade flex flex-col gap-4 md:gap-6 items-center sm:items-start text-center sm:text-left group sm:col-span-2 lg:col-span-1">
            <div className="text-accent transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6 bg-accent/10 p-4 md:p-6 rounded-full w-fit">
              <Layers size={32} className="md:w-10 md:h-10" strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">No Paperwork</h3>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed balance">Excluded systematically because of lack of official, centralized documents.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
