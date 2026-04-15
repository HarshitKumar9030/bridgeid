"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Loader } from "@/components/ui/Loader";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { IdentityTable } from "@/components/dashboard/IdentityTable";
import type { IdentityRecord } from "@/types/identity";

type StatsResponse = {
  total: number;
  highTrust: number;
  avgTrust: number;
  highUrgency: number;
};

const DEFAULT_STATS: StatsResponse = {
  total: 0,
  highTrust: 0,
  avgTrust: 0,
  highUrgency: 0 };

export function DashboardOverview() {
  const [stats, setStats] = useState<StatsResponse>(DEFAULT_STATS);
  const [identities, setIdentities] = useState<IdentityRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [statsResponse, identitiesResponse] = await Promise.all([
          fetch("/api/dashboard/stats"),
          fetch("/api/identities"),
        ]);

        const [statsData, identitiesData] = await Promise.all([
          statsResponse.json(),
          identitiesResponse.json(),
        ]);

        if (!statsResponse.ok) {
          throw new Error(statsData.message || "Failed to load stats");
        }
        if (!identitiesResponse.ok) {
          throw new Error(identitiesData.message || "Failed to load identities");
        }

        setStats(statsData);
        setIdentities(identitiesData.identities ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className="inline-flex items-center gap-2 text-muted-foreground">
        <Loader size={16} className="animate-spin" />
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h2 className="text-4xl font-bold tracking-tighter text-foreground">
            Operational <span className="font-serif italic text-primary">Overview.</span>
          </h2>
          <p className="text-muted-foreground mt-2">
            Track provisioning, trust progression, and critical urgency signals in one central view.
          </p>
        </div>
        <Link
          href="/dashboard/identities"
          className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform duration-300"
        >
          New Identity
          <ArrowRight size={18} />
        </Link>
      </section>

      {error && <div className="text-secondary">{error}</div>}

      <DashboardStats stats={stats} />

      <section className="space-y-3">
        <h3 className="text-2xl font-semibold tracking-tight">Recent Identities</h3>
        <IdentityTable
          identities={identities.slice(0, 8)}
          onUpdated={(updated) => {
            setIdentities((prev) => prev.map((item) => (item._id === updated._id ? updated : item)));
          }}
        />
      </section>
    </div>
  );
}






