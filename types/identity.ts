export type NeedCategory = "Food" | "Job" | "Healthcare" | "Shelter" | "Other";
export type UrgencyLevel = "Low" | "Medium" | "High";

export type IdentityRecord = {
  _id: string;
  identityId: string;
  alias: string;
  ageRange: string;
  skills: string[];
  needs: NeedCategory[];
  needDescription: string;
  urgency: UrgencyLevel;
  photoUrl?: string;
  photoKey?: string;
  location: string;
  trustScore: number;
  ngoVerified: boolean;
  communityConfirmations: number;
  interactionsCount: number;
  qrCodeDataUrl: string;
  createdAt: string;
};
