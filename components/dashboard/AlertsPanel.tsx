"use client";

import { useEffect, useState } from "react";
import { Siren } from "lucide-react";
import { Loader } from "@/components/ui/Loader";

type FraudData = {
  suspiciousCount: number;
  summary: string;
  signals?: string[];
};

export function AlertsPanel() {
  const [data, setData] = useState<FraudData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("/api/ai/fraud-summary");
        const json = await response.json();
        if (!response.ok) {
          throw new Error(json.message || "Failed to load alerts");
        }
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load alerts");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  return (
    <section className="space-y-8 max-w-5xl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
          Fraud & Risk <span className="font-serif italic text-red-500">Alerts.</span>
        </h2>
        <p className="text-muted-foreground mt-2 text-base">
          Monitor suspicious node activity and maintain systemic integrity gracefully.
        </p>
      </div>

      <div className="bg-muted/30 rounded-[2rem] p-6 md:p-8">
        {loading && (
          <div className="flex items-center gap-3 text-muted-foreground font-medium py-8">
            <Loader size={20} className="animate-spin text-red-500" />
            Diagnosing network patterns...
          </div>
        )}

        {error && <div className="text-red-500 font-medium px-4 py-3 bg-red-500/10 rounded-2xl">{error}</div>}

        {data && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 bg-red-500/10 rounded-[1.5rem] p-6 flex flex-col justify-center items-center h-full">
              <div className="text-5xl font-bold tracking-tighter text-red-500 mb-2">{data.suspiciousCount}</div>
              <div className="text-xs font-semibold uppercase tracking-widest text-center text-red-500/80">Flagged<br/>Records</div>
            </div>

            <div className="col-span-3 space-y-6 flex flex-col justify-center">
              <div>
                <div className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                  <Siren size={16} className="text-red-500" /> AI Summary
                </div>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {data.summary}
                </p>
              </div>

              {data.signals && data.signals.length > 0 && (
                <div className="space-y-3">
                  {data.signals.map((signal) => (
                    <div key={signal} className="bg-background/40 rounded-full px-5 py-3 text-sm text-foreground flex items-center gap-3  transition-colors">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                      {signal}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
