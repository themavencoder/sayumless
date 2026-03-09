import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.R2_BUCKET_NAME || "speech-coach-recordings";

/**
 * Generate a presigned URL for uploading a recording to R2.
 */
export async function getUploadUrl(key: string, contentType: string): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType,
  });

  return getSignedUrl(r2Client, command, { expiresIn: 3600 }); // 1 hour
}

/**
 * Generate a presigned URL for downloading/viewing a recording from R2.
 */
export async function getDownloadUrl(key: string): Promise<string> {
  // If a public URL is configured, use it directly
  if (process.env.R2_PUBLIC_URL) {
    return `${process.env.R2_PUBLIC_URL}/${key}`;
  }

  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });

  return getSignedUrl(r2Client, command, { expiresIn: 3600 });
}

/**
 * Generate a storage key for a recording.
 */
export function generateStorageKey(userId: string, sessionId: string, type: "audio" | "video"): string {
  const ext = type === "video" ? "webm" : "webm";
  return `recordings/${userId}/${sessionId}/${type}.${ext}`;
}
