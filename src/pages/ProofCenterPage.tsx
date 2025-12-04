import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useStore } from '../state/store';
import { generatePersonaProof } from '../api/mockApi';
import { FileCheck, Copy, CheckCircle, AlertCircle, Loader2, Clock } from 'lucide-react';
import type { ProofScope } from '../types';

export function ProofCenterPage() {
  const { activePersona, proofs, addProof } = useStore();
  const [selectedScope, setSelectedScope] = useState<ProofScope>('DEFI');
  const [selectedDuration, setSelectedDuration] = useState<string>('10min');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const handleGenerateProof = async () => {
    if (!activePersona) return;

    setLoading(true);
    try {
      const proof = await generatePersonaProof(activePersona, selectedScope, selectedDuration);
      addProof(proof);
    } catch (error) {
      console.error('Failed to generate proof:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyProof = async (proofPayload: string, proofId: string) => {
    try {
      await navigator.clipboard.writeText(proofPayload);
      setCopied(proofId);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const getProofStatus = (validUntil: string) => {
    const now = Date.now();
    const expiry = new Date(validUntil).getTime();
    return expiry > now ? 'VALID' : 'EXPIRED';
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const scopeLabels: Record<ProofScope, string> = {
    DEFI: 'DeFi',
    DAO: 'DAO Governance',
    GAME: 'Gaming',
    EDU: 'Education',
    GENERIC: 'Generic',
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Proof Center</h1>
          <p className="text-gray-600">
            Generate Zero-Knowledge Persona Proofs that dApps can verify without seeing your identity,
            wallet, or private data.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Generate New Proof</h2>

          {activePersona ? (
            <div className="space-y-6">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-sm text-purple-600 font-medium mb-1">Active Persona</p>
                <p className="text-lg font-bold text-purple-900">
                  {activePersona.type}
                  {activePersona.riskLevel && ` (${activePersona.riskLevel} Risk)`}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Scope
                </label>
                <select
                  value={selectedScope}
                  onChange={(e) => setSelectedScope(e.target.value as ProofScope)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(scopeLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Validity Duration
                </label>
                <select
                  value={selectedDuration}
                  onChange={(e) => setSelectedDuration(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="10min">10 minutes</option>
                  <option value="1hour">1 hour</option>
                  <option value="1day">1 day</option>
                </select>
              </div>

              <button
                onClick={handleGenerateProof}
                disabled={loading}
                className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Generating ZK Proof...</span>
                  </>
                ) : (
                  <>
                    <FileCheck className="w-5 h-5" />
                    <span>Generate ZK Proof</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-4">No active persona. Please activate a persona first.</p>
              <Link
                to="/app/personas"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <span>Go to Persona Studio</span>
              </Link>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Existing Proofs</h2>

          {proofs.length > 0 ? (
            <div className="space-y-4">
              {proofs.map((proof) => {
                const status = getProofStatus(proof.validUntil);
                const isCopied = copied === proof.id;

                return (
                  <div
                    key={proof.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                          <FileCheck className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {proof.personaType}
                            {proof.riskLevel && (
                              <span className="text-sm text-gray-600 ml-2">
                                ({proof.riskLevel})
                              </span>
                            )}
                          </p>
                          <p className="text-sm text-gray-600">
                            For {scopeLabels[proof.scope]} dApp
                          </p>
                        </div>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          status === 'VALID'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {status}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                      <div>
                        <p className="text-gray-500">Created</p>
                        <p className="text-gray-900 font-medium">
                          {formatTimestamp(proof.createdAt)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Valid Until</p>
                        <p className="text-gray-900 font-medium flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatTimestamp(proof.validUntil)}
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded p-3 mb-3">
                      <p className="text-xs text-gray-500 mb-1">Proof Payload</p>
                      <p className="text-xs font-mono text-gray-700 break-all">
                        {proof.proofPayload.substring(0, 80)}...
                      </p>
                    </div>

                    <button
                      onClick={() => handleCopyProof(proof.proofPayload, proof.id)}
                      className="w-full py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      {isCopied ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy Proof Payload</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileCheck className="w-16 h-16 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No proofs generated yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
