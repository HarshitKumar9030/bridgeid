"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Activity, 
  ShieldAlert, 
  LayoutDashboard, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { signOut } from "next-auth/react";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Identities", href: "/dashboard/identities", icon: Users },
  { name: "Trust Graph", href: "/dashboard/trust", icon: Activity },
  { name: "Alerts", href: "/dashboard/alerts", icon: ShieldAlert },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" });
  };

  const sidebarContent = (
    <div className="flex flex-col h-full relative overflow-hidden bg-background border-r border-white/5">
      <div className="flex flex-col h-full pl-8 pr-12 relative z-10">
        <div className="py-6 md:py-10 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tight text-white hover:opacity-80 transition-opacity">
            Bridge<span className="font-serif italic text-white/70">ID</span>.
          </Link>
          <button 
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setMobileOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 mt-4 flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = item.href === "/dashboard" ? pathname === item.href : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-300 font-medium ${
                  isActive 
                    ? "bg-white/10 text-white font-bold" 
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                }`}
              >
                <Icon size={20} className={isActive ? "text-white" : "opacity-80"} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="py-6 mt-auto">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-4 py-3 text-muted-foreground hover:text-red-400 hover:bg-red-400/10 rounded-full transition-all font-medium"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <div className="md:hidden fixed top-0 left-0 w-full p-4 flex items-center bg-background/80 backdrop-blur-xl   z-40">
        <button 
          onClick={() => setMobileOpen(true)}
          className="p-2 text-foreground"
        >
          <Menu size={24} />
        </button>
        <span className="ml-4 font-bold text-lg">BridgeID.</span>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-72 h-screen fixed left-0 top-0 z-40">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 w-[280px] bg-background z-50 md:hidden "
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}






