import { Link } from 'react-router-dom';
import { useStore } from '../state/store';
import { Wallet, Shield, User2, MessageSquare, FileCheck, Activity, Clock, CheckCircle, XCircle } from 'lucide-react';

export function DashboardPage() {
  const { wallet, identity, activePersona, activities } = useStore();

  const formatTimeRemaining = (expiresAt: string) => {
    const remaining = new Date(expiresAt).getTime() - Date.now();
    if (remaining < 0) return 'Expired';
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);

    if (hours < 1) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes} minutes ago`;
    }
    if (hours < 24) {
      return `${hours} hours ago`;
    }
    return date.toLocaleDateString();
  };

  const recentActivities = activities.slice(0, 5);

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Wallet Status</h2>
              <Wallet className="w-5 h-5 text-gray-400" />
            </div>
            {wallet.connected ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium text-green-700">Connected</span>
                </div>
                <p className="text-sm text-gray-600 font-mono">
                  {wallet.address?.substring(0, 20)}...
                </p>
                <p className="text-xs text-gray-500">Network: {wallet.network}</p>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <XCircle className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">Not connected</span>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">DID Status</h2>
              <Shield className="w-5 h-5 text-gray-400" />
            </div>
            {identity.did ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium text-green-700">DID Active</span>
                </div>
                <p className="text-xs text-gray-600 font-mono break-all">
                  {identity.did}
                </p>
                {identity.hasAgent && (
                  <div className="inline-flex items-center space-x-1 bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
                    <MessageSquare className="w-3 h-3" />
                    <span>Life Agent Active</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <XCircle className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">DID not created yet</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Active Persona</h2>
            <User2 className="w-5 h-5 text-purple-600" />
          </div>
          {activePersona ? (
            <div className="space-y-3">
              <div>
                <p className="text-2xl font-bold text-purple-900">
                  {activePersona.type}
                </p>
                {activePersona.riskLevel && (
                  <p className="text-sm text-purple-600 mt-1">
                    Risk Level: {activePersona.riskLevel}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-2 text-purple-700">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Expires in {formatTimeRemaining(activePersona.expiresAt)}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-600 mb-4">No active persona</p>
              <Link
                to="/personas"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <User2 className="w-4 h-4" />
                <span>Activate Persona</span>
              </Link>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link
            to="/personas"
            className="bg-white hover:bg-gray-50 rounded-xl border border-gray-200 p-6 transition-colors group"
          >
            <User2 className="w-8 h-8 text-purple-600 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Persona Studio</h3>
            <p className="text-sm text-gray-600">Switch or activate personas</p>
          </Link>

          <Link
            to="/chat"
            className="bg-white hover:bg-gray-50 rounded-xl border border-gray-200 p-6 transition-colors group"
          >
            <MessageSquare className="w-8 h-8 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Chat with Agent</h3>
            <p className="text-sm text-gray-600">Talk to your Life Agent</p>
          </Link>

          <Link
            to="/proofs"
            className="bg-white hover:bg-gray-50 rounded-xl border border-gray-200 p-6 transition-colors group"
          >
            <FileCheck className="w-8 h-8 text-green-600 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Generate Proof</h3>
            <p className="text-sm text-gray-600">Create ZK persona proofs</p>
          </Link>

          <Link
            to="/activity"
            className="bg-white hover:bg-gray-50 rounded-xl border border-gray-200 p-6 transition-colors group"
          >
            <Activity className="w-8 h-8 text-orange-600 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Activity Log</h3>
            <p className="text-sm text-gray-600">View recent actions</p>
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          {recentActivities.length > 0 ? (
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.category === 'PERSONA' ? 'bg-purple-500' :
                    activity.category === 'PROOF' ? 'bg-green-500' :
                    activity.category === 'AGENT' ? 'bg-blue-500' :
                    'bg-gray-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.label}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatTimestamp(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
}
