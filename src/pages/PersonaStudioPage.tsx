import { useState } from 'react';
import { useStore } from '../state/store';
import { activatePersona } from '../api/mockApi';
import { User2, TrendingUp, Vote, GraduationCap, Gamepad2, Compass, ShieldCheck, CheckCircle, Loader2 } from 'lucide-react';
import type { PersonaType, RiskLevel } from '../types';

interface PersonaConfig {
  type: PersonaType;
  title: string;
  description: string;
  icon: typeof User2;
  color: string;
  hasRisk: boolean;
}

const personas: PersonaConfig[] = [
  {
    type: 'INVESTOR',
    title: 'Investor',
    description: 'For DeFi protocols, trading platforms, and financial dApps. Configure risk tolerance.',
    icon: TrendingUp,
    color: 'green',
    hasRisk: true,
  },
  {
    type: 'VOTER',
    title: 'Voter',
    description: 'For DAO governance, on-chain voting, and community decision-making.',
    icon: Vote,
    color: 'blue',
    hasRisk: false,
  },
  {
    type: 'STUDENT',
    title: 'Student',
    description: 'For educational platforms, credential verification, and learning dApps.',
    icon: GraduationCap,
    color: 'purple',
    hasRisk: false,
  },
  {
    type: 'GAMER',
    title: 'Gamer',
    description: 'For blockchain games, NFT gaming, and play-to-earn platforms.',
    icon: Gamepad2,
    color: 'orange',
    hasRisk: false,
  },
  {
    type: 'EXPLORER',
    title: 'Explorer',
    description: 'For general web3 browsing, discovery, and multi-purpose interactions.',
    icon: Compass,
    color: 'cyan',
    hasRisk: false,
  },
  {
    type: 'GUARDIAN',
    title: 'Guardian',
    description: 'For high-security operations, asset management, and sensitive transactions.',
    icon: ShieldCheck,
    color: 'red',
    hasRisk: false,
  },
];

export function PersonaStudioPage() {
  const { activePersona, setActivePersona } = useStore();
  const [loading, setLoading] = useState<PersonaType | null>(null);
  const [selectedRisk, setSelectedRisk] = useState<Record<string, RiskLevel>>({
    INVESTOR: 'MEDIUM',
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleActivatePersona = async (personaType: PersonaType, hasRisk: boolean) => {
    setLoading(personaType);
    setShowSuccess(false);

    try {
      const riskLevel = hasRisk ? selectedRisk[personaType] : undefined;
      const persona = await activatePersona(personaType, riskLevel);
      setActivePersona(persona);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to activate persona:', error);
    } finally {
      setLoading(null);
    }
  };

  const formatTimeRemaining = (expiresAt: string) => {
    const remaining = new Date(expiresAt).getTime() - Date.now();
    if (remaining < 0) return 'Expired';
    const minutes = Math.floor(remaining / 60000);
    return `${minutes} minutes`;
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Persona Studio</h1>
          <p className="text-gray-600">
            Select a temporary Persona for your Life Agent. Each Persona becomes a Zero-Knowledge
            mask your dApps can trust without seeing your identity.
          </p>
        </div>

        {activePersona && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                  <User2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-purple-600 font-medium">Currently Active</p>
                  <p className="text-xl font-bold text-purple-900">
                    {activePersona.type}
                    {activePersona.riskLevel && (
                      <span className="text-base ml-2 text-purple-700">
                        ({activePersona.riskLevel} Risk)
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-purple-600">
                    Expires in {formatTimeRemaining(activePersona.expiresAt)}
                  </p>
                </div>
              </div>
              {showSuccess && (
                <div className="flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Persona activated!</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {personas.map((persona) => {
            const Icon = persona.icon;
            const isActive = activePersona?.type === persona.type;
            const isLoading = loading === persona.type;

            return (
              <div
                key={persona.type}
                className={`bg-white rounded-xl border-2 transition-all ${
                  isActive
                    ? 'border-purple-300 shadow-lg shadow-purple-100'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-${persona.color}-100`}>
                      <Icon className={`w-6 h-6 text-${persona.color}-600`} />
                    </div>
                    {isActive && (
                      <div className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded font-medium">
                        ACTIVE
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">{persona.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{persona.description}</p>

                  {persona.hasRisk && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Risk Level
                      </label>
                      <div className="flex space-x-2">
                        {(['LOW', 'MEDIUM', 'HIGH'] as RiskLevel[]).map((risk) => (
                          <button
                            key={risk}
                            onClick={() => setSelectedRisk({ ...selectedRisk, [persona.type]: risk })}
                            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              selectedRisk[persona.type] === risk
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {risk}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => handleActivatePersona(persona.type, persona.hasRisk)}
                    disabled={isLoading}
                    className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
                      isActive
                        ? 'bg-purple-600 hover:bg-purple-700 text-white'
                        : 'bg-gray-900 hover:bg-gray-800 text-white'
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Activating...</span>
                      </>
                    ) : (
                      <span>{isActive ? 'Re-activate' : 'Use this Persona'}</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
