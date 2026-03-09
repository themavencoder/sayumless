"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  EYE_LANDMARKS,
  SMOOTHING_WINDOW,
  ANALYSIS_FPS,
  FACE_LANDMARKER_MODEL_URL,
  calculateIrisCenter,
  isLookingAtCamera as checkLookingAtCamera,
} from "@/lib/mediapipe-config";

interface UseEyeTrackingReturn {
  eyeContactPercentage: number;
  isLookingAtCamera: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useEyeTracking(
  videoElement: HTMLVideoElement | null,
  isActive: boolean
): UseEyeTrackingReturn {
  const [eyeContactPercentage, setEyeContactPercentage] = useState(0);
  const [isLooking, setIsLooking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const faceLandmarkerRef = useRef<any>(null);
  const frameBufferRef = useRef<boolean[]>([]);
  const rafRef = useRef<number>(0);
  const lastProcessTimeRef = useRef(0);
  const activeRef = useRef(false);

  const cleanup = useCallback(() => {
    activeRef.current = false;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
    if (faceLandmarkerRef.current) {
      try {
        faceLandmarkerRef.current.close();
      } catch {
        // ignore
      }
      faceLandmarkerRef.current = null;
    }
    frameBufferRef.current = [];
    lastProcessTimeRef.current = 0;
  }, []);

  useEffect(() => {
    if (!isActive || !videoElement) {
      cleanup();
      setIsLoading(true);
      return;
    }

    let cancelled = false;
    activeRef.current = true;

    async function init() {
      try {
        setIsLoading(true);
        setError(null);

        // Wait for the video stream to be fully ready before loading the heavy model.
        // This prevents the browser from OOMing with simultaneous resource allocation.
        await new Promise<void>((resolve) => {
          if (videoElement!.readyState >= 2) {
            resolve();
            return;
          }
          const onReady = () => {
            videoElement!.removeEventListener("loadeddata", onReady);
            resolve();
          };
          videoElement!.addEventListener("loadeddata", onReady);
        });

        // Extra breathing room after video is ready
        await new Promise((r) => setTimeout(r, 1500));
        if (cancelled) return;

        const vision = await import("@mediapipe/tasks-vision");
        const { FaceLandmarker, FilesetResolver } = vision;

        if (cancelled) return;

        const filesetResolver = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/wasm"
        );

        if (cancelled) return;

        // Use CPU delegate only — GPU delegate can hard-crash the browser tab
        const landmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
          baseOptions: {
            modelAssetPath: FACE_LANDMARKER_MODEL_URL,
            delegate: "CPU",
          },
          outputFaceBlendshapes: false,
          outputFacialTransformationMatrixes: false,
          runningMode: "VIDEO",
          numFaces: 1,
        });

        if (cancelled) {
          landmarker.close();
          return;
        }

        faceLandmarkerRef.current = landmarker;
        setIsLoading(false);
        startProcessing();
      } catch (err) {
        if (cancelled) return;
        console.error("Failed to init FaceLandmarker:", err);
        setError("Could not load eye tracking model");
        setIsLoading(false);
      }
    }

    function startProcessing() {
      const minInterval = 1000 / ANALYSIS_FPS;

      function processFrame() {
        if (!activeRef.current) return;

        const now = performance.now();
        if (now - lastProcessTimeRef.current < minInterval) {
          rafRef.current = requestAnimationFrame(processFrame);
          return;
        }
        lastProcessTimeRef.current = now;

        try {
          const landmarker = faceLandmarkerRef.current;
          if (!landmarker || !videoElement || videoElement.readyState < 2) {
            rafRef.current = requestAnimationFrame(processFrame);
            return;
          }

          const results = landmarker.detectForVideo(videoElement, Math.round(now));

          if (results?.faceLandmarks?.[0]) {
            const landmarks = results.faceLandmarks[0];

            const leftIrisX = landmarks[EYE_LANDMARKS.leftIris[0]]?.x ?? 0.5;
            const rightIrisX = landmarks[EYE_LANDMARKS.rightIris[0]]?.x ?? 0.5;
            const leftIrisY = landmarks[EYE_LANDMARKS.leftIris[0]]?.y ?? 0.5;
            const rightIrisY = landmarks[EYE_LANDMARKS.rightIris[0]]?.y ?? 0.5;

            const leftInnerX = landmarks[EYE_LANDMARKS.leftEyeInner]?.x ?? 0;
            const leftOuterX = landmarks[EYE_LANDMARKS.leftEyeOuter]?.x ?? 1;
            const rightInnerX = landmarks[EYE_LANDMARKS.rightEyeInner]?.x ?? 0;
            const rightOuterX = landmarks[EYE_LANDMARKS.rightEyeOuter]?.x ?? 1;

            const leftTopY = landmarks[EYE_LANDMARKS.leftEyeTop]?.y ?? 0;
            const leftBottomY = landmarks[EYE_LANDMARKS.leftEyeBottom]?.y ?? 1;
            const rightTopY = landmarks[EYE_LANDMARKS.rightEyeTop]?.y ?? 0;
            const rightBottomY = landmarks[EYE_LANDMARKS.rightEyeBottom]?.y ?? 1;

            const leftNormX = calculateIrisCenter(leftIrisX, leftInnerX, leftOuterX);
            const rightNormX = calculateIrisCenter(rightIrisX, rightInnerX, rightOuterX);

            const leftEyeHeight = Math.abs(leftBottomY - leftTopY);
            const rightEyeHeight = Math.abs(rightBottomY - rightTopY);
            const leftNormY = leftEyeHeight > 0 ? (leftIrisY - leftTopY) / leftEyeHeight : 0.5;
            const rightNormY = rightEyeHeight > 0 ? (rightIrisY - rightTopY) / rightEyeHeight : 0.5;

            const looking = checkLookingAtCamera(leftNormX, rightNormX, leftNormY, rightNormY);

            frameBufferRef.current.push(looking);
            if (frameBufferRef.current.length > SMOOTHING_WINDOW) {
              frameBufferRef.current.shift();
            }

            const lookingFrames = frameBufferRef.current.filter(Boolean).length;
            const percentage = Math.round((lookingFrames / frameBufferRef.current.length) * 100);

            setIsLooking(looking);
            setEyeContactPercentage(percentage);
          }
        } catch {
          // Silently continue on frame processing errors
        }

        rafRef.current = requestAnimationFrame(processFrame);
      }

      rafRef.current = requestAnimationFrame(processFrame);
    }

    init();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [isActive, videoElement, cleanup]);

  return {
    eyeContactPercentage,
    isLookingAtCamera: isLooking,
    isLoading,
    error,
  };
}
