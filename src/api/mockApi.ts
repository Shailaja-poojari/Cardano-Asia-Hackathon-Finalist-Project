import type {
  ActivePersona,
  PersonaType,
  RiskLevel,
  ZKProofSummary,
  ProofScope,
  ChatMessage,
  ActivityItem,
} from '../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function activatePersona(
  personaType: PersonaType,
  riskLevel?: RiskLevel
): Promise<ActivePersona> {
  await delay(800);

  const expirationMinutes = 10;
  const expiresAt = new Date(Date.now() + expirationMinutes * 60 * 1000).toISOString();

  return {
    type: personaType,
    riskLevel,
    expiresAt,
  };
}

export async function generatePersonaProof(
  activePersona: ActivePersona,
  scope: ProofScope,
  duration: string
): Promise<ZKProofSummary> {
  await delay(1200);

  const durationMap: Record<string, number> = {
    '10min': 10,
    '1hour': 60,
    '1day': 1440,
  };

  const minutes = durationMap[duration] || 10;
  const createdAt = new Date().toISOString();
  const validUntil = new Date(Date.now() + minutes * 60 * 1000).toISOString();

  const proofPayload = btoa(JSON.stringify({
    persona: activePersona.type,
    risk: activePersona.riskLevel,
    scope,
    nonce: Math.random().toString(36).substring(7),
    zkCircuit: 'groth16',
    commitment: Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join(''),
  }));

  return {
    id: `proof_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    personaType: activePersona.type,
    riskLevel: activePersona.riskLevel,
    scope,
    createdAt,
    validUntil,
    status: 'VALID',
    proofPayload,
  };
}

export async function fetchActivityLog(): Promise<ActivityItem[]> {
  await delay(500);

  return [
    {
      id: '1',
      category: 'PERSONA',
      label: 'Persona activated: Investor (Medium risk)',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: '2',
      category: 'PROOF',
      label: 'Generated ZK proof for DeFi',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: '3',
      category: 'AGENT',
      label: 'Agent suggested switching to Guardian Persona',
      timestamp: new Date(Date.now() - 10800000).toISOString(),
    },
  ];
}

export async function sendChatMessage(
  message: string,
  activePersona?: ActivePersona | null
): Promise<ChatMessage> {
  await delay(1000);

  const responses = [
    `I understand you're asking about "${message}". As your Life Agent operating under the ${activePersona?.type || 'DEFAULT'} persona, I can help while maintaining your privacy.`,
    `Interesting question. Given your current ${activePersona?.type || 'DEFAULT'} persona${activePersona?.riskLevel ? ` with ${activePersona.riskLevel} risk tolerance` : ''}, here's what I can share...`,
    `I've analyzed your request in the context of your ${activePersona?.type || 'DEFAULT'} persona. Let me provide guidance that respects your privacy boundaries.`,
    `Based on your private memory and current persona settings, I recommend considering this approach...`,
  ];

  return {
    id: `msg_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    role: 'agent',
    content: responses[Math.floor(Math.random() * responses.length)],
    createdAt: new Date().toISOString(),
  };
}
