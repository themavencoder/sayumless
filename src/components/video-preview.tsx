"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface VideoPreviewProps {
  stream: MediaStream | null;
  isRecording: boolean;
  className?: string;
}

export function VideoPreview({ stream, isRecording, className }: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div
      className={cn(
        "relative aspect-video bg-muted rounded-lg overflow-hidden",
        className
      )}
    >
      {stream ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover scale-x-[-1]"
          />
          {isRecording && (
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-white drop-shadow-lg">
                REC
              </span>
            </div>
          )}
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-2">📹</div>
            <p className="text-sm text-muted-foreground">
              Camera preview will appear here
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
