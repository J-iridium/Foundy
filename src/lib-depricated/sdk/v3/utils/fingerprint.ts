import FingerprintJS from "@fingerprintjs/fingerprintjs";

let cachedFp: string | null = null;

/** Generates or returns cached fingerprint */
export async function generateFingerprint(): Promise<string> {
  if (cachedFp) return cachedFp;
  try {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    cachedFp = result.visitorId;
    return cachedFp;
  } catch (err) {
    // If fingerprint fails, fallback to a random id (not ideal, but avoids crashing)
    cachedFp = `fallback-${Math.random().toString(36).slice(2, 10)}`;
    return cachedFp;
  }
}