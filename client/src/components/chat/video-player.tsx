import type React from "react";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  AlertCircle,
  Video,
} from "lucide-react";
import type { Media } from "@/types/message";

interface VideoPlayerProps {
  videos: Media[] | File[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function VideoPlayer({
  videos,
  initialIndex,
  isOpen,
  onClose,
}: VideoPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [buffered, setBuffered] = useState(0);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  const progressAnimationRef = useRef<number>();
  const containerRef = useRef<HTMLDivElement>(null);

  const isValidVideoUrl = (url: string) => {
    return (
      url &&
      !url.includes("placeholder.svg") &&
      (url.includes(".mp4") || url.includes(".webm") || url.includes(".mov"))
    );
  };

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setIsPlaying(false);
    setCurrentTime(0);
    setHasError(false);
    setIsLoading(true);
    setBuffered(0);
    setShowControls(true);
    setIsUserInteracting(false);
    setIsDemoMode(!isValidVideoUrl(videos[initialIndex]?.url));
  }, [initialIndex, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      // Show controls when user interacts with keyboard
      setShowControls(true);
      setIsUserInteracting(true);
      resetControlsTimeout();

      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          goToPrevious();
          break;
        case "ArrowRight":
          goToNext();
          break;
        case " ":
          e.preventDefault();
          togglePlayPause();
          break;
        case "m":
        case "M":
          toggleMute();
          break;
        case "f":
        case "F":
          if (!isDemoMode) toggleFullscreen();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, isPlaying, isDemoMode]);

  const resetControlsTimeout = useCallback(() => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }

