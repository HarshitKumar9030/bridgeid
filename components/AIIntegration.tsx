"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function AIIntegration() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".ai-fade",
        { opacity: 0, x: -50, filter: "blur(10px)" },
        {
          opacity: 1,
          x: 0,
          filter: "blur(0px)",
          duration: 1.4,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 60%" } }
      );
    }, containerRef);
    return () => ctx.revert();
  }, { scope: containerRef });

  return (
    <section id="ai" ref={containerRef} className="py-20 md:py-40 px-6 sm:px-12 bg-transparent text-foreground">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-24 items-start w-full">
        {/* Left Header content */}
        <div className="flex-1 lg:sticky top-32 w-full pt-8">
          <p className="ai-fade text-lg md:text-xl font-semibold tracking-wider text-secondary uppercase mb-6 drop-shadow-md">
            The Intelligence Layer
          </p>
          <h2 className="ai-fade text-5xl sm:text-[4rem] md:text-[5rem] font-bold tracking-tighter leading-[1] text-foreground">
            Powered <br />by <span className="font-serif italic text-accent pr-2 md:pr-4">AI Analysis.</span>
          </h2>
          <p className="ai-fade mt-6 md:mt-8 text-xl md:text-3xl text-muted-foreground leading-relaxed max-w-lg">
            The engine automatically resolving logic gaps, prioritizing human needs, and destroying systemic fraud without friction.
          </p>
        </div>

        {/* Right content listings */}
        <div className="flex-1 flex flex-col gap-16 md:gap-24 w-full pt-12 lg:pt-0">
          <div className="ai-fade flex flex-col gap-6">
            <span className="text-4xl text-primary font-bold">01.</span>
            <h3 className="text-4xl md:text-5xl font-semibold tracking-tight">Need Classification</h3>
            <p className="text-2xl text-muted-foreground leading-relaxed">
              Processes diverse free-text descriptions into organized vectors (Food, Jobs, Healthcare) predicting urgency mapping from Low to High dynamically.
            </p>
          </div>

          <div className="ai-fade flex flex-col gap-6">
            <span className="text-4xl text-secondary font-bold">02.</span>
            <h3 className="text-4xl md:text-5xl font-semibold tracking-tight">Fraud Defense</h3>
            <p className="text-2xl text-muted-foreground leading-relaxed">
              Pattern recognition that silently prevents manipulation. Duplicates are flagged. Sybil verification rings are squashed. Sudden trust score abnormalities trigger immediate holds.
            </p>
          </div>

          <div className="ai-fade flex flex-col gap-6">
            <span className="text-4xl text-accent font-bold">03.</span>
            <h3 className="text-4xl md:text-5xl font-semibold tracking-tight">Trust Optimization</h3>
            <p className="text-2xl text-muted-foreground leading-relaxed">
              Constantly weighs the decay rate of entity trust. An NGO’s validation power adapts to systemic realities based on its verified historic output vs anomalies.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}



