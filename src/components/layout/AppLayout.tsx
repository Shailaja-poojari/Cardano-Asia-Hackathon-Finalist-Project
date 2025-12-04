// src/components/layout/AppLayout.tsx
import { Outlet, NavLink } from 'react-router-dom';
import {
  Shield,
  LayoutDashboard,
  User2,
  MessageSquare,
  FileCheck,
  Activity,
  Settings as SettingsIcon,
  Wallet,
} from 'lucide-react';
import { useStore } from '../../state/store';

export function AppLayout() {
  const { wallet, identity, connectWallet } = useStore();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'
    }`;

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center space-x-3">
          <Shield className="w-7 h-7 text-blue-600" />
          <div>
            <p className="text-sm font-semibold text-gray-900">Midnight Persona Layer</p>
            <p className="text-xs text-gray-500">Cardano Life Agents</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <NavLink to="/app" end className={navLinkClass}>
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/app/personas" className={navLinkClass}>
            <User2 className="w-4 h-4" />
            <span>Persona Studio</span>
          </NavLink>
          <NavLink to="/app/chat" className={navLinkClass}>
            <MessageSquare className="w-4 h-4" />
            <span>Agent Chat</span>
          </NavLink>
          <NavLink to="/app/proofs" className={navLinkClass}>
            <FileCheck className="w-4 h-4" />
            <span>Proof Center</span>
          </NavLink>
          <NavLink to="/app/activity" className={navLinkClass}>
            <Activity className="w-4 h-4" />
            <span>Activity Log</span>
          </NavLink>
          <NavLink to="/app/settings" className={navLinkClass}>
            <SettingsIcon className="w-4 h-4" />
            <span>Settings</span>
          </NavLink>
        </nav>

        {/* Wallet block (keep your version if different) */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={connectWallet}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <Wallet className="w-4 h-4" />
            <span>{wallet.connected ? 'Reconnect Wallet' : 'Connect Wallet'}</span>
          </button>
          {wallet.connected && wallet.address && (
            <p className="mt-2 text-xs text-gray-500 font-mono break-all">
              {wallet.address.substring(0, 24)}...
            </p>
          )}
        </div>
      </aside>

      {/* Main area */}
      <main className="flex-1 flex flex-col">
        <header className="h-14 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {identity.did ? (
              <span className="font-mono">
                DID: {identity.did.substring(0, 30)}...
              </span>
            ) : (
              <span>No DID yet – connect wallet to create mock DID</span>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
