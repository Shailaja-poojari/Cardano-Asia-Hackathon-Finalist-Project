# Midnight Persona Layer - Integration Notes

## Overview
This is a complete frontend implementation for the Midnight Persona Layer DApp. All backend integrations are stubbed with mock functions that can be replaced with real implementations.

## Key Integration Points

### 1. Wallet Connection (CIP-30)
**Location**: `src/components/layout/AppLayout.tsx`
- Currently: Mock wallet connection in `useStore().connectWallet()`
- **TODO**: Replace with real CIP-30 wallet connection using `window.cardano` API
- Need to implement: wallet discovery, account selection, network detection

### 2. DID Management (Atala PRISM)
**Location**: `src/state/store.ts`
- Currently: Mock DID generated on wallet connection
- **TODO**: Implement Atala PRISM DID resolution and issuance
- Need to integrate: DID creation, DID verification, DID-to-wallet linking

### 3. Persona Activation
**Location**: `src/api/mockApi.ts` - `activatePersona()`
- Currently: Returns mock persona with local expiration
- **TODO**: Implement on-chain or Midnight protocol persona activation
- Need to integrate: Smart contract calls, ZK proof generation for persona state

### 4. ZK Proof Generation
**Location**: `src/api/mockApi.ts` - `generatePersonaProof()`
- Currently: Returns mock proof payload (base64 encoded JSON)
- **TODO**: Implement real Zero-Knowledge proof generation using Midnight protocol
- Need to integrate: ZK circuit compilation, witness generation, proof generation

### 5. AI Life Agent Chat
**Location**: `src/api/mockApi.ts` - `sendChatMessage()`
- Currently: Returns random responses with persona context
- **TODO**: Implement AI agent backend with private memory and reasoning
- Need to integrate: LLM API, memory storage, persona-aware context filtering

### 6. Activity Logging
**Location**: `src/state/store.ts`
- Currently: Stored locally in Zustand with persistence
- **TODO**: Consider on-chain activity logging for audit trail
- Need to integrate: Event emission, decentralized storage (IPFS/Arweave)

## State Management
All state is currently managed with Zustand and persisted to localStorage. For production:
- Consider migrating sensitive data to secure enclaves
- Implement proper key management for wallet signatures
- Add state synchronization across devices

## Security Considerations
- All proof generation should happen in a secure environment
- Private keys should never be exposed to the frontend
- Implement proper CORS policies when integrating with backend services
- Add rate limiting for API calls
- Implement proper session management and timeout handling

## Mock Data Locations
- `src/api/mockApi.ts` - All async functions that simulate backend calls
- `src/state/store.ts` - Initial state and mock wallet connection logic
- All pages consume these mocks through the store and API layer

## Testing Integration
When adding real integrations, test with:
1. Cardano Preprod testnet first
2. Multiple wallet providers (Nami, Eternl, Flint, etc.)
3. Different persona combinations and risk levels
4. Proof verification in target dApps
5. Edge cases: expired personas, network failures, concurrent operations
