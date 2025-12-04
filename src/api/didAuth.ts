// src/api/didAuth.ts
import type { AuthSession } from '../types';

const API_BASE = 'http://localhost:4000/api/auth';

export async function didSignUp(): Promise<AuthSession & { publicKey: string; privateKey: string }> {
  const res = await fetch(`${API_BASE}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    throw new Error('Signup failed');
  }

  const data = await res.json();

  // Store DID and keys in localStorage (demo only)
  localStorage.setItem('demo_did', data.did);
  localStorage.setItem('demo_privateKey', data.privateKey);
  localStorage.setItem('demo_publicKey', data.publicKey);

  // No login yet, so no token
  return {
    did: data.did,
    token: '',
    publicKey: data.publicKey,
    privateKey: data.privateKey,
  };
}

export async function didLogin(): Promise<AuthSession> {
  const did = localStorage.getItem('demo_did');
  const privateKey = localStorage.getItem('demo_privateKey');

  if (!did || !privateKey) {
    throw new Error('No DID/private key found in browser. Please sign up first.');
  }

  const challengeRes = await fetch(`${API_BASE}/login-challenge`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ did }),
  });

  if (!challengeRes.ok) {
    throw new Error('Failed to get login challenge');
  }
  const { challenge } = await challengeRes.json();

  const verifyRes = await fetch(`${API_BASE}/login-verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ did, privateKey, challenge }),
  });

  if (!verifyRes.ok) {
    throw new Error('Login verification failed');
  }

  const data = await verifyRes.json();

  // Store real JWT token
  localStorage.setItem('demo_token', data.token);

  return {
    did: data.did,
    token: data.token,
  };
}
