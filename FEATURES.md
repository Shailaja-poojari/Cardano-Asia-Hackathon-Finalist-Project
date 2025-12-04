# Midnight Persona Layer - Feature Overview

## Application Structure

### Routes
- `/` - Landing page with hero section and feature cards
- `/app` - Main dashboard with status overview and quick actions
- `/personas` - Persona Studio for switching between 6 persona types
- `/chat` - AI Life Agent chat interface
- `/proofs` - ZK proof generation and management center
- `/activity` - Activity timeline with categorized events
- `/settings` - Application settings and privacy information

## Key Features

### 1. Persona System
**6 Persona Types:**
- **Investor** - For DeFi protocols (with Low/Medium/High risk levels)
- **Voter** - For DAO governance
- **Student** - For educational platforms
- **Gamer** - For blockchain games
- **Explorer** - For general web3 browsing
- **Guardian** - For high-security operations

**Features:**
- One-click persona activation
- Automatic expiration (configurable: 10min, 1hr, 1day)
- Risk level configuration for Investor persona
- Visual persona badge showing active status and time remaining

### 2. ZK Proof Generation
- Generate Zero-Knowledge proofs for active persona
- Configurable scopes: DeFi, DAO Governance, Gaming, Education, Generic
- Configurable validity duration: 10 minutes, 1 hour, 1 day
- Proof status tracking (VALID/EXPIRED/REVOKED)
- Copy proof payload to clipboard for dApp integration

### 3. AI Life Agent Chat
- Real-time chat interface with AI agent
- Agent is persona-aware and context-sensitive
- Option to store conversations in private memory
- Visual distinction between user and agent messages
- Loading states and typing indicators

### 4. Activity Logging
- Comprehensive timeline of all actions
- Categories: Persona, Proof, Agent, System
- Grouped by date for easy navigation
- Visual indicators for different activity types
- Human-readable timestamps

### 5. Wallet Integration
- Mock Cardano wallet connection (ready for CIP-30 integration)
- Wallet address display
- Network indicator (preprod/mainnet/preview)
- DID display and status

### 6. Settings & Configuration
- Default persona selection
- Auto-expiration configuration
- AI agent behavior toggles:
  - Auto-switch personas based on context
  - Auto-generate proofs for known dApps
- Privacy policy information

## State Management
- **Zustand** for global state management
- **Persistent storage** using localStorage
- State includes:
  - Wallet connection status
  - Active persona and expiration
  - Generated proofs history
  - Activity log
  - User settings
  - Identity (DID)

## Design Features
- Clean, modern dashboard interface
- Responsive design (mobile and desktop)
- Dark text on light backgrounds for readability
- Blue and purple accent colors (avoiding pure purple/indigo)
- Lucide React icons throughout
- Smooth transitions and hover states
- Loading states for async operations
- Success/error feedback with toasts and inline messages

## Mock APIs
All backend interactions are stubbed with realistic mock functions:
- `activatePersona()` - Simulates persona activation with 800ms delay
- `generatePersonaProof()` - Simulates ZK proof generation with 1.2s delay
- `sendChatMessage()` - Simulates AI agent response with 1s delay
- `fetchActivityLog()` - Returns sample activity data

## Technical Stack
- **React 18** with TypeScript
- **Vite** for build tooling
- **React Router** for navigation
- **Zustand** for state management
- **Tailwind CSS** for styling
- **Lucide React** for icons

## Ready for Production Integration
All components are designed to be easily integrated with:
- Real Cardano wallet (CIP-30)
- Atala PRISM DIDs
- Midnight ZK protocol
- AI backend services
- On-chain activity logging
