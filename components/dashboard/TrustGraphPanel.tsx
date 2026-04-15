"use client";

import type { IdentityRecord } from "@/types/identity";
import { Network, Users } from "lucide-react";

type Props = {
  identities: IdentityRecord[];
};

export function TrustGraphPanel({ identities }: Props) {
  const top = [...identities].sort((a, b) => b.trustScore - a.trustScore).slice(0, 6);

  return (
    <section className="space-y-8 max-w-5xl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
          Identity <span className="font-serif italic text-primary">Graph.</span>
        </h2>
        <p className="text-muted-foreground mt-2 text-base">
          Visualize peer-verified nodes and aggregate community trust signals.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-muted/30 rounded-[2rem] p-6 md:p-8 overflow-hidden relative">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3 text-foreground font-bold tracking-tight">
              <Network size={20} className="text-primary" /> Verified Edge Relationships
            </div>
            <div className="text-xs tracking-wide font-medium text-muted-foreground/60 bg-white/5 px-3 py-1 rounded-full">
              Trust Matrix
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {top.map((node) => {
              const ngoState = node.ngoVerified;
              const peerState = node.communityConfirmations > 0;

              return (
              <div key={node._id} className="bg-background !border-x-0 !border-t-0 border-b border-b-white/5 py-4 first:pt-0 last:border-b-0 last:pb-0 mx-auto w-full grid grid-cols-3 gap-2 sm:gap-4 items-center">
                
                {/* NGO Column */}
                <div className="flex flex-col items-center justify-center p-3 sm:p-5 rounded-2xl bg-muted/20 relative group overflow-hidden">
                  <div className={`absolute inset-0 opacity-10 transition-opacity group-hover:opacity-20 ${ngoState ? 'bg-primary' : 'bg-transparent'}`}></div>
                  <div className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-0.5 sm:mb-1 z-10 ${ngoState ? 'text-primary' : 'text-muted-foreground'}`}>
                    {ngoState ? 'NGO Validated' : 'Pending NGO'}
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-muted-foreground z-10">Verification Source</div>
                </div>

                {/* Worker Column */}
                <div className="flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl bg-muted/40 relative">
                  {/* Connectors */}
                  <div className={`absolute -left-2 sm:-left-4 top-1/2 w-2 sm:w-4 h-[2px] -translate-y-1/2 ${ngoState ? 'bg-primary/50' : 'bg-white/10'}`}></div>
                  <div className={`absolute -right-2 sm:-right-4 top-1/2 w-2 sm:w-4 h-[2px] -translate-y-1/2 ${peerState ? 'bg-secondary/50' : 'bg-white/10'}`}></div>
                  
                  <div className="text-sm sm:text-lg font-bold text-foreground truncate w-full text-center">{node.alias}</div>
                  <div className="text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5 sm:mt-1">Worker Identity</div>
                </div>

                {/* Peers Column */}
                <div className="flex flex-col items-center justify-center p-3 sm:p-5 rounded-2xl bg-muted/20 relative group overflow-hidden">
                  <div className={`absolute inset-0 opacity-10 transition-opacity group-hover:opacity-20 ${peerState ? 'bg-secondary' : 'bg-transparent'}`}></div>
                  <div className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-0.5 sm:mb-1 z-10 ${peerState ? 'text-secondary' : 'text-muted-foreground'}`}>
                    {node.communityConfirmations} Links
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-muted-foreground z-10">Peer Consensuses</div>
                </div>

              </div>
            )})}
            {top.length === 0 && (
              <div className="col-span-1 sm:col-span-2 p-12 text-center text-sm font-medium text-muted-foreground bg-background/30 rounded-[2.5rem] border border-dashed border-white/10">
                <Network className="mx-auto mb-4 opacity-50 w-12 h-12" />
                No relational paths formulated in the network.
              </div>
            )}
          </div>
        </div>

        <div className="bg-muted/30 rounded-[2rem] p-6 md:p-8 flex flex-col">
          <div className="flex items-center gap-3 text-foreground font-bold tracking-tight mb-6">
            <Network size={18} className="text-accent" /> Platform Signals
          </div>
          <ul className="space-y-3 font-medium text-sm text-foreground mb-8">
            <li className="bg-background/50 rounded-full px-5 py-4 flex items-center justify-between">
              <span className="text-muted-foreground">Total Units</span>
              <span className="text-accent font-bold text-lg">{identities.length}</span>
            </li>
            <li className="bg-background/50 rounded-full px-5 py-4 flex items-center justify-between">
              <span className="text-muted-foreground">NGO Valid</span>
              <span className="text-primary font-bold text-lg">{identities.filter((x) => x.ngoVerified).length}</span>
            </li>
            <li className="bg-background/50 rounded-full px-5 py-4 flex items-center justify-between">
              <span className="text-muted-foreground">Peer Ties</span>
              <span className="text-secondary font-bold text-lg">{identities.filter((x) => x.communityConfirmations > 0).length}</span>
            </li>
          </ul>
          
          <div className="mt-auto inline-flex justify-center items-center gap-2 bg-foreground text-background hover:bg-muted-foreground/80 rounded-full px-5 py-3 font-semibold text-xs transition-colors">
            <Users size={16} /> Trust Propagating
          </div>
        </div>
      </div>
    </section>
  );
}
