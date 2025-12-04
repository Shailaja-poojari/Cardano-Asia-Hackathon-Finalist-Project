// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, LogIn, ArrowLeft } from 'lucide-react';
import { didLogin } from '../api/didAuth';

export function LoginPage() {
  const navigate = useNavigate();
  const [didInput, setDidInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const storedDid = localStorage.getItem('demo_did');
    if (!storedDid) {
      setError('No DID token found on this device. Please sign up first.');
      return;
    }

    if (storedDid !== didInput.trim()) {
      setError('The pasted DID token does not match this device. Check and try again.');
      return;
    }

    setLoading(true);
    try {
      const session = await didLogin();
      // If you have a Zustand store, you can set auth session here
      // useStore.getState().setAuthSession(session);

      navigate('/app'); // go to dashboard
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? 'Login failed, please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-slate-900 text-gray-50 flex flex-col">
      {/* Header */}
      <header className="border-b border-white/5 bg-black/40 backdrop-blur">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-2xl bg-blue-600/20 border border-blue-500/50 flex items-center justify-center">
              <Shield className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-semibold">Midnight Persona Layer</p>
              <p className="text-xs text-gray-400">Login with your DID token</p>
            </div>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-1 text-xs text-gray-300 hover:text-white"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to signup
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="max-w-md w-full bg-black/70 border border-white/10 rounded-2xl p-6 shadow-2xl shadow-blue-900/40 space-y-4">
          <div className="space-y-1">
            <p className="text-xs text-blue-300">Step 2 · Paste DID token</p>
            <h1 className="text-lg font-semibold text-white flex items-center gap-2">
              Login with DID
            </h1>
            <p className="text-xs text-gray-400">
              Paste the DID token you generated on this device. We’ll verify it and create
              a short-lived session token, then take you to your dashboard.
            </p>
          </div>

          {error && (
            <div className="text-sm text-red-400 bg-red-950/40 border border-red-800 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 mt-2">
            <div className="space-y-1">
              <label className="text-xs text-gray-300">DID token</label>
              <textarea
                className="w-full text-xs bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-gray-100 resize-none h-20 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="did:demo:..."
                value={didInput}
                onChange={(e) => setDidInput(e.target.value)}
              />
              <p className="text-[11px] text-gray-500">
                Paste exactly the DID token you copied from the signup screen. It must match
                the DID stored in this browser.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 px-4 py-2.5 text-sm font-medium transition-colors"
            >
              <LogIn className="w-4 h-4 mr-2" />
              {loading ? 'Verifying DID…' : 'Login & open dashboard'}
            </button>
          </form>

          <div className="text-[11px] text-gray-500 pt-1">
            Lost your DID token?{' '}
            <span className="text-gray-300">
              Generate a new one on the{' '}
              <Link to="/" className="text-blue-400 hover:text-blue-300 underline">
                signup page
              </Link>
              .
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
