import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

dotenv.config();

const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

// In-memory stores (RESET every server restart)
const registeredUsers = new Map<string, { publicKey: string; privateKey: string }>();
const loginChallenges = new Map<string, string>();

interface AuthTokenPayload {
  did: string;
  purpose: 'login';
}

// ------------------- AUTH MIDDLEWARE (JWT) -------------------

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing auth token' });
  }

  const token = authHeader.substring('Bearer '.length);

  try {
    const payload = jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
    (req as any).auth = payload; // store user info on request
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// ------------------- utils -------------------

// Generate a fake keypair (demo, not real crypto)
function generateFakeKeypair() {
  const privateKey = crypto.randomBytes(32).toString('hex');
  const publicKey = crypto.randomBytes(32).toString('hex');
  return { privateKey, publicKey };
}

// Derive a DID from public key (demo)
function deriveDidFromPublicKey(publicKey: string): string {
  const hash = crypto.createHash('sha256').update(publicKey).digest('hex');
  return 'did:demo:' + hash.slice(0, 32);
}

// ------------------- 1) SIGNUP -------------------

app.post('/api/auth/signup', async (req: Request, res: Response) => {
  try {
    // In a real system you might accept some registration data in body.
    const { privateKey, publicKey } = generateFakeKeypair();
    const did = deriveDidFromPublicKey(publicKey);

    // Store user in memory
    registeredUsers.set(did, { publicKey, privateKey });

    // For demo: return all three. In real life you NEVER send privateKey from server.
    return res.json({
      did,
      publicKey,
      privateKey,
    });
  } catch (err) {
    console.error('Error in /api/auth/signup:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ------------------- 2) LOGIN CHALLENGE -------------------

app.post('/api/auth/login-challenge', async (req: Request, res: Response) => {
  try {
    const { did } = req.body;

    if (!did) {
      return res.status(400).json({ error: 'Missing DID' });
    }

    if (!registeredUsers.has(did)) {
      return res.status(404).json({ error: 'DID not registered' });
    }

    const challenge = crypto.randomBytes(16).toString('hex');
    loginChallenges.set(did, challenge);

    return res.json({ did, challenge });
  } catch (err) {
    console.error('Error in /api/auth/login-challenge:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ------------------- 3) LOGIN VERIFY -------------------

app.post('/api/auth/login-verify', async (req: Request, res: Response) => {
  try {
    const { did, privateKey, challenge } = req.body;

    if (!did || !privateKey || !challenge) {
      return res.status(400).json({ error: 'Missing did, privateKey or challenge' });
    }

    const user = registeredUsers.get(did);
    if (!user) {
      return res.status(404).json({ error: 'DID not registered' });
    }

    const expectedChallenge = loginChallenges.get(did);
    if (!expectedChallenge) {
      return res.status(400).json({ error: 'No active login challenge for this DID' });
    }

    if (expectedChallenge !== challenge) {
      return res.status(401).json({ error: 'Challenge mismatch' });
    }

    if (user.privateKey !== privateKey) {
      return res.status(401).json({ error: 'Invalid private key' });
    }

    // Success: issue a real JWT session token
    const token = jwt.sign(
      { did, purpose: 'login' } as AuthTokenPayload,
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Clear challenge (one-time use)
    loginChallenges.delete(did);

    return res.json({ did, token });
  } catch (err) {
    console.error('Error in /api/auth/login-verify:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ------------------- 4) EXAMPLE PROTECTED ROUTE -------------------

app.get('/api/me', authMiddleware, (req: Request, res: Response) => {
  const auth = (req as any).auth as AuthTokenPayload;

  return res.json({
    did: auth.did,
    purpose: auth.purpose,
  });
});

// ------------------- SERVER START -------------------

app.listen(PORT, () => {
  console.log(`Auth backend listening on http://localhost:${PORT}`);
});
