"use client";

import { useEffect, useState } from "react";
import {} from "lucide-react";
import { Loader } from "@/components/ui/Loader";
import { TrustGraphPanel } from "@/components/dashboard/TrustGraphPanel";
import type { IdentityRecord } from "@/types/identity";

export function TrustWorkspace() {
  const [identities, setIdentities] = useState<IdentityRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("/api/identities");
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to load graph data");
        }
        setIdentities(data.identities ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load graph");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="inline-flex items-center gap-3 px-6 py-4 rounded-full bg-muted/30 text-muted-foreground font-medium">
        <Loader size={20} className="animate-spin text-primary" />
        Building trust graph...
      </div>
    );
  }

  return (
    <div className="space-y-8 md:space-y-12">
      {error && <p className="px-6 py-4 rounded-full bg-red-500/10 text-red-500 font-medium">{error}</p>}
      <TrustGraphPanel identities={identities} />
    </div>
  );
}






