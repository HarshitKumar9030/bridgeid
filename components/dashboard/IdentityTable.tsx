"use client";

import { useEffect, useState } from "react";
import type { IdentityRecord, NeedCategory } from "@/types/identity";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Pencil, Save } from "lucide-react";
import { Loader } from "@/components/ui/Loader";
import QRCode from "qrcode";

type Props = {
  identities: IdentityRecord[];
  onUpdated?: (identity: IdentityRecord) => void;
};

const NEED_OPTIONS: NeedCategory[] = ["Food", "Job", "Healthcare", "Shelter", "Other"];

function trustTone(score: number) {
  if (score >= 70) return "text-primary";
  if (score >= 40) return "text-accent";
  return "text-secondary";
}

function toSkillsInput(skills: string[]) {
  return skills.join(", ");
}

function fromSkillsInput(skillsInput: string) {
  return skillsInput
    .split(",")
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
}

export function IdentityTable({ identities, onUpdated }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");

  const [editAlias, setEditAlias] = useState("");
  const [editAgeRange, setEditAgeRange] = useState("18-25");
  const [editLocation, setEditLocation] = useState("");
  const [editPhotoUrl, setEditPhotoUrl] = useState("");
  const [editSkillsInput, setEditSkillsInput] = useState("");
  const [editNeeds, setEditNeeds] = useState<NeedCategory[]>([]);
  const [editNeedDescription, setEditNeedDescription] = useState("");
  const [editNgoVerified, setEditNgoVerified] = useState(false);
  const [editCommunityConfirmations, setEditCommunityConfirmations] = useState(0);
  const [editInteractionsCount, setEditInteractionsCount] = useState(0);

  const filteredIdentities = identities.filter((item) =>
    item.alias.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.identityId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.skills.join(" ").toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.needs.join(" ").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedItem = identities.find((item) => item._id === selectedId);

  useEffect(() => {
    if (!selectedItem) {
      return;
    }

    setIsEditing(false);
    setUpdateError("");
    setEditAlias(selectedItem.alias);
    setEditAgeRange(selectedItem.ageRange);
    setEditLocation(selectedItem.location);
    setEditPhotoUrl(selectedItem.photoUrl ?? "");
    setEditSkillsInput(toSkillsInput(selectedItem.skills));
    setEditNeeds(selectedItem.needs);
    setEditNeedDescription(selectedItem.needDescription);
    setEditNgoVerified(selectedItem.ngoVerified);
    setEditCommunityConfirmations(selectedItem.communityConfirmations);
    setEditInteractionsCount(selectedItem.interactionsCount);
  }, [selectedId, selectedItem]);

  const toggleNeed = (value: NeedCategory) => {
    setEditNeeds((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
  };

  const closeModal = () => {
    setSelectedId(null);
    setIsEditing(false);
    setUpdateError("");
  };

  const saveChanges = async () => {
    if (!selectedItem) {
      return;
    }

    if (!editAlias.trim()) {
      setUpdateError("Alias is required");
      return;
    }

    setIsUpdating(true);
    setUpdateError("");

    try {
      const response = await fetch(`/api/identities/${selectedItem._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alias: editAlias,
          ageRange: editAgeRange,
          location: editLocation,
          photoUrl: editPhotoUrl,
          skills: fromSkillsInput(editSkillsInput),
          needs: editNeeds,
          needDescription: editNeedDescription,
          ngoVerified: editNgoVerified,
          communityConfirmations: editCommunityConfirmations,
          interactionsCount: editInteractionsCount,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update identity");
      }

      onUpdated?.(data.identity);
      setIsEditing(false);
    } catch (error) {
      setUpdateError(error instanceof Error ? error.message : "Failed to update identity");
    } finally {
      setIsUpdating(false);
    }
  };

  const downloadIdentityCard = async (item: IdentityRecord, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = 800;
    const height = 540;
    canvas.width = width;
    canvas.height = height;

    // Background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // Subtle border
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, width - 4, height - 4);
    
    // Header gradient
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, "#4f46e5"); // Use a deeper blue for standard ID look
    gradient.addColorStop(1, "#312e81");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, 100);

    // Header text
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 36px 'Inter', sans-serif";
    ctx.fillText("BridgeID", 40, 65);

    const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = () => resolve(img); 
        img.src = src;
      });
    };

    const qrPayload = `ID: ${item.identityId}\nURL: ${typeof window !== "undefined" ? window.location.origin : "https://bridgeid.network"}/explore?id=${item.identityId}`;
    const customQrDataUrl = await QRCode.toDataURL(qrPayload, {
      width: 400,
      margin: 1,
      color: { dark: "#111827", light: "#ffffff" }
    });

    const [qrImage, photoImage] = await Promise.all([
      loadImage(customQrDataUrl),
      item.photoUrl ? loadImage(item.photoUrl) : Promise.resolve(null),
    ]);

    // Draw Photo Box
    const photoX = 40;
    const photoY = 140;
    const photoW = 180;
    const photoH = 220;

    if (photoImage && photoImage.width > 0) {
      ctx.save();
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(photoX, photoY, photoW, photoH, 16);
      } else {
        ctx.rect(photoX, photoY, photoW, photoH);
      }
      ctx.clip();
      ctx.drawImage(photoImage, photoX, photoY, photoW, photoH);
      ctx.restore();
    } else {
      ctx.fillStyle = "#f3f4f6";
      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(photoX, photoY, photoW, photoH, 16);
        ctx.fill();
        ctx.strokeStyle = "#d1d5db";
        ctx.lineWidth = 2;
        ctx.stroke();
      } else {
        ctx.fillRect(photoX, photoY, photoW, photoH);
        ctx.strokeRect(photoX, photoY, photoW, photoH);
      }
      ctx.fillStyle = "#9ca3af";
      ctx.font = "bold 72px 'Inter', sans-serif";
      ctx.fillText(item.alias.charAt(0), photoX + 60, photoY + 135);
    }

    // ID Details
    const textX = 260;
    
    // Alias Main
    ctx.fillStyle = "#111827";
    ctx.font = "bold 42px 'Inter', sans-serif";
    ctx.fillText(item.alias, textX, 180);

    // Sub identifier (Truncated)
    ctx.fillStyle = "#4b5563";
    ctx.font = "bold 18px 'Inter', monospace";
    ctx.fillText(`ID: ${item.identityId.split('-')[0].toUpperCase()}...${item.identityId.slice(-4).toUpperCase()}`, textX, 220);

    // Decorative line
    ctx.fillStyle = "#e5e7eb";
    ctx.fillRect(textX, 240, 260, 2);

    // Grid details
    ctx.font = "600 16px 'Inter', sans-serif";
    ctx.fillStyle = "#6b7280";
    
    ctx.fillText("LOCATION", textX, 275);
    
    ctx.fillStyle = "#111827";
    ctx.font = "bold 20px 'Inter', sans-serif";
    
    const locationStr = item.location || "Unspecified";
    let currentY = 300;

    if (locationStr.length > 12) {
      const words = locationStr.split(" ");
      let line = "";
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + " ";
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 150 && n > 0) {
          ctx.fillText(line, textX, currentY);
          line = words[n] + " ";
          currentY += 24;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, textX, currentY);
    } else {
      ctx.fillText(locationStr, textX, currentY);
    }

    const needsLabelY = currentY + 40;
    ctx.font = "600 16px 'Inter', sans-serif";
    ctx.fillStyle = "#6b7280";
    ctx.fillText("NEEDS", textX, needsLabelY);
    
    ctx.fillStyle = "#111827";
    ctx.font = "bold 20px 'Inter', sans-serif";
    ctx.fillText(item.needs.join(", ") || "None", textX, needsLabelY + 25);

    const skillsLabelY = needsLabelY + 65;
    ctx.font = "600 16px 'Inter', sans-serif";
    ctx.fillStyle = "#6b7280";
    ctx.fillText("SKILLS", textX, skillsLabelY);
    
    ctx.fillStyle = "#111827";
    ctx.font = "bold 20px 'Inter', sans-serif";
    const skillsText = item.skills.slice(0, 3).join(", ") || "Unspecified";
    ctx.fillText(skillsText, textX, skillsLabelY + 25);

    // Trust Score Badge
    ctx.fillStyle = "#f3f4f6";
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(textX + 160, 280, 110, 80, 12);
      ctx.fill();
    } else {
      ctx.fillRect(textX + 160, 280, 110, 80);
    }
    ctx.fillStyle = "#4b5563";
    ctx.font = "600 12px 'Inter', sans-serif";
    ctx.fillText("TRUST RATING", textX + 168, 305);
    ctx.fillStyle = trustTone(item.trustScore) === "text-primary" ? "#10b981" : 
                    trustTone(item.trustScore) === "text-accent" ? "#f59e0b" : "#ef4444";
    ctx.font = "bold 32px 'Inter', sans-serif";
    ctx.fillText(`${item.trustScore}`, textX + 195, 345);

    // Verified By
    ctx.fillStyle = "#6b7280";
    ctx.font = "600 12px 'Inter', sans-serif";
    ctx.fillText("VERIFIED BY", textX + 168, 385);
    
    let verifiers = [];
    if (item.ngoVerified) verifiers.push("NGO");
    if (item.communityConfirmations > 0) verifiers.push("Community");
    const verifierText = verifiers.length > 0 ? verifiers.join(" + ") : "Network";
    
    ctx.fillStyle = "#111827";
    ctx.font = "bold 13px 'Inter', sans-serif";
    ctx.fillText(verifierText, textX + 168, 405);

    // QR Code area
    const qrX = 560;
    const qrY = 140;
    
    if (qrImage.width > 0) {
      // Background for QR
      ctx.fillStyle = "#f9fafb";
      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(qrX - 10, qrY - 10, 200, 240, 16);
        ctx.fill();
      } else {
        ctx.fillRect(qrX - 10, qrY - 10, 200, 240);
      }

      ctx.drawImage(qrImage, qrX, qrY, 180, 180);
      
      // QR Subtext
      ctx.fillStyle = "#6b7280";
      ctx.font = "bold 13px 'Inter', sans-serif";
      ctx.letterSpacing = "1px";
      ctx.fillText("SCAN TO VERIFY", qrX + 30, qrY + 210);
    }

    // Footer
    ctx.fillStyle = "#f3f4f6";
    ctx.fillRect(0, height - 50, width, 50);
    ctx.fillStyle = "#9ca3af";
    ctx.font = "600 14px 'Inter', sans-serif";
    const updateDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    ctx.fillText(`LAST UPDATED: ${updateDate}`, 40, height - 20);
    ctx.fillText("BRIDGE IDENTITY PROTOCOL", width - 240, height - 20);

    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `BRIDGE-ID-${item.identityId.slice(0, 8)}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const springContent = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1, transition: { delay: 0.1, duration: 0.2 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.1 } }
  };

  return (
    <div className="space-y-6">
      <div className="relative max-w-md w-full">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-muted-foreground" />
        </div>
        <input
          type="text"
          placeholder="Search alias, skills, needs, location..."
          className="w-full bg-muted/40 rounded-2xl py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent/50 transition-all font-medium"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
      </div>

      {identities.length === 0 ? (
        <div className="bg-muted/20 rounded-[2rem] p-8 text-muted-foreground">
          No identity records yet. Create your first profile to initialize the trust graph.
        </div>
      ) : (
        <div className="bg-muted/30 rounded-[2rem] p-2 md:p-6 overflow-hidden relative">
          <div className="max-h-[500px] overflow-auto custom-scrollbar">
            <table className="w-full min-w-[920px] table-fixed border-separate border-spacing-y-2">
              <thead>
                <tr className="text-left text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground bg-muted/40 rounded-xl">
                  <th className="px-4 py-4 w-1/6 rounded-l-2xl">Alias</th>
                  <th className="px-4 py-4 w-1/6">Identity ID</th>
                  <th className="px-4 py-4 w-1/6">Needs</th>
                  <th className="px-4 py-4 w-1/6">Location</th>
                  <th className="px-4 py-4 w-1/12">Trust</th>
                  <th className="px-4 py-4 w-1/6">Created</th>
                  <th className="px-4 py-4 w-1/12 rounded-r-2xl">ID Card</th>
                </tr>
              </thead>
              <tbody>
                {filteredIdentities.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center p-8 text-muted-foreground text-sm">No profiles found matching your search.</td>
                  </tr>
                ) : (
                  filteredIdentities.map((item) => (
                    <motion.tr
                      layoutId={`row-${item._id}`}
                      key={item._id}
                      onClick={() => setSelectedId(item._id)}
                      className="cursor-pointer group"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      style={{ originY: 0.5 }}
                    >
                      <td className="bg-muted/40 group-hover:bg-muted transition-colors px-4 py-5 font-bold tracking-tight text-foreground truncate rounded-l-2xl">{item.alias}</td>
                      <td className="bg-muted/40 group-hover:bg-muted transition-colors px-4 py-5 text-muted-foreground font-medium font-mono text-sm truncate">{item.identityId.slice(0, 8)}...</td>
                      <td className="bg-muted/40 group-hover:bg-muted transition-colors px-4 py-5 text-muted-foreground truncate">{item.needs.join(", ") || "Other"}</td>
                      <td className="bg-muted/40 group-hover:bg-muted transition-colors px-4 py-5 text-muted-foreground truncate">{item.location}</td>
                      <td className={`bg-muted/40 group-hover:bg-muted transition-colors px-4 py-5 font-bold ${trustTone(item.trustScore)}`}>{item.trustScore}</td>
                      <td className="bg-muted/40 group-hover:bg-muted transition-colors px-4 py-5 text-muted-foreground font-medium whitespace-nowrap">{new Date(item.createdAt).toLocaleDateString()}</td>
                      <td className="bg-muted/40 group-hover:bg-muted transition-colors px-4 py-5 text-right rounded-r-2xl">
                        <button
                          onClick={(e) => downloadIdentityCard(item, e)}
                          className="inline-flex px-3 py-1.5 hover:scale-105 rounded-xl bg-foreground text-background font-bold text-[10px] transition-transform duration-300 uppercase tracking-wider"
                        >
                          dl
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AnimatePresence>
        {selectedId && selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12 pointer-events-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-background/60 backdrop-blur-md pointer-events-auto"
            />
            <motion.div
              layoutId={`row-${selectedItem._id}`}
              className="relative w-full max-w-3xl bg-background border border-border rounded-[2.5rem] shadow-2xl overflow-hidden pointer-events-auto flex flex-col max-h-[90vh] z-10"
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
            >
              <motion.div 
                {...springContent}
                className="flex flex-col flex-1 overflow-hidden"
              >
              <div className="p-6 md:p-8 flex items-start justify-between border-b border-border bg-muted/20">
                <div className="flex gap-6 items-center">
                  {selectedItem.photoUrl ? (
                    <img src={selectedItem.photoUrl} alt="Photo" className="w-20 h-20 rounded-2xl object-cover border border-border shadow-lg" />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-muted border border-border flex items-center justify-center font-bold text-3xl text-muted-foreground shadow-lg">
                      {selectedItem.alias.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                      {selectedItem.alias}
                      {selectedItem.ngoVerified && (
                        <span className="bg-primary/20 text-primary text-[10px] uppercase tracking-widest px-2 py-1 rounded-full font-bold">Verified</span>
                      )}
                    </h2>
                    <p className="font-mono text-sm text-muted-foreground mt-1 bg-muted/50 px-3 py-1 rounded-full inline-block">
                      ID: {selectedItem.identityId}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!isEditing ? (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 text-foreground hover:bg-muted transition-colors"
                    >
                      <Pencil size={16} />
                      Edit
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 rounded-full bg-muted/50 text-foreground hover:bg-muted transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={saveChanges}
                        disabled={isUpdating}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground disabled:opacity-60"
                      >
                        {isUpdating ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
                        Save
                      </button>
                    </>
                  )}
                  <button
                    onClick={closeModal}
                    className="p-3 rounded-full hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1">
                {isEditing ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">Alias</label>
                        <input
                          value={editAlias}
                          onChange={(event) => setEditAlias(event.target.value)}
                          className="w-full bg-background/70 rounded-full px-4 py-3 outline-none focus:ring-1 focus:ring-primary/60"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">Age Range</label>
                        <select
                          value={editAgeRange}
                          onChange={(event) => setEditAgeRange(event.target.value)}
                          className="w-full bg-background/70 rounded-full px-4 py-3 outline-none"
                        >
                          <option value="Below 18">Below 18</option>
                          <option value="18-25">18-25</option>
                          <option value="26-35">26-35</option>
                          <option value="36-50">36-50</option>
                          <option value="50+">50+</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">Location</label>
                        <input
                          value={editLocation}
                          onChange={(event) => setEditLocation(event.target.value)}
                          className="w-full bg-background/70 rounded-full px-4 py-3 outline-none focus:ring-1 focus:ring-primary/60"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">Photo URL</label>
                        <input
                          value={editPhotoUrl}
                          onChange={(event) => setEditPhotoUrl(event.target.value)}
                          className="w-full bg-background/70 rounded-full px-4 py-3 outline-none focus:ring-1 focus:ring-primary/60"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">Skills (comma separated)</label>
                      <input
                        value={editSkillsInput}
                        onChange={(event) => setEditSkillsInput(event.target.value)}
                        className="w-full bg-background/70 rounded-full px-4 py-3 outline-none focus:ring-1 focus:ring-primary/60"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">Needs</label>
                      <div className="flex flex-wrap gap-2">
                        {NEED_OPTIONS.map((option) => {
                          const active = editNeeds.includes(option);
                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() => toggleNeed(option)}
                              className={`px-3 py-2 rounded-full text-sm transition-colors ${
                                active ? "bg-primary text-primary-foreground" : "bg-background/70 text-foreground"
                              }`}
                            >
                              {option}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">Need Description</label>
                      <textarea
                        rows={4}
                        value={editNeedDescription}
                        onChange={(event) => setEditNeedDescription(event.target.value)}
                        className="w-full bg-background/70 rounded-xl px-4 py-3 outline-none resize-none focus:ring-1 focus:ring-secondary/60"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">NGO Verified</label>
                        <button
                          type="button"
                          onClick={() => setEditNgoVerified((value) => !value)}
                          className={`w-full rounded-full px-4 py-3 text-sm font-medium transition-colors ${
                            editNgoVerified ? "bg-primary text-primary-foreground" : "bg-background/70"
                          }`}
                        >
                          {editNgoVerified ? "Yes" : "No"}
                        </button>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">Community Confirms</label>
                        <input
                          type="number"
                          min={0}
                          max={10}
                          value={editCommunityConfirmations}
                          onChange={(event) => setEditCommunityConfirmations(Number(event.target.value || 0))}
                          className="w-full bg-background/70 rounded-full px-4 py-3 outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">Interactions</label>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={editInteractionsCount}
                          onChange={(event) => setEditInteractionsCount(Number(event.target.value || 0))}
                          className="w-full bg-background/70 rounded-full px-4 py-3 outline-none"
                        />
                      </div>
                    </div>

                    {updateError && <p className="text-sm text-secondary">{updateError}</p>}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-3">Status Overview</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="col-span-1 md:col-span-2 bg-muted/30 rounded-[1.5rem] p-5">
                            <div className="flex justify-between items-start mb-6">
                              <div>
                                <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-[0.2em] font-bold">Trust Score</p>
                                <p className={`text-4xl md:text-5xl font-bold tracking-tighter ${trustTone(selectedItem.trustScore)}`}>
                                  {selectedItem.trustScore} <span className="text-sm font-medium text-muted-foreground tracking-normal opacity-50">/ 100</span>
                                </p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 text-[10px] sm:text-xs font-semibold">
                              <div className="bg-background/40 rounded-xl p-2 sm:p-3 md:p-4 flex flex-col justify-between overflow-hidden">
                                <div className="text-muted-foreground mb-2 flex flex-col xl:flex-row justify-between xl:items-center w-full gap-1">
                                  <span className="truncate">NGO</span>
                                  <span className="text-foreground">{selectedItem.ngoVerified ? '+50' : '+0'}</span>
                                </div>
                                <div className="h-1.5 w-full bg-muted/60 rounded-full overflow-hidden">
                                  <div className="h-full bg-primary transition-all duration-1000" style={{ width: selectedItem.ngoVerified ? '100%' : '0%' }}></div>
                                </div>
                              </div>
                              <div className="bg-background/40 rounded-xl p-2 sm:p-3 md:p-4 flex flex-col justify-between overflow-hidden">
                                <div className="text-muted-foreground mb-2 flex flex-col xl:flex-row justify-between xl:items-center w-full gap-1">
                                  <span className="truncate">Community</span>
                                  <span className="text-foreground">+{Math.min(selectedItem.communityConfirmations, 3) * 10}</span>
                                </div>
                                <div className="h-1.5 w-full bg-muted/60 rounded-full overflow-hidden">
                                  <div className="h-full bg-secondary transition-all duration-1000" style={{ width: `${(Math.min(selectedItem.communityConfirmations, 3) / 3) * 100}%` }}></div>
                                </div>
                              </div>
                              <div className="bg-background/40 rounded-xl p-2 sm:p-3 md:p-4 flex flex-col justify-between overflow-hidden">
                                <div className="text-muted-foreground mb-2 flex flex-col xl:flex-row justify-between xl:items-center w-full gap-1">
                                  <span className="truncate">Interactions</span>
                                  <span className="text-foreground">+{Math.min(selectedItem.interactionsCount, 20)}</span>
                                </div>
                                <div className="h-1.5 w-full bg-muted/60 rounded-full overflow-hidden">
                                  <div className="h-full bg-accent transition-all duration-1000" style={{ width: `${(Math.min(selectedItem.interactionsCount, 20) / 20) * 100}%` }}></div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-muted/30 rounded-[1.5rem] p-4 col-span-1 md:col-span-2">
                            <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-[0.2em] font-bold">Urgency</p>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-3">
                                <span className={`w-3 h-3 rounded-full ${selectedItem.urgency === "High" ? "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.6)]" : selectedItem.urgency === "Medium" ? "bg-accent" : "bg-primary"}`} />
                                <p className="text-xl font-bold capitalize tracking-tight">{selectedItem.urgency}</p>
                              </div>
                              <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-[0.1em] bg-background/50 px-3 py-1.5 rounded-full">
                                AI Classified
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-3">Core Information</h3>
                        <ul className="space-y-4 text-sm font-medium">
                          <li className="flex justify-between items-center bg-muted/40 p-3 rounded-xl">
                            <span className="text-muted-foreground">Age Range</span>
                            <span className="text-foreground">{selectedItem.ageRange}</span>
                          </li>
                          <li className="flex justify-between items-center bg-muted/40 p-3 rounded-xl">
                            <span className="text-muted-foreground">Location</span>
                            <span className="text-foreground">{selectedItem.location}</span>
                          </li>
                          <li className="flex justify-between items-center bg-muted/40 p-3 rounded-xl">
                            <span className="text-muted-foreground">Confirmations</span>
                            <span className="text-foreground font-mono">{selectedItem.communityConfirmations}</span>
                          </li>
                          <li className="flex justify-between items-center bg-muted/40 p-3 rounded-xl">
                            <span className="text-muted-foreground">Interactions</span>
                            <span className="text-foreground font-mono">{selectedItem.interactionsCount}</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div>
                        <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-3">Requirements</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedItem.needs.map((need) => (
                            <span key={need} className="bg-accent/10 border border-accent/20 text-accent px-3 py-1.5 rounded-full text-xs font-bold tracking-wide">
                              {need}
                            </span>
                          ))}
                        </div>
                        {selectedItem.needDescription && (
                          <div className="mt-4 bg-muted/20 p-4 rounded-2xl text-sm text-foreground/80 leading-relaxed font-medium">
                            {selectedItem.needDescription}
                          </div>
                        )}
                      </div>

                      <div>
                        <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-3">Self-Reported Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedItem.skills.map((skill) => (
                            <span key={skill} className="bg-muted text-foreground border border-border px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide capitalize">
                              {skill}
                            </span>
                          ))}
                          {selectedItem.skills.length === 0 && <span className="text-muted-foreground text-sm italic">No skills listed.</span>}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-3 mt-8">Quick Actions</h3>
                        <button 
                          onClick={(e) => downloadIdentityCard(selectedItem, e)}
                          className="w-full flex justify-between items-center p-4 rounded-2xl bg-foreground text-background hover:scale-[1.02] transition-transform text-left"
                        >
                          <div>
                            <p className="font-bold text-sm">Identity QR Code</p>
                            <p className="text-xs opacity-70">Download verifiable card</p>
                          </div>
                          <img src={selectedItem.qrCodeDataUrl} className="w-12 h-12 rounded bg-white" alt="QR" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