    // Always set timeout when playing, regardless of interaction state
    if (isPlaying || !isPlaying) {
      // This will be updated by the playing state
      controlsTimeoutRef.current = setTimeout(() => {
        if (isPlaying) {
          // Only hide if still playing
          setShowControls(false);
          setIsUserInteracting(false);
        }
      }, 3000);
    }
  }, [isPlaying]);

  const handleUserInteraction = useCallback(() => {
    setShowControls(true);
    setIsUserInteracting(true);
    resetControlsTimeout();
  }, [resetControlsTimeout]);

  const handleVideoClick = useCallback(() => {
    if (!showControls) {
      // If controls are hidden, show them
      setShowControls(true);
      setIsUserInteracting(true);
      resetControlsTimeout();
    } else {
      // If controls are visible, toggle play/pause and start hiding timer
      togglePlayPause();
      // If we're starting to play, set up the hide timer
      if (!isPlaying) {
        setIsUserInteracting(true);
        resetControlsTimeout();
      }
    }
  }, [isPlaying, showControls, resetControlsTimeout]);

  const goToPrevious = useCallback(() => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : videos.length - 1;
    setCurrentIndex(newIndex);
    setIsPlaying(false);
    setCurrentTime(0);
    setHasError(false);
    setIsLoading(true);
    setBuffered(0);
    setShowControls(true);
    setIsUserInteracting(false);
    setIsDemoMode(!isValidVideoUrl(videos[newIndex]?.url));
  }, [videos, currentIndex]);

  const goToNext = useCallback(() => {
    const newIndex = currentIndex < videos.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    setIsPlaying(false);
    setCurrentTime(0);
    setHasError(false);
    setIsLoading(true);
    setBuffered(0);
    setShowControls(true);
    setIsUserInteracting(false);
    setIsDemoMode(!isValidVideoUrl(videos[newIndex]?.url));
  }, [videos, currentIndex]);

  const togglePlayPause = useCallback(() => {
    if (isDemoMode) {
      const newPlayingState = !isPlaying;
      setIsPlaying(newPlayingState);

      // Start hide timer when playing starts
      if (newPlayingState) {
        setIsUserInteracting(true);
        // Use setTimeout to ensure the playing state is updated
        setTimeout(() => {
          resetControlsTimeout();
        }, 100);
      } else {
        // Show controls when paused
        setShowControls(true);
        if (controlsTimeoutRef.current) {
          clearTimeout(controlsTimeoutRef.current);
        }
      }
      return;
    }

    if (videoRef.current && !hasError) {
      const newPlayingState = !isPlaying;

      if (newPlayingState) {
        videoRef.current.play().catch(() => {
          setHasError(true);
        });
        // Start hide timer when playing starts
        setIsUserInteracting(true);
        setTimeout(() => {
          resetControlsTimeout();
        }, 100);
      } else {
        videoRef.current.pause();
        setShowControls(true);
        // Clear timeout when paused
        if (controlsTimeoutRef.current) {
          clearTimeout(controlsTimeoutRef.current);
        }
      }
      setIsPlaying(newPlayingState);
    }
  }, [isDemoMode, isPlaying, hasError, resetControlsTimeout]);

  const toggleMute = () => {
    if (videoRef.current && !isDemoMode) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current && !isDemoMode) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);

      // Update buffered progress
      if (videoRef.current.buffered.length > 0) {
        const bufferedEnd = videoRef.current.buffered.end(
          videoRef.current.buffered.length - 1
        );
        const duration = videoRef.current.duration;
        if (duration > 0) {
          setBuffered((bufferedEnd / duration) * 100);
        }
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsLoading(false);
    }
  };

  const handleVideoError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleCanPlay = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    handleUserInteraction();

    if (isDemoMode) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const videoDuration = videos[currentIndex].duration || 60;
      const newTime = (clickX / rect.width) * videoDuration;
      setCurrentTime(newTime);
      return;
    }

    if (videoRef.current && !hasError) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newTime = (clickX / rect.width) * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number.parseFloat(e.target.value);
    setVolume(newVolume);
    handleUserInteraction();
    if (videoRef.current && !isDemoMode) {
      videoRef.current.volume = newVolume;
    }
  };

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleDownload = async () => {
    if (isDemoMode) return;

    try {
      const response = await fetch(videos[currentIndex].url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download =
        videos[currentIndex].name || `video-${currentIndex + 1}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  // Smooth demo mode simulation with requestAnimationFrame
  useEffect(() => {
    if (isDemoMode && isPlaying) {
      const startTime = Date.now();
      const initialTime = currentTime;
      const maxTime = videos[currentIndex].duration || 60;

      const animate = () => {
        const elapsed = (Date.now() - startTime) / 1000;
        const newTime = initialTime + elapsed;

        if (newTime >= maxTime) {
          setIsPlaying(false);
          setShowControls(true);
          return;
        }

        setCurrentTime(newTime);
        progressAnimationRef.current = requestAnimationFrame(animate);
      };

      progressAnimationRef.current = requestAnimationFrame(animate);

      return () => {
        if (progressAnimationRef.current) {
          cancelAnimationFrame(progressAnimationRef.current);
        }
      };
    }
  }, [isDemoMode, isPlaying, currentIndex, videos]);

  // Auto-hide controls when video starts playing
  useEffect(() => {
    if (isPlaying) {
      // Start the hide timer when video starts playing
      const timer = setTimeout(() => {
        resetControlsTimeout();
      }, 100);
      return () => clearTimeout(timer);
    } else {
      // Always show controls when paused
      setShowControls(true);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    }
  }, [isPlaying, resetControlsTimeout]);

  if (!isOpen) return null;

  const currentVideo = videos[currentIndex];
  const progressPercentage = isDemoMode
    ? (currentTime / (currentVideo.duration || 60)) * 100
    : duration > 0
    ? (currentTime / duration) * 100
    : 0;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
      onMouseMove={handleUserInteraction}
      onTouchStart={handleUserInteraction}
      onClick={handleVideoClick}
      style={{ cursor: showControls ? "default" : "none" }}
    >
      {/* Header */}
      <div
        className={`absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/90 via-black/50 to-transparent transition-all duration-500 ease-out ${
          showControls
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-0"
        }`}
      >
        <div className="flex items-center justify-between p-4 sm:p-6">
          <div className="text-white flex-1 min-w-0">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <span className="text-sm sm:text-lg font-semibold">
                {currentIndex + 1} of {videos.length}
              </span>
              {isDemoMode && (
                <span className="px-2 py-1 sm:px-3 sm:py-1 bg-blue-600 rounded-full text-xs sm:text-sm font-medium animate-pulse">
                  Demo
                </span>
              )}
            </div>
            <div className="text-xs sm:text-sm text-white/70 mt-1 truncate">
              {currentVideo.name || `Video ${currentIndex + 1}`}
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3 ml-4">
            {!isDemoMode && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload();
                }}
                className="p-2 sm:p-3 text-white hover:bg-white/20 rounded-full transition-all duration-300 bg-black/40 backdrop-blur-sm hover:scale-110 transform"
              >
                <Download className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="p-2 sm:p-3 text-white hover:bg-white/20 rounded-full transition-all duration-300 bg-black/40 backdrop-blur-sm hover:scale-110 transform"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      {videos.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            className={`absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20 p-3 sm:p-4 text-white hover:bg-white/20 rounded-full transition-all duration-500 ease-out bg-black/40 backdrop-blur-sm hover:scale-110 transform ${
              showControls
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-8"
            }`}
          >
            <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className={`absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20 p-3 sm:p-4 text-white hover:bg-white/20 rounded-full transition-all duration-500 ease-out bg-black/40 backdrop-blur-sm hover:scale-110 transform ${
              showControls
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-8"
            }`}
          >
            <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
          </button>
        </>
      )}

      {/* Video container */}
      <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-8">
        <>
          {/* Loading Spinner */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
          )}

          {/* Error State */}
          {hasError && (
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="text-center text-white max-w-sm">
                <AlertCircle className="h-16 w-16 sm:h-20 sm:w-20 mx-auto mb-4 sm:mb-6 text-red-400 animate-pulse" />
                <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">
                  Unable to load video
                </h3>
                <p className="text-white/70 mb-4 sm:mb-6 text-sm sm:text-base">
                  The video format may not be supported
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setHasError(false);
                    setIsLoading(true);
                  }}
                  className="px-4 py-2 sm:px-6 sm:py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-300 hover:scale-105 transform text-sm sm:text-base"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          <video
            ref={videoRef}
            src={currentVideo.url}
            className={`w-full h-full max-w-full max-h-full object-contain transition-all duration-500 ease-out ${
              isLoading || hasError
                ? "opacity-0 scale-95"
                : "opacity-100 scale-100"
            }`}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onCanPlay={handleCanPlay}
            onError={handleVideoError}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            preload="metadata"
          />

          {/* Enhanced Play/Pause overlay */}
          {!isPlaying && !hasError && !isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlayPause();
                }}
                className="group relative"
              >
                {/* Outer glow ring */}
                <div className="absolute inset-0 bg-white/10 rounded-full scale-150 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500 ease-out blur-xl"></div>

                {/* Main button */}
                <div className="relative p-6 sm:p-8 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110 transform shadow-2xl border border-white/20">
                  <Play className="h-12 w-12 sm:h-16 sm:w-16 text-white ml-1 drop-shadow-lg" />
                </div>

                {/* Pulse animation */}
                <div className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-20"></div>
              </button>
            </div>
          )}
        </>
      </div>

      {/* Video Controls */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/95 via-black/70 to-transparent transition-all duration-500 ease-out ${
          showControls
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-full"
        }`}
      >
        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          {/* Progress Bar */}
          <div
            className="w-full h-1 sm:h-2 bg-white/20 rounded-full cursor-pointer overflow-hidden relative group"
            onClick={handleProgressClick}
          >
            {/* Buffered progress */}
            {!isDemoMode && (
              <div
                className="absolute h-full bg-white/30 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${buffered}%` }}
              />
            )}
            {/* Current progress */}
            <div
              className="h-full bg-white rounded-full transition-all duration-100 ease-linear relative z-10"
              style={{ width: `${progressPercentage}%` }}
            >
              {/* Progress handle */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 transform hover:scale-125" />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-6">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlayPause();
                }}
                className="p-2 sm:p-3 text-white hover:bg-white/20 rounded-full transition-all duration-300 hover:scale-110 transform"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5 sm:h-6 sm:w-6" />
                ) : (
                  <Play className="h-5 w-5 sm:h-6 sm:w-6" />
                )}
              </button>

              {!isDemoMode && (
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMute();
                    }}
                    className="p-1.5 sm:p-2 text-white hover:bg-white/20 rounded-full transition-all duration-300 hover:scale-110 transform"
                  >
                    {isMuted ? (
                      <VolumeX className="h-4 w-4 sm:h-5 sm:w-5" />
                    ) : (
                      <Volume2 className="h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                  </button>

                  {/* Enhanced Volume Slider */}
                  <div className="relative w-16 sm:w-24 h-6 flex items-center group">
                    <div className="w-full h-1 bg-white/20 rounded-full relative">
                      <div
                        className="absolute top-0 left-0 h-1 bg-white rounded-full transition-all duration-100 ease-linear"
                        style={{ width: `${volume * 100}%` }}
                      />
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChange}
                        onClick={(e) => e.stopPropagation()}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div
                        className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white rounded-full shadow-lg transition-all duration-200 transform hover:scale-125"
                        style={{
                          left: `${volume * 100}%`,
                          transform: "translateX(-50%) translateY(0%)",
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <span className="text-white text-sm sm:text-lg font-medium">
                {formatTime(currentTime)} /{" "}
                {formatTime(
                  isDemoMode ? currentVideo.duration || 60 : duration
                )}
              </span>
            </div>

            {!isDemoMode && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFullscreen();
                }}
                className="p-2 sm:p-3 text-white hover:bg-white/20 rounded-full transition-all duration-300 hover:scale-110 transform"
              >
                <Maximize className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Thumbnail strip */}
      {videos.length > 1 && (
        <div
          className={`absolute bottom-20 sm:bottom-32 left-1/2 -translate-x-1/2 flex space-x-2 sm:space-x-3 bg-black/60 backdrop-blur-md rounded-xl sm:rounded-2xl p-2 sm:p-4 transition-all duration-500 ease-out max-w-[90vw] overflow-x-auto ${
            showControls
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          {videos.map((video, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
                setIsPlaying(false);
                setCurrentTime(0);
                setHasError(false);
                setIsLoading(true);
                setBuffered(0);
                setShowControls(true);
                setIsUserInteracting(false);
                setIsDemoMode(!isValidVideoUrl(video.url));
              }}
              className={`relative w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl overflow-hidden transition-all duration-300 ease-out flex-shrink-0 ${
                index === currentIndex
                  ? "ring-2 sm:ring-3 ring-white scale-110 shadow-lg"
                  : "opacity-70 hover:opacity-100 hover:scale-105"
              }`}
            >
              {isValidVideoUrl(video.url) ? (
                <img
                  src={
                    video.thumbnail_url ||
                    "/placeholder.svg?height=64&width=64&query=video+thumbnail"
                  }
                  alt={`Video ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                  <Video className="h-4 w-4 sm:h-6 sm:w-6 text-white/60" />
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center">
                <Play className="h-3 w-3 sm:h-4 sm:w-4 text-white drop-shadow-lg" />
              </div>
              {index === currentIndex && (
                <div className="absolute inset-0 bg-white/20 rounded-lg sm:rounded-xl"></div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
