import { useStore } from '../state/store';
import { Settings, Shield, Lock, Zap } from 'lucide-react';
import type { PersonaType } from '../types';

export function SettingsPage() {
  const { settings, updateSettings } = useStore();

  const personas: PersonaType[] = ['INVESTOR', 'VOTER', 'STUDENT', 'GAMER', 'EXPLORER', 'GUARDIAN'];

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">
            Configure default behaviors for your personas and Life Agent.
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Persona Defaults</h2>
                <p className="text-sm text-gray-600">Set default persona and expiration settings</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Persona
                </label>
                <select
                  value={settings.defaultPersona}
                  onChange={(e) => updateSettings({ defaultPersona: e.target.value as PersonaType })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {personas.map((persona) => (
                    <option key={persona} value={persona}>
                      {persona}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-2">
                  This persona will be suggested when you first connect your wallet
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Auto Persona Expiration
                </label>
                <select
                  value={settings.defaultExpiration}
                  onChange={(e) => updateSettings({ defaultExpiration: e.target.value as typeof settings.defaultExpiration })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="10min">10 minutes</option>
                  <option value="1hour">1 hour</option>
                  <option value="1day">1 day</option>
                </select>
                <p className="text-xs text-gray-500 mt-2">
                  Default time until persona automatically expires
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">AI Agent Controls</h2>
                <p className="text-sm text-gray-600">Configure automated agent behaviors</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="autoSwitch"
                  checked={settings.allowAutoSwitch}
                  onChange={(e) => updateSettings({ allowAutoSwitch: e.target.checked })}
                  className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <label htmlFor="autoSwitch" className="text-sm font-medium text-gray-900 cursor-pointer">
                    Allow Life Agent to auto-switch Persona based on context
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Your agent can suggest or automatically switch personas when it detects you're
                    interacting with a specific type of dApp (e.g., switching to Investor for DeFi)
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="autoProofs"
                  checked={settings.allowAutoProofs}
                  onChange={(e) => updateSettings({ allowAutoProofs: e.target.checked })}
                  className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <label htmlFor="autoProofs" className="text-sm font-medium text-gray-900 cursor-pointer">
                    Allow Life Agent to auto-generate proofs
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    When enabled, your agent can automatically create ZK proofs for known dApps.
                    Note: You'll still need to sign transactions in your wallet
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-blue-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Lock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Privacy</h2>
                <p className="text-sm text-gray-600">Core privacy guarantees</p>
              </div>
            </div>

            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-start space-x-3 bg-white rounded-lg p-3">
                <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Identity Protection</p>
                  <p className="text-gray-600">
                    We never expose your DID or AI memory directly to any dApp or third party
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 bg-white rounded-lg p-3">
                <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Zero-Knowledge Proofs</p>
                  <p className="text-gray-600">
                    All proofs are Zero-Knowledge at the protocol level. Only proof validity is
                    revealed, never the underlying identity or data
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 bg-white rounded-lg p-3">
                <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Persona Isolation</p>
                  <p className="text-gray-600">
                    Each persona operates independently with separate privacy boundaries and
                    automatic expiration for fresh context
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 bg-white rounded-lg p-3">
                <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Local Storage Only</p>
                  <p className="text-gray-600">
                    Your settings, activity log, and preferences are stored locally in your browser.
                    No server-side tracking or data collection
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
