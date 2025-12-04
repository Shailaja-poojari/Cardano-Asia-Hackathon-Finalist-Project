// src/prism/agent.ts (FRONTEND ONLY)

import * as PrismSDK from '@atala/prism-wallet-sdk';
import InMemory from '@pluto-encrypted/inmemory';

// We treat SDK as 'any' because of the typings/export issue.
// The shim file we add later will make TS accept this.
const { Agent, Domain, Store, Apollo, Pluto } = PrismSDK as any;

let agentPromise: Promise<any> | null = null;

async function initAgent() {
  if (agentPromise) return agentPromise;

  agentPromise = (async () => {
    const mediatorDIDString = import.meta.env.VITE_MEDIATOR_DID;


    if (!mediatorDIDString) {
      // For now we don't hard-crash; you can add a real mediator DID later.
      console.warn('VITE_MEDIATOR_DID is not set. Using dummy mediator DID for dev.');
    }

    const mediatorDID = mediatorDIDString
      ? Domain.DID.fromString(mediatorDIDString)
      : Domain.DID.fromString('did:prism:dummy-mediator');

    const store = new Store({
      name: 'midnight-persona-wallet',
      storage: InMemory, // in-memory encrypted storage (dev)
      password: 'change-this-password-123', // dev-only
    });

    const apollo = new Apollo();
    const pluto = new Pluto(store, apollo);

    const agent = Agent.initialize({
      mediatorDID,
      apollo,
      pluto,
    });

    return { agent, apollo };
  })();

  return agentPromise;
}

// Exported helper 1: get or create a DID for this browser
export async function getOrCreateDid(): Promise<string> {
  const stored = localStorage.getItem('midnight_prism_did');
  if (stored) return stored;

  // NOTE: This is a mock DID for now.
  // Later, use agent.castor.createPrismDID(publicKey, ...) to create a real DID.
  const did = `did:prism:mock-${Math.random().toString(36).slice(2, 10)}`;
  localStorage.setItem('midnight_prism_did', did);
  return did;
}

// Exported helper 2: "sign" a challenge (dev-level, not real PRISM signing yet)
export async function signLoginChallenge(
  did: string,
  challenge: string
): Promise<Uint8Array> {
  await initAgent(); // ensures SDK is ready if you later use real keys

  // DEV IMPLEMENTATION:
  // We just hash did + challenge with Web Crypto as a stand-in signature.
  // When you wire a real agent, replace this with ECDSA signing from the SDK.
  const data = new TextEncoder().encode(`${did}:${challenge}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return new Uint8Array(digest);
}
