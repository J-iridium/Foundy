/**
 * Processes the raw Fetch Response.
 * * Responsibilities:
 * 1. Checks HTTP Status codes (throws on 4xx/5xx).
 * 2. Parses the JSON body.
 * 3. Extracts the actual error message from the API if the request failed.
 * 4. Unwraps the { data: ... } envelope from your API.
 */
export async function handleResponse(response: Response): Promise<any> {
  if (!response.ok) {
    let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;

    try {
      const errorBody = await response.json();
      if (errorBody?.error) {
        errorMessage = errorBody.error;
      }
    } catch (e) {
      // If JSON parsing fails (e.g. server returned raw HTML error page),
      // we stick to the generic statusText message above.
    }

    throw new Error(`[Foundy] ${errorMessage}`);
  }

  const body = await response.json().catch(() => null);

  if (!body) {
    return null; 
  }

  if (Object.prototype.hasOwnProperty.call(body, 'data')) {
    return body.data;
  }

  return body;
}