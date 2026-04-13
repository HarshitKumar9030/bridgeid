"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader, Zap, ShieldCheck, QrCode, X } from "lucide-react";
import { Scales } from "@/components/ui/scales";
import QRCode from "qrcode";

function trustTone(score: number) {
  if (score >= 70) return "text-primary bg-primary/5";
  if (score >= 40) return "text-accent bg-accent/5";
  return "text-secondary bg-secondary/5";
}

export function ExploreGrid({ initialIdentities }: { initialIdentities: any[] }) {
  const [identities, setIdentities] = useState(initialIdentities);
  const [searchQuery, setSearchQuery] = useState("");
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [selectedIdentity, setSelectedIdentity] = useState<any | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  useEffect(() => {
    if (selectedIdentity) {
      QRCode.toDataURL(
        `https://bridgeid.vercel.app/explore/${selectedIdentity._id}`,
        {
          width: 300,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#ffffff",
          },
        }
      )
        .then(setQrCodeUrl)
        .catch(console.error);
    } else {
      setQrCodeUrl(null);
    }
  }, [selectedIdentity]);

  const handleVerify = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setVerifyingId(id);
    try {
      const response = await fetch(`/api/identities/${id}/verify`, {
        method: "POST"
      });
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 401) {
          alert("Unauthorized: Please log in to your dashboard to verify identities.");
          window.location.href = "/login";
          return;
        }
        throw new Error(data.message || "Failed to verify identity");
      }

      setIdentities(prev => prev.map(item => {
        if (item._id === id) {
          return {
            ...item,
            trustScore: data.trustScore,
            communityConfirmations: data.confirmations
          };
        }
        return item;
      }));

    } catch (err) {
      alert(err instanceof Error ? err.message : "Error verifying identity");
    } finally {
      setVerifyingId(null);
    }
  };

  const filteredIdentities = identities.filter(item => 
    item.alias?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.skills?.join(" ").toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.needs?.join(" ").toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-12">
      <div className="relative max-w-2xl group">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <Search size={22} className="text-muted-foreground/50 transition-colors" />
        </div>
        <input 
          type="text" 
          className="w-full bg-muted/20 border-transparent rounded-full py-4 pl-14 pr-6 text-lg text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:bg-muted/30 focus:ring-0 transition-all font-medium"
          placeholder="Search by alias, skill, need, or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIdentities.map((item, index) => (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: index * 0.05, type: "spring", stiffness: 200, damping: 20 }}
            key={item._id} 
            onClick={() => setSelectedIdentity(item)}
            className="flex flex-col bg-muted/20 rounded-[2.5rem] p-6 sm:p-8 transition-colors duration-500 overflow-hidden relative group hover:bg-muted/30 cursor-pointer"
          >
            <div className="absolute -inset-y-[30%] -left-10 h-[160%] w-8 mask-t-from-90% mask-b-from-90% pointer-events-none opacity-30 text-muted-foreground/30">
              <Scales size={8} className="rounded-lg" />
            </div>
            <div className="absolute -inset-y-[30%] -right-10 h-[160%] w-8 mask-t-from-90% mask-b-from-90% pointer-events-none opacity-30 text-muted-foreground/30">
              <Scales size={8} className="rounded-lg" />
            </div>
            <div className="absolute -inset-x-[30%] -top-10 h-8 w-[160%] mask-r-from-90% mask-l-from-90% pointer-events-none opacity-30 text-muted-foreground/30">
              <Scales size={8} className="rounded-lg" />
            </div>
            <div className="absolute -inset-x-[30%] -bottom-10 h-8 w-[160%] mask-r-from-90% mask-l-from-90% pointer-events-none opacity-30 text-muted-foreground/30">
              <Scales size={8} className="rounded-lg" />
            </div>
            
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="flex items-center gap-4">
                {item.photoUrl ? (
                  <img src={item.photoUrl} alt="Photo" className="w-16 h-16 rounded-[1.25rem] object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-[1.25rem] bg-background/50 flex items-center justify-center font-bold text-3xl text-muted-foreground">
                    {item.alias?.charAt(0) || "U"}
                  </div>
                )}
                <div>
                  <h3 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                    {item.alias}
                  </h3>
                  <div className="text-sm font-medium text-muted-foreground mt-0.5 capitalize flex items-center gap-1.5 opacity-80">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50"></span> {item.location || "Unspecified Area"} 
                  </div>
                </div>
              </div>
              <div className={`px-4 py-2 rounded-2xl text-xs font-bold flex flex-col items-center justify-center min-w-[3.5rem] ${trustTone(item.trustScore)}`}>
                <span className="text-[9px] uppercase tracking-[0.2em] opacity-80 mb-0.5">Score</span>
                <span className="text-2xl leading-none tracking-tighter">{item.trustScore}</span>
              </div>
            </div>

            <div className="flex-grow space-y-6 relative z-10">
              <div>
                <p className="text-[11px] uppercase font-bold tracking-[0.15em] text-muted-foreground/80 mb-3">Verified Needs</p>
                <div className="flex flex-wrap gap-2">
                  {item.needs?.map((need: string) => (
                    <span key={need} className="bg-background/50 text-foreground/90 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide">
                      {need}
                    </span>
                  ))}
                  {(!item.needs || item.needs.length === 0) && <span className="text-xs text-muted-foreground italic">None listed</span>}
                </div>
              </div>

              <div>
                <p className="text-[11px] uppercase font-bold tracking-[0.15em] text-muted-foreground/80 mb-3">Capabilities</p>
                <div className="flex flex-wrap gap-2">
                  {item.skills?.map((skill: string) => (
                    <span key={skill} className="bg-foreground/5 text-foreground/70 px-4 py-1.5 rounded-full text-xs font-medium tracking-wide">
                      {skill}
                    </span>
                  ))}
                  {(!item.skills || item.skills.length === 0) && <span className="text-xs text-muted-foreground italic">None listed</span>}
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between relative z-10">
              <div className="space-y-1.5">
                <p className="text-[11px] uppercase font-bold tracking-[0.15em] text-muted-foreground/60">Community State</p>
                <p className="text-sm font-semibold flex items-center gap-2 text-foreground/80">
                  <ShieldCheck size={16} className={item.ngoVerified ? "text-primary" : "text-muted-foreground"} />
                  {item.ngoVerified ? "NGO Validated" : "Unverified"} <span className="opacity-40">&bull;</span> {item.communityConfirmations || 0} Endorsements
                </p>
              </div>

              <button 
                onClick={(e) => handleVerify(item._id, e)}
                disabled={verifyingId === item._id}
                className="group flex items-center gap-2 bg-background/80 text-foreground hover:bg-primary hover:text-primary-foreground px-5 py-3 rounded-full text-sm font-bold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-background/80 disabled:hover:text-foreground"
              >
                {verifyingId === item._id ? (
                  <Loader size={18} className="animate-spin" />
                ) : (
                  <Zap size={18} className="transition-transform group-hover:scale-110" />
                )}
                <span className="hidden sm:inline">Endorse</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
      
      {filteredIdentities.length === 0 && (
        <div className="text-center py-20 px-6 sm:px-12 bg-muted/20 border border-white/5 rounded-[2rem]">
          <h3 className="text-2xl font-bold tracking-tight mb-2">No identities found</h3>
          <p className="text-muted-foreground text-lg">We couldn't find anyone matching that search term. Try checking your spelling or exploring other skills.</p>
        </div>
      )}

      {/* Identity Detail Modal */}
      <AnimatePresence>
        {selectedIdentity && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedIdentity(null)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-background rounded-[2rem] sm:rounded-[2.5rem] border border-white/5 shadow-2xl overflow-y-auto max-h-[90vh] p-6 sm:p-8 custom-scrollbar flex flex-col md:flex-row gap-8 items-center md:items-stretch"
            >
              <button 
                onClick={() => setSelectedIdentity(null)}
                className="absolute top-4 sm:top-6 right-4 sm:right-6 p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors z-20"
              >
                <X size={20} />
              </button>

              {/* Left side: QR Code */}
              <div className="flex flex-col items-center justify-center relative mt-4 sm:mt-0 w-full md:w-1/2">
                <div className="bg-white p-3 sm:p-4 rounded-[1.5rem] sm:rounded-[2rem] shadow-xl relative z-10 w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center">
                  {qrCodeUrl ? (
                    <img src={qrCodeUrl} alt="Identity QR Code" className="w-full h-full object-contain" />
                  ) : (
                    <div className="animate-pulse flex flex-col items-center justify-center w-full h-full bg-slate-100 rounded-[1rem]">
                      <QrCode className="text-slate-300 w-10 h-10 sm:w-12 sm:h-12 mb-2" />
                    </div>
                  )}
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 sm:w-72 sm:h-72 bg-primary/10 rounded-full blur-[40px] pointer-events-none" />
              </div>

              {/* Right side: Info */}
              <div className="flex flex-col justify-center space-y-4 sm:space-y-6 relative z-10 w-full md:w-1/2 text-center md:text-left">
                <div className="space-y-2">
                  <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">{selectedIdentity.alias}</h2>
                  <div className="text-muted-foreground capitalize font-medium flex items-center justify-center md:justify-start gap-1.5 text-sm sm:text-base">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
                    {selectedIdentity.location || "Unspecified Area"}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-muted/30 rounded-2xl p-3 sm:p-4 flex flex-col justify-center border border-white/5 items-center md:items-start">
                    <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-[0.15em] text-muted-foreground/80 mb-1">Trust Score</span>
                    <span className={`text-2xl sm:text-3xl font-bold tracking-tighter ${trustTone(selectedIdentity.trustScore).split(' ')[0]}`}>
                      {selectedIdentity.trustScore} <span className="text-xs sm:text-sm font-medium text-muted-foreground tracking-normal opacity-50">/ 100</span>
                    </span>
                  </div>
                  <div className="bg-muted/30 rounded-2xl p-3 sm:p-4 flex flex-col justify-center border border-white/5 items-center md:items-start">
                    <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-[0.15em] text-muted-foreground/80 mb-1">Endorsements</span>
                    <span className="text-2xl sm:text-3xl font-bold tracking-tighter text-foreground">
                      {selectedIdentity.communityConfirmations || 0}
                    </span>
                  </div>
                </div>

                {selectedIdentity.needDescription && (
                  <div className="bg-muted/20 border border-white/5 rounded-2xl p-3 sm:p-4 text-xs sm:text-sm leading-relaxed text-foreground/80 italic text-center md:text-left">
                    "{selectedIdentity.needDescription}"
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button 
                    onClick={() => {
                      const el = document.createElement("a");
                      el.href = qrCodeUrl || "";
                      el.download = `${selectedIdentity.alias}-bridgeid-qr.png`;
                      el.click();
                    }}
                    className="w-full sm:flex-1 bg-secondary/10 text-foreground hover:bg-secondary/20 py-3 rounded-full font-bold transition-colors text-sm sm:text-base"
                  >
                    Save QR
                  </button>
                  <button 
                    onClick={(e) => {
                      handleVerify(selectedIdentity._id, e);
                      setSelectedIdentity(null);
                    }}
                    disabled={verifyingId === selectedIdentity._id}
                    className="w-full sm:flex-1 bg-primary text-primary-foreground hover:bg-primary/90 py-3 rounded-full font-bold transition-colors text-sm sm:text-base"
                  >
                    Endorse Now
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}