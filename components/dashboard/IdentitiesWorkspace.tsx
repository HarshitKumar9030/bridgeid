"use client";

import { useEffect, useState } from "react";
import { Loader } from "@/components/ui/Loader";
import { IdentityCreationForm } from "@/components/dashboard/IdentityCreationForm";
import { IdentityTable } from "@/components/dashboard/IdentityTable";
import type { IdentityRecord } from "@/types/identity";

export function IdentitiesWorkspace() {
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
          throw new Error(data.message || "Failed to load identities");
        }

        setIdentities(data.identities ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load identities");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="space-y-10 md:space-y-14">
      <section className="max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-foreground leading-[1.1]">
          Identity <span className="font-serif italic text-primary">Operations.</span>
        </h1>
        <p className="text-muted-foreground mt-4 text-lg md:text-xl font-medium text-balance">
          Register new workers, auto-generate QR IDs, and progressively grow trust profiles.
        </p>
      </section>

      <IdentityCreationForm
        onCreated={(created) => {
          setIdentities((prev) => [created, ...prev]);
        }}
      />

      <section className="space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tighter text-foreground">
          All <span className="font-serif italic text-primary">Identities.</span>
        </h2>
        {loading ? (
          <div className="inline-flex items-center gap-3 px-6 py-4 rounded-full bg-muted/30 text-muted-foreground font-medium">
            <Loader size={20} className="animate-spin text-primary" />
            Loading identity records...
          </div>
        ) : (
          <IdentityTable
            identities={identities}
            onUpdated={(updated) => {
              setIdentities((prev) => prev.map((item) => (item._id === updated._id ? updated : item)));
            }}
          />
        )}
        {error && <p className="text-secondary">{error}</p>}
      </section>
    </div>
  );
}






