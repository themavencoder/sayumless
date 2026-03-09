import { HumeClient } from "hume";
import { Readable } from "stream";
import fs from "fs";
import os from "os";
import path from "path";

let _client: HumeClient | null = null;

export function getHumeClient(): HumeClient {
  if (!_client) {
    const apiKey = process.env.HUME_API_KEY;
    if (!apiKey) throw new Error("HUME_API_KEY is required");
    _client = new HumeClient({ apiKey });
  }
  return _client;
}

export interface VideoAnalysisResult {
  eyeContactPercentage: number;
  confidenceScore: number;
  mannerisms: Array<{
    type: string;
    frequency: number;
    timestamps: number[];
  }>;
  emotions: Array<{
    timestamp: number;
    emotions: Record<string, number>;
    dominantEmotion: string;
  }>;
}

// Emotions that indicate confidence
const CONFIDENT_EMOTIONS = new Set([
  "Calmness", "Determination", "Concentration", "Interest", "Joy", "Pride",
]);

// Emotions that indicate low confidence
const LOW_CONFIDENCE_EMOTIONS = new Set([
  "Anxiety", "Fear", "Distress", "Nervousness", "Doubt", "Embarrassment", "Shame",
]);

export async function analyzeVideo(videoBuffer: Buffer, mimeType: string): Promise<VideoAnalysisResult> {
  const client = getHumeClient();

  // Write buffer to temp file (Hume SDK needs a file stream)
  const ext = mimeType.includes("webm") ? ".webm" : ".mp4";
  const tmpPath = path.join(os.tmpdir(), `sayumless-${Date.now()}${ext}`);
  fs.writeFileSync(tmpPath, videoBuffer);

  try {
    // Start batch inference job
    const job = await client.expressionMeasurement.batch.startInferenceJobFromLocalFile({
      file: [fs.createReadStream(tmpPath)],
      json: {
        models: {
          face: {
            fpsPred: 1, // Analyze 1 frame per second
            identifyFaces: true,
            probThreshold: 0.5,
          },
        },
      },
    });

    // Wait for completion (up to 5 minutes)
    await job.awaitCompletion(300);

    // Get predictions
    const predictions = await client.expressionMeasurement.batch.getJobPredictions(
      job.jobId
    );

    return parseFacePredictions(predictions);
  } finally {
    // Clean up temp file
    try { fs.unlinkSync(tmpPath); } catch {}
  }
}

function parseFacePredictions(predictions: unknown[]): VideoAnalysisResult {
  const result: VideoAnalysisResult = {
    eyeContactPercentage: 0,
    confidenceScore: 0,
    mannerisms: [],
    emotions: [],
  };

  if (!predictions || predictions.length === 0) return result;

  // Navigate to face predictions
  const firstResult = predictions[0] as {
    results?: {
      predictions: Array<{
        models: {
          face?: {
            groupedPredictions: Array<{
              id: string;
              predictions: Array<{
                frame: number;
                time: number;
                prob: number;
                emotions: Array<{ name: string; score: number }>;
              }>;
            }>;
          };
        };
      }>;
    };
    error?: string;
  };

  if (firstResult.error || !firstResult.results) {
    console.error("Hume analysis error:", firstResult.error);
    return result;
  }

  const facePredictions = firstResult.results.predictions[0]?.models.face?.groupedPredictions;
  if (!facePredictions || facePredictions.length === 0) return result;

  // Use first person's predictions
  const personPredictions = facePredictions[0].predictions;
  if (personPredictions.length === 0) return result;

  let totalConfidenceScore = 0;
  let framesWithFace = 0;

  for (const pred of personPredictions) {
    framesWithFace++;

    // Build emotion snapshot
    const emotionMap: Record<string, number> = {};
    let dominantEmotion = "";
    let maxScore = 0;

    for (const emo of pred.emotions) {
      emotionMap[emo.name] = Math.round(emo.score * 100) / 100;
      if (emo.score > maxScore) {
        maxScore = emo.score;
        dominantEmotion = emo.name;
      }
    }

    result.emotions.push({
      timestamp: pred.time,
      emotions: emotionMap,
      dominantEmotion,
    });

    // Calculate confidence from emotions
    let confidentSum = 0;
    let lowConfidentSum = 0;
    for (const emo of pred.emotions) {
      if (CONFIDENT_EMOTIONS.has(emo.name)) confidentSum += emo.score;
      if (LOW_CONFIDENCE_EMOTIONS.has(emo.name)) lowConfidentSum += emo.score;
    }
    const frameConfidence = confidentSum / (confidentSum + lowConfidentSum + 0.01);
    totalConfidenceScore += frameConfidence;
  }

  // Eye contact: approximate from face detection probability
  // (high prob = face looking at camera = good eye contact)
  const highProbFrames = personPredictions.filter((p) => p.prob > 0.85).length;
  result.eyeContactPercentage = Math.round((highProbFrames / personPredictions.length) * 100);

  // Average confidence score across all frames
  result.confidenceScore = Math.round((totalConfidenceScore / framesWithFace) * 100);

  return result;
}
