/**
 * Client-side upload helper: gets presigned URL → uploads blob to R2.
 */

interface UploadResult {
  storageUrl: string;
  sizeBytes: number;
}

export async function uploadRecording(
  blob: Blob,
  sessionId: string,
  type: "audio" | "video"
): Promise<UploadResult> {
  // Step 1: Get a presigned upload URL from our API
  const response = await fetch("/api/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId,
      type,
      contentType: blob.type,
      sizeBytes: blob.size,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Failed to get upload URL: ${err}`);
  }

  const { uploadUrl, storageKey } = await response.json();

  // Step 2: Upload the blob directly to R2 via presigned URL
  const uploadResponse = await fetch(uploadUrl, {
    method: "PUT",
    body: blob,
    headers: {
      "Content-Type": blob.type,
    },
  });

  if (!uploadResponse.ok) {
    throw new Error(`Failed to upload to R2: ${uploadResponse.statusText}`);
  }

  return {
    storageUrl: storageKey,
    sizeBytes: blob.size,
  };
}

/**
 * Create a new practice session via the API.
 */
export async function createSession(params: {
  topic: string;
  durationSeconds: number;
  modelSelection: { transcription: string; video: string };
}): Promise<{ id: string }> {
  const response = await fetch("/api/sessions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Failed to create session: ${err}`);
  }

  return response.json();
}

/**
 * Trigger analysis for a completed session.
 */
export async function triggerAnalysis(sessionId: string): Promise<void> {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Failed to trigger analysis: ${err}`);
  }
}
