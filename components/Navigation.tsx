"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const navY = useTransform(scrollY, [0, 50], [0, -10]);
  const navScale = useTransform(scrollY, [0, 50], [1, 0.98]);
  const navBg = useTransform(
    scrollY,
    [0, 50],
    ["rgba(26,26,33,0.1)", "rgba(26,26,33,0.85)"]
  );

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [isOpen]);

  if (pathname.startsWith('/dashboard')) return null;

  return (
    <>
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-6 md:top-8 left-0 right-0 z-[60] flex justify-center px-4 md:px-6 pointer-events-none"
      >
        <motion.nav
          style={{
            y: navY,
            scale: navScale,
            backgroundColor: navBg,
          }}
          className="flex items-center justify-between w-full max-w-5xl rounded-[2rem] pl-6 pr-3 md:pl-8 py-3 backdrop-blur-xl border border-white/5 shadow-2xl pointer-events-auto transition-shadow"
        >
          <div className="font-bold text-xl tracking-tight text-foreground relative z-[60]">
            BridgeID.
          </div>
          
          <div className="hidden md:flex items-center gap-10">
            <div className="flex items-center gap-8 text-sm font-medium text-foreground/60 transition-colors">
              <a href="#problem" className="hover:text-primary transition-colors">Problem</a>
              <a href="#solution" className="hover:text-primary transition-colors">Solution</a>
              <a href="#ai" className="hover:text-primary transition-colors">Platform</a>
            </div>

            <a href="/login" className="group flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-white hover:text-black">
              Access Network <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          <div className="flex md:hidden relative z-[60]">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-foreground flex items-center justify-center rounded-full bg-white/5 border border-white/10"
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div key="close" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }} transition={{ duration: 0.2 }}>
                    <X size={20} />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -90 }} transition={{ duration: 0.2 }}>
                    <Menu size={20} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </motion.nav>
      </motion.header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-3xl flex flex-col items-center justify-center gap-8 px-6"
          >
            <div className="flex flex-col items-center gap-8 text-2xl font-medium text-foreground/80 mt-16">
              <a href="#problem" onClick={() => setIsOpen(false)} className="hover:text-primary transition-colors">Problem</a>
              <a href="#solution" onClick={() => setIsOpen(false)} className="hover:text-primary transition-colors">Solution</a>
              <a href="#ai" onClick={() => setIsOpen(false)} className="hover:text-primary transition-colors">Platform</a>
            </div>
            <button className="group flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground transition-all hover:bg-white hover:text-black w-full max-w-sm mt-8">
              Access Network <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
