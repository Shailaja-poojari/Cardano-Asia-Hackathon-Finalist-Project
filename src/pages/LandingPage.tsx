// src/pages/LandingPage.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  UserPlus,
  Copy,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { didSignUp } from '../api/didAuth';

export function LandingPage() {
  const [signupDid, setSignupDid] = useState<string | null>(null);
  const [copyOk, setCopyOk] = useState(false);
  const [loadingSignup, setLoadingSignup] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async () => {
    setError(null);
    setCopyOk(false);
    setLoadingSignup(true);
    try {
      const result = await didSignUp();
      setSignupDid(result.did);
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? 'Something went wrong while generating your DID.');
    } finally {
      setLoadingSignup(false);
    }
  };

  const handleCopy = async () => {
    if (!signupDid) return;
    try {
      await navigator.clipboard.writeText(signupDid);
      setCopyOk(true);
      setTimeout(() => setCopyOk(false), 1600);
    } catch (e) {
      console.error('Clipboard copy failed', e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-slate-900 text-gray-50 flex flex-col">
      {/* Top nav / brand */}
      <header className="border-b border-white/5 bg-black/40 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-2xl bg-blue-600/20 border border-blue-500/50 flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight">
                Midnight Persona Layer
              </p>
              <p className="text-xs text-gray-400">
                DID-based identity and private agents
              </p>
            </div>
          </div>

          <Link
            to="/login"
            className="inline-flex items-center gap-1 text-xs text-gray-300 hover:text-white"
          >
            Already have a DID token?
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-10 items-start">
          {/* Left: hero copy */}
          <section className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              No passwords. Just your DID token.
            </div>

            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">
              Sign up with a <span className="text-blue-400">decentralized identity</span>,
              keep your token, and log in when you need it.
            </h1>

            <p className="text-sm md:text-base text-gray-300 leading-relaxed max-w-xl">
              We generate a unique DID token for this device. You control when to share it:
              copy it, store it, and use it on the login screen to open a secure session
              without traditional usernames or passwords.
            </p>

            <div className="grid sm:grid-cols-2 gap-3 text-xs text-gray-300">
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-1.5">
                <p className="font-medium text-gray-100">Private by default</p>
                <p className="text-gray-400">
                  No email or phone required. Your DID stays client-side until you choose to use it.
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-1.5">
                <p className="font-medium text-gray-100">Token-based login</p>
                <p className="text-gray-400">
                  Paste your DID token on the login page and we verify it to issue a short-lived JWT.
                </p>
              </div>
            </div>
          </section>

          {/* Right: signup card */}
          <section className="bg-black/60 border border-white/10 rounded-2xl shadow-2xl shadow-blue-900/30 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 text-xs text-blue-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                  Step 1 · Generate DID token
                </div>
                <h2 className="text-lg font-semibold text-white">
                  Sign up with DID
                </h2>
              </div>
            </div>

            <p className="text-xs text-gray-400">
              When you click “Generate DID token”, we create a new decentralized identifier
              just for this browser and show it below. Copy it and keep it safe — you’ll
              paste it on the Login page later.
            </p>

            {error && (
              <div className="text-sm text-red-400 bg-red-950/40 border border-red-800 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <button
              onClick={handleSignUp}
              disabled={loadingSignup}
              className="w-full inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 px-4 py-2.5 text-sm font-medium transition-colors"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              {loadingSignup ? 'Generating your DID token…' : 'Generate DID token'}
            </button>

            {signupDid && (
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2 text-xs text-emerald-300">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Your DID token is ready. Copy it now.</span>
                </div>

                <div className="flex items-center gap-2 bg-gray-950 border border-gray-800 rounded-xl px-3 py-2">
                  <code className="flex-1 text-[11px] break-all text-gray-100">
                    {signupDid}
                  </code>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="p-1.5 rounded-lg border border-gray-700 hover:bg-gray-800"
                  >
                    {copyOk ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-300" />
                    )}
                  </button>
                </div>

                <p className="text-[11px] text-gray-500">
                  Next: go to the <span className="font-medium text-gray-200">Login</span> page
                  and paste this DID token to open your dashboard.
                </p>

                <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
                  <span>Lost your DID token? Just generate a new one.</span>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300"
                  >
                    Go to Login
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
