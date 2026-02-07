"use client";

import * as React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import { Text, Icon } from "@/components";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

export interface VideoPlayerProps {
  /** Video source URL */
  src: string;
  /** Video poster/thumbnail image */
  poster?: string;
  /** Video title */
  title?: string;
  /** Whether to autoplay the video */
  autoPlay?: boolean;
  /** Handler when video ends */
  onEnded?: () => void;
  /** Handler for progress updates */
  onProgress?: (progress: number) => void;
  /** Handler when video starts playing */
  onPlay?: () => void;
  /** Handler when video pauses */
  onPause?: () => void;
  /** Initial playback position (in seconds) */
  initialTime?: number;
  /** Additional class names */
  className?: string;
}

// ============================================================================
// Helper Functions
// ============================================================================

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// ============================================================================
// Component
// ============================================================================

export function VideoPlayer({
  src,
  poster,
  title,
  autoPlay = false,
  onEnded,
  onProgress,
  onPlay,
  onPause,
  initialTime = 0,
  className,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize video
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      if (initialTime > 0) {
        video.currentTime = initialTime;
      }
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      const progress = (video.currentTime / video.duration) * 100;
      onProgress?.(progress);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onEnded?.();
    };

    const handlePlay = () => {
      setIsPlaying(true);
      onPlay?.();
    };

    const handlePause = () => {
      setIsPlaying(false);
      onPause?.();
    };

    const handleWaiting = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("canplay", handleCanPlay);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("canplay", handleCanPlay);
    };
  }, [initialTime, onEnded, onProgress, onPlay, onPause]);

  // Auto-hide controls
  const showControlsTemporarily = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, [isPlaying]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!videoRef.current) return;

      switch (e.key) {
        case " ":
        case "k":
          e.preventDefault();
          togglePlay();
          break;
        case "m":
          toggleMute();
          break;
        case "f":
          toggleFullscreen();
          break;
        case "ArrowLeft":
          e.preventDefault();
          skip(-10);
          break;
        case "ArrowRight":
          e.preventDefault();
          skip(10);
          break;
        case "ArrowUp":
          e.preventDefault();
          changeVolume(0.1);
          break;
        case "ArrowDown":
          e.preventDefault();
          changeVolume(-0.1);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = async () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      await container.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const skip = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.max(0, Math.min(duration, video.currentTime + seconds));
    showControlsTemporarily();
  };

  const changeVolume = (delta: number) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = Math.max(0, Math.min(1, volume + delta));
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    const progress = progressRef.current;
    if (!video || !progress) return;

    const rect = progress.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * duration;
  };

  const handlePlaybackRateChange = () => {
    const video = videoRef.current;
    if (!video) return;

    const rates = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];
    video.playbackRate = nextRate;
    setPlaybackRate(nextRate);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className={cn(
        "group relative aspect-video overflow-hidden rounded-tatva-lg bg-black",
        className
      )}
      onMouseMove={showControlsTemporarily}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        className="h-full w-full object-contain"
        onClick={togglePlay}
        playsInline
      />

      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="size-12 animate-spin rounded-full border-4 border-white/20 border-t-white" />
        </div>
      )}

      {/* Play Button Overlay (when paused) */}
      {!isPlaying && !isLoading && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity"
        >
          <div className="flex size-20 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform hover:scale-110">
            <Icon name="play" size="lg" className="ml-1 text-tatva-content-primary" />
          </div>
        </button>
      )}

      {/* Controls Overlay */}
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-tatva-4 transition-opacity",
          showControls || !isPlaying ? "opacity-100" : "opacity-0"
        )}
      >
        {/* Title */}
        {title && (
          <Text variant="label-sm" className="mb-tatva-3 text-white">
            {title}
          </Text>
        )}

        {/* Progress Bar */}
        <div
          ref={progressRef}
          className="mb-tatva-3 h-1 cursor-pointer rounded-full bg-white/30"
          onClick={handleProgressClick}
        >
          <div
            className="h-full rounded-full bg-tatva-brand-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-tatva-4">
            {/* Play/Pause */}
            <button onClick={togglePlay} className="text-white hover:text-white/80">
              <Icon name={isPlaying ? "pause" : "play"} size="md" />
            </button>

            {/* Skip buttons */}
            <button onClick={() => skip(-10)} className="text-white hover:text-white/80">
              <Icon name="chevron-left" size="sm" />
            </button>
            <button onClick={() => skip(10)} className="text-white hover:text-white/80">
              <Icon name="chevron-right" size="sm" />
            </button>

            {/* Volume */}
            <button onClick={toggleMute} className="text-white hover:text-white/80">
              <Icon name="volume-high" size="sm" className={isMuted ? "opacity-50" : ""} />
            </button>

            {/* Time */}
            <Text variant="body-xs" className="text-white/80">
              {formatTime(currentTime)} / {formatTime(duration)}
            </Text>
          </div>

          <div className="flex items-center gap-tatva-4">
            {/* Playback Speed */}
            <button
              onClick={handlePlaybackRateChange}
              className="rounded bg-white/20 px-tatva-2 py-tatva-1 text-white hover:bg-white/30"
            >
              <Text variant="body-xs">{playbackRate}x</Text>
            </button>

            {/* Fullscreen */}
            <button onClick={toggleFullscreen} className="text-white hover:text-white/80">
              <Icon name={isFullscreen ? "chevron-down" : "arrow-up-right"} size="sm" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoPlayer;
