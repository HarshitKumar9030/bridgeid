"use client";

import { useMemo, useState } from "react";
import { Sparkles, QrCode, Upload, CheckCircle2 } from "lucide-react";
import { Loader } from "@/components/ui/Loader";
import { UploadDropzone } from "@/lib/uploadthing";
import type { IdentityRecord, NeedCategory } from "@/types/identity";

type Props = {
  onCreated: (identity: IdentityRecord) => void;
};

type ClassifyResult = {
  category: NeedCategory;
  urgency: "Low" | "Medium" | "High";
  reason: string;
};

const NEED_OPTIONS: NeedCategory[] = ["Food", "Job", "Healthcare", "Shelter", "Other"];

export function IdentityCreationForm({ onCreated }: Props) {
  const [alias, setAlias] = useState("");
  const [ageRange, setAgeRange] = useState("18-25");
  const [skillsInput, setSkillsInput] = useState("");
  const [location, setLocation] = useState("");
  const [needDescription, setNeedDescription] = useState("");
  const [needs, setNeeds] = useState<NeedCategory[]>([]);
  const [ngoVerified, setNgoVerified] = useState(false);
  const [communityConfirmations, setCommunityConfirmations] = useState(0);
  const [interactionsCount, setInteractionsCount] = useState(0);
  const [photoUrl, setPhotoUrl] = useState<string | undefined>();
  const [photoKey, setPhotoKey] = useState<string | undefined>();
  const [aiResult, setAiResult] = useState<ClassifyResult | null>(null);
  const [isClassifying, setIsClassifying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const skills = useMemo(
    () =>
      skillsInput
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0),
    [skillsInput]
  );

  const toggleNeed = (value: NeedCategory) => {
    setNeeds((prev) => (prev.includes(value) ? prev.filter((n) => n !== value) : [...prev, value]));
  };

  const runClassification = async () => {
    if (!needDescription.trim()) {
      return;
    }

    setIsClassifying(true);
    setError("");

    try {
      const response = await fetch("/api/ai/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: needDescription }) });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to classify");
      }

      setAiResult(data);
      if (!needs.includes(data.category)) {
        setNeeds((prev) => [...prev, data.category]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Classification failed");
    } finally {
      setIsClassifying(false);
    }
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!alias.trim()) {
      setError("Alias is required");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch("/api/identities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alias,
          ageRange,
          skills,
          location,
          needs,
          needDescription,
          ngoVerified,
          communityConfirmations,
          interactionsCount,
          photoUrl,
          photoKey }) });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create identity");
      }

      onCreated(data.identity);

      setAlias("");
      setAgeRange("18-25");
      setSkillsInput("");
      setLocation("");
      setNeedDescription("");
      setNeeds([]);
      setNgoVerified(false);
      setCommunityConfirmations(0);
      setInteractionsCount(0);
      setPhotoUrl(undefined);
      setPhotoKey(undefined);
      setAiResult(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create identity");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 xl:grid-cols-2 gap-8 bg-muted/20 rounded-[2rem] p-6 sm:p-8">
      <div className="space-y-5">
        <h3 className="text-2xl font-semibold tracking-tight text-foreground">Create Progressive Identity</h3>

        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Alias / Name</label>
          <input
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            className="w-full bg-background/70 rounded-full px-4 py-3 outline-none focus:ring-1 focus:ring-primary/60"
            placeholder="Ravi, Asha, Worker-102"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Age Range</label>
            <select
              value={ageRange}
              onChange={(e) => setAgeRange(e.target.value)}
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
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-background/70 rounded-full px-4 py-3 outline-none focus:ring-1 focus:ring-primary/60"
              placeholder="Delhi Ward 14"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Skills (comma separated)</label>
          <input
            value={skillsInput}
            onChange={(e) => setSkillsInput(e.target.value)}
            className="w-full bg-background/70 rounded-full px-4 py-3 outline-none focus:ring-1 focus:ring-primary/60"
            placeholder="Labor, Tailoring, Delivery"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Needs</label>
          <div className="flex flex-wrap gap-2">
            {NEED_OPTIONS.map((option) => {
              const active = needs.includes(option);
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">NGO Verified</label>
            <button
              type="button"
              onClick={() => setNgoVerified((v) => !v)}
              className={`w-full rounded-full px-4 py-3 text-sm font-medium transition-colors ${
                ngoVerified ? "bg-primary text-primary-foreground" : "bg-background/70"
              }`}
            >
              {ngoVerified ? "Yes" : "No"}
            </button>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Community Confirms</label>
            <input
              type="number"
              min={0}
              max={10}
              value={communityConfirmations}
              onChange={(e) => setCommunityConfirmations(Number(e.target.value || 0))}
              className="w-full bg-background/70 rounded-full px-4 py-3 outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Interactions</label>
            <input
              type="number"
              min={0}
              max={100}
              value={interactionsCount}
              onChange={(e) => setInteractionsCount(Number(e.target.value || 0))}
              className="w-full bg-background/70 rounded-full px-4 py-3 outline-none"
            />
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Need Description</label>
          <textarea
            value={needDescription}
            onChange={(e) => setNeedDescription(e.target.value)}
            rows={5}
            className="w-full bg-background/70 rounded-xl px-4 py-3 outline-none resize-none focus:ring-1 focus:ring-secondary/60"
            placeholder="Describe free-text need context for food, healthcare, jobs, etc."
          />
          <button
            type="button"
            onClick={runClassification}
            disabled={isClassifying || needDescription.trim().length === 0}
            className="inline-flex items-center gap-2 bg-secondary/25 text-foreground px-4 py-2 rounded-full disabled:opacity-50"
          >
            {isClassifying ? <Loader size={16} className="animate-spin" /> : <Sparkles size={16} />}
            Analyze with AI
          </button>
          {aiResult && (
            <div className="bg-background/70 rounded-full p-4 text-sm space-y-1">
              <div className="text-foreground font-medium">Category: {aiResult.category}</div>
              <div className="text-foreground font-medium">Urgency: {aiResult.urgency}</div>
              <div className="text-muted-foreground">{aiResult.reason}</div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="text-sm font-medium text-muted-foreground flex justify-between items-center">
            Photo Upload
            {photoUrl && <span className="text-xs text-primary flex items-center gap-1"><CheckCircle2 size={12}/> Success</span>}
          </div>
          <div className="bg-background/30 rounded-[1.5rem] p-1 border border-dashed border-white/5 overflow-hidden group/upload">
            <UploadDropzone
              endpoint="identityPhoto"
              appearance={{
                container: "border-none w-full bg-transparent mx-auto relative group flex flex-col justify-center items-center py-6 focus-within:ring-0",
                label: "text-foreground font-semibold hover:text-white transition-colors",
                allowedContent: "text-muted-foreground/60 text-xs mt-1",
                button: "bg-white/10 text-white font-medium rounded-full mt-4 px-6 hover:bg-white/20 transition-all",
                uploadIcon: "text-muted-foreground/50 w-8 h-8 mb-4 group-hover/upload:text-white/80 transition-colors"
              }}
              onClientUploadComplete={(res) => {
                if (res?.[0]) {
                  setPhotoUrl(res[0].ufsUrl);
                  setPhotoKey(res[0].key);
                }
              }}
              onUploadError={(uploadError) => setError(uploadError.message)}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <QrCode size={16} />
          QR code is generated automatically after identity creation.
        </div>

        {error && <p className="text-sm text-secondary">{error}</p>}

        <button
          type="submit"
          disabled={isSaving}
          className="w-full rounded-full bg-primary text-primary-foreground py-3 font-semibold inline-flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {isSaving ? <Loader size={16} className="animate-spin" /> : <Upload size={16} />}
          Provision Identity
        </button>
      </div>
    </form>
  );
}






