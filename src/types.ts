export type PersonaType = "INVESTOR" | "VOTER" | "STUDENT" | "GAMER" | "EXPLORER" | "GUARDIAN";
export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";
export type ProofScope = "DEFI" | "DAO" | "GAME" | "EDU" | "GENERIC";
export type ProofStatus = "VALID" | "EXPIRED" | "REVOKED";
export type ActivityCategory = "PERSONA" | "PROOF" | "AGENT" | "SYSTEM";

export interface ActivePersona {
  type: PersonaType;
  riskLevel?: RiskLevel;
  expiresAt: string;
}

export interface ZKProofSummary {
  id: string;
  personaType: PersonaType;
  riskLevel?: RiskLevel;
  scope: ProofScope;
  createdAt: string;
  validUntil: string;
  status: ProofStatus;
  proofPayload: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "agent";
  content: string;
  createdAt: string;
}

export interface WalletState {
  connected: boolean;
  address?: string;
  network?: "mainnet" | "preprod" | "preview";
}

export interface IdentityState {
  did?: string;
  hasAgent: boolean;
  authToken?: string; // NEW: DID-based login token
}


export interface ActivityItem {
  id: string;
  category: ActivityCategory;
  label: string;
  timestamp: string;
}

export interface AppSettings {
  defaultPersona: PersonaType;
  defaultExpiration: "10min" | "1hour" | "1day";
  allowAutoSwitch: boolean;
  allowAutoProofs: boolean;
}

export interface AuthSession {
  did: string;
  token: string; // backend session token (e.g. JWT)
}
