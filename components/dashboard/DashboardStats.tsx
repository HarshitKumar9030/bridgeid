"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Activity, Users, Siren } from "lucide-react";

type Stats = {
  total: number;
  highTrust: number;
  avgTrust: number;
  highUrgency: number;
};

type Props = {
  stats: Stats;
};

export function DashboardStats({ stats }: Props) {
  const cards = [
    { title: "Profiles", value: stats.total, icon: Users, tone: "text-primary" },
    { title: "High Trust", value: stats.highTrust, icon: ShieldCheck, tone: "text-accent" },
    { title: "Avg Trust", value: stats.avgTrust, icon: Activity, tone: "text-secondary" },
    { title: "High Urgency", value: stats.highUrgency, icon: Siren, tone: "text-foreground" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.07 }}
          className="bg-muted/30 rounded-[2rem] p-6 lg:p-8"
        >
          <div className={`mb-6 ${card.tone}`}>
            <card.icon size={28} />
          </div>
          <div className="text-4xl md:text-5xl font-bold tracking-tighter text-foreground mb-1">{card.value}</div>
          <div className="text-sm md:text-base font-medium text-muted-foreground uppercase tracking-widest">{card.title}</div>
        </motion.div>
      ))}
    </div>
  );
}






