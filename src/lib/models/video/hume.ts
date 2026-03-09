import type { VideoAnalysisAdapter, VideoAnalysisResult } from "../types";

interface HumeEmotion {
  name: string;
  score: number;
}

interface HumePrediction {
  time: { begin: number; end: number };
  emotions: HumeEmotion[];
}

interface HumeResult {
  results: {
    predictions: {
      models: {
        face?: {
          grouped_predictions: {
            predictions: HumePrediction[];
          }[];
        };
      };
    }[];
  };
}

// Mapping Hume emotions to confidence indicators
const CONFIDENCE_EMOTIONS = ["Confidence", "Determination", "Concentration", "Interest"];
const ANXIETY_EMOTIONS = ["Anxiety", "Nervousness", "Fear", "Distress"];

export class HumeVideoAdapter implements VideoAnalysisAdapter {
  provider = "hume" as const;

  async analyze(videoUrl: string): Promise<VideoAnalysisResult> {
    const apiKey = process.env.HUME_API_KEY;
    if (!apiKey) throw new Error("HUME_API_KEY is required");

    // Submit job to Hume Batch API
    const submitResponse = await fetch("https://api.hume.ai/v0/batch/jobs", {
      method: "POST",
      headers: {
        "X-Hume-Api-Key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        urls: [videoUrl],
        models: {
          face: {
            fps_pred: 2,
            identify_faces: false,
          },
        },
      }),
    });

    if (!submitResponse.ok) {
      throw new Error(`Hume API submit failed: ${submitResponse.status}`);
    }

    const { job_id } = await submitResponse.json();

    // Poll for completion
    const result = await this.pollForResult(apiKey, job_id);
    return this.parseHumeResult(result);
  }

  private async pollForResult(apiKey: string, jobId: string, maxAttempts = 60): Promise<HumeResult> {
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const response = await fetch(`https://api.hume.ai/v0/batch/jobs/${jobId}/predictions`, {
        headers: { "X-Hume-Api-Key": apiKey },
      });

      if (response.status === 200) {
        return response.json();
      }

      if (response.status !== 202) {
        // Check if job failed
        const statusResponse = await fetch(`https://api.hume.ai/v0/batch/jobs/${jobId}`, {
          headers: { "X-Hume-Api-Key": apiKey },
        });
        const status = await statusResponse.json();
        if (status.state?.status === "FAILED") {
          throw new Error(`Hume job failed: ${status.state?.message || "Unknown error"}`);
        }
      }
    }

    throw new Error("Hume analysis timed out after 2 minutes");
  }

  private parseHumeResult(data: HumeResult): VideoAnalysisResult {
    const predictions = data.results?.predictions?.[0]?.models?.face?.grouped_predictions?.[0]?.predictions || [];

    if (predictions.length === 0) {
      return {
        eyeContactPercentage: 0,
        confidenceScore: 50,
        mannerisms: [],
        keyFrames: [],
        emotions: [],
        modelProvider: "hume",
      };
    }

    // Extract emotion snapshots
    const emotions = predictions.map((pred) => {
      const emotionMap: Record<string, number> = {};
      let dominant = { name: "", score: 0 };

      for (const e of pred.emotions) {
        emotionMap[e.name] = Math.round(e.score * 100);
        if (e.score > dominant.score) {
          dominant = e;
        }
      }

      return {
        timestamp: pred.time.begin,
        emotions: emotionMap,
        dominantEmotion: dominant.name,
      };
    });

    // Calculate confidence score from emotion data
    let totalConfidence = 0;
    let totalAnxiety = 0;

    for (const pred of predictions) {
      for (const e of pred.emotions) {
        if (CONFIDENCE_EMOTIONS.includes(e.name)) {
          totalConfidence += e.score;
        }
        if (ANXIETY_EMOTIONS.includes(e.name)) {
          totalAnxiety += e.score;
        }
      }
    }

    const avgConfidence = totalConfidence / predictions.length;
    const avgAnxiety = totalAnxiety / predictions.length;
    const confidenceScore = Math.round(
      Math.max(0, Math.min(100, (avgConfidence - avgAnxiety) * 100 + 50))
    );

    // Hume doesn't directly measure eye contact, estimate from "Concentration" emotion
    const concentrationScores = predictions.map((pred) => {
      const concentration = pred.emotions.find((e) => e.name === "Concentration");
      return concentration?.score || 0;
    });
    const eyeContactEstimate = Math.round(
      (concentrationScores.reduce((sum, s) => sum + s, 0) / concentrationScores.length) * 100
    );

    return {
      eyeContactPercentage: eyeContactEstimate,
      confidenceScore,
      mannerisms: [],
      keyFrames: [],
      emotions,
      modelProvider: "hume",
    };
  }
}
