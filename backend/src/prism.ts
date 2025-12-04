// backend/src/prism.ts
import * as PrismSDK from '@atala/prism-wallet-sdk';

const { Apollo, Castor } = PrismSDK as any;

const apollo = new Apollo();
const castor = new Castor(apollo);

/**
 * Verify a DID-based signature using Atala PRISM Castor.
 * @param didString   e.g. "did:prism:..."
 * @param message     the original challenge string
 * @param signatureB64 base64-encoded signature from wallet
 */
export async function verifyPrismDidSignature(
  didString: string,
  message: string,
  signatureB64: string
): Promise<boolean> {
  try {
    const did = castor.parseDID(didString);
    const messageBytes = new TextEncoder().encode(message);
    const signatureBytes = Uint8Array.from(Buffer.from(signatureB64, 'base64'));

    const isValid = await castor.verifySignature(did, messageBytes, signatureBytes);
    return isValid;
  } catch (err) {
    console.error('PRISM verification error:', err);
    return false;
  }
}
