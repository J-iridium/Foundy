import type { RequestOptions } from "./types";

/**
 * Executes the actual network call using the native Fetch API.
 * * Features:
 * - Automatically handles Timeouts using AbortController.
 * - Catches network errors (like DNS failure or Offline).
 * - Does NOT check for 404/500 errors (handleResponse.ts does that).
 * * @param options - The prepared URL, method, and headers.
 * @param timeoutMs - Max time to wait before aborting (default 5000ms).
 */
export async function sendRequest(options: RequestOptions, timeoutMs: number = 5000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(options.url, {
      method: options.method,
      headers: options.headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    
    return response;

  } catch (error: unknown) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error(`[Foundy] Request timed out after ${timeoutMs}ms: ${options.url}`);
      }
      throw error;
    }

    throw new Error("[Foundy] Unknown network error occurred");
  }
}