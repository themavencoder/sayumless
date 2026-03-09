// MediaPipe FaceLandmarker configuration for eye contact detection

// Eye landmark indices from the 468-point face mesh
// Left eye iris: 468-472, Right eye iris: 473-477
// Left eye corners: 33 (outer), 133 (inner)
// Right eye corners: 362 (outer), 263 (inner)
// Left eye top/bottom: 159 (top), 145 (bottom)
// Right eye top/bottom: 386 (top), 374 (bottom)

export const EYE_LANDMARKS = {
  leftIris: [468, 469, 470, 471, 472],
  rightIris: [473, 474, 475, 476, 477],
  leftEyeInner: 133,
  leftEyeOuter: 33,
  rightEyeInner: 263,
  rightEyeOuter: 362,
  leftEyeTop: 159,
  leftEyeBottom: 145,
  rightEyeTop: 386,
  rightEyeBottom: 374,
} as const;

// How centered the iris needs to be to count as "looking at camera"
// 0.5 = perfectly centered, threshold is how far from center is acceptable
export const EYE_CONTACT_THRESHOLD = 0.35;

// Smoothing window size (number of frames)
export const SMOOTHING_WINDOW = 30;

// FPS for real-time analysis (lower = less CPU)
export const ANALYSIS_FPS = 10;

// Model paths
export const FACE_LANDMARKER_MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

/**
 * Calculate how centered an iris is within the eye bounds.
 * Returns a value where 0.5 = perfectly centered.
 */
export function calculateIrisCenter(
  irisX: number,
  eyeInnerX: number,
  eyeOuterX: number
): number {
  const eyeWidth = Math.abs(eyeOuterX - eyeInnerX);
  if (eyeWidth === 0) return 0.5;
  // Normalize iris position relative to eye bounds
  const minX = Math.min(eyeInnerX, eyeOuterX);
  return (irisX - minX) / eyeWidth;
}

/**
 * Determine if the user is looking at the camera based on iris positions.
 */
export function isLookingAtCamera(
  leftIrisCenterX: number,
  rightIrisCenterX: number,
  leftIrisCenterY: number,
  rightIrisCenterY: number,
  threshold: number = EYE_CONTACT_THRESHOLD
): boolean {
  // Both eyes should have iris near center (0.5)
  const leftDeviationX = Math.abs(leftIrisCenterX - 0.5);
  const rightDeviationX = Math.abs(rightIrisCenterX - 0.5);
  const leftDeviationY = Math.abs(leftIrisCenterY - 0.5);
  const rightDeviationY = Math.abs(rightIrisCenterY - 0.5);

  return (
    leftDeviationX < threshold &&
    rightDeviationX < threshold &&
    leftDeviationY < threshold &&
    rightDeviationY < threshold
  );
}
