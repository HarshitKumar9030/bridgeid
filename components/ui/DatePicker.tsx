"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

export function DatePicker() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const currentMonth = new Date().toLocaleString("default", { month: "long" });
  const currentYear = new Date().getFullYear();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flexitems-center gap-2 px-4 py-2 bg-muted/30 border border-white/10 rounded-xl hover:bg-muted/50 transition-colors w-full sm:w-auto"
      >
        <CalendarIcon size={18} className="text-secondary" />
        <span className="text-sm font-medium">
          {selectedDate ? selectedDate.toLocaleDateString() : "Select Date"}
        </span>
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          className="absolute top-full mt-2 left-0 w-72 bg-muted/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl z-50 text-foreground"
        >
          <div className="flex justify-between items-center mb-4">
            <button className="p-1 hover:bg-white/10 rounded-full transition-colors text-muted-foreground">
              <ChevronLeft size={16} />
            </button>
            <span className="font-semibold text-sm">
              {currentMonth} {currentYear}
            </span>
            <button className="p-1 hover:bg-white/10 rounded-full transition-colors text-muted-foreground">
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-muted-foreground mb-2">
            {days.map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 text-sm font-medium">
            {Array.from({ length: 30 }).map((_, i) => (
              <button
                key={i}
                className={`p-2 rounded-xl transition-colors hover:bg-primary/20 hover:text-primary ${
                  i === 15 ? "bg-primary text-primary-foreground font-bold hover:bg-primary/90 hover:text-primary-foreground" : "text-foreground"
                }`}
                onClick={() => {
                  setSelectedDate(new Date(currentYear, new Date().getMonth(), i + 1));
                  setIsOpen(false);
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}


