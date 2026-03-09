"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FillerWord } from "@/types";

interface VideoPlaybackProps {
  videoUrl: string | null;
  videoBlob: Blob | null;
  fillerWords?: FillerWord[];
  seekTo?: number;
  className?: string;
}

export function VideoPlayback({
  videoUrl,
  videoBlob,
  fillerWords = [],
  seekTo,
  className,
}: VideoPlaybackProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  useEffect(() => {
    if (seekTo !== undefined && videoRef.current) {
      videoRef.current.currentTime = seekTo;
    }
  }, [seekTo]);

  useEffect(() => {
    if (videoRef.current) {
      if (videoBlob) {
        videoRef.current.src = URL.createObjectURL(videoBlob);
      } else if (videoUrl) {
        videoRef.current.src = videoUrl;
      }
    }
  }, [videoUrl, videoBlob]);

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const restart = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play();
    setIsPlaying(true);
  }, []);

  const cycleSpeed = useCallback(() => {
    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const nextIndex = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    const newRate = speeds[nextIndex];
    setPlaybackRate(newRate);
    if (videoRef.current) {
      videoRef.current.playbackRate = newRate;
    }
  }, [playbackRate]);

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  }, []);

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    videoRef.current.currentTime = percent * duration;
  }, [duration]);

  if (!videoUrl && !videoBlob) {
    return (
      <div className={cn("bg-muted rounded-2xl aspect-video flex items-center justify-center", className)}>
        <p className="text-sm text-muted-foreground">No video available</p>
      </div>
    );
  }

  const fillerTimestamps: number[] = [];
  for (const fw of fillerWords) {
    fillerTimestamps.push(fw.timestamp);
  }

  return (
    <div className={cn("rounded-2xl overflow-hidden border border-border/60 shadow-sm", className)}>
      <video
        ref={videoRef}
        className="w-full aspect-video object-cover scale-x-[-1] bg-black"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        playsInline
      />

      {/* Timeline with gradient progress */}
      <div
        className="relative h-2 bg-muted cursor-pointer"
        onClick={handleSeek}
      >
        <div
          className="absolute inset-y-0 left-0 bg-[#FF6B6B] transition-all"
          style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
        />
        {fillerTimestamps.map((ts, i) => (
          <div
            key={i}
            className="absolute top-0 w-1.5 h-full bg-gradient-to-b from-amber-400 to-amber-600 rounded-full"
            style={{ left: `${duration > 0 ? (ts / duration) * 100 : 0}%` }}
            title={`Filler word at ${formatTime(ts)}`}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 p-2 bg-white border-t border-border/40">
        <Button variant="ghost" size="sm" onClick={togglePlay} className="h-8 w-8 p-0">
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
        <Button variant="ghost" size="sm" onClick={restart} className="h-8 w-8 p-0">
          <RotateCcw className="w-3.5 h-3.5" />
        </Button>

        <span className="text-xs tabular-nums text-muted-foreground ml-1">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>

        <div className="flex-1" />

        <Button
          variant="outline"
          size="sm"
          onClick={cycleSpeed}
          className="h-7 text-xs tabular-nums"
        >
          {playbackRate}x
        </Button>
      </div>
    </div>
  );
}

function formatTime(seconds: number): string {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec.toString().padStart(2, "0")}`;
}
