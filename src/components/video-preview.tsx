"use client";

import { useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface VideoPreviewProps {
  stream: MediaStream | null;
  isRecording: boolean;
  className?: string;
  children?: React.ReactNode;
  onVideoElement?: (el: HTMLVideoElement | null) => void;
}

export function VideoPreview({ stream, isRecording, className, children, onVideoElement }: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const setRef = useCallback((el: HTMLVideoElement | null) => {
    (videoRef as React.MutableRefObject<HTMLVideoElement | null>).current = el;
    onVideoElement?.(el);
  }, [onVideoElement]);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div
      className={cn(
        "relative aspect-video bg-black/50 rounded-2xl overflow-hidden",
        isRecording && "ring-2 ring-cyan-500/30 pulse-glow",
        className
      )}
    >
      {stream ? (
        <>
          <video
            ref={setRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover scale-x-[-1]"
          />
          {isRecording && (
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-white drop-shadow-lg">
                REC
              </span>
            </div>
          )}
          {children}
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm text-white/30">
              Camera preview will appear here
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
