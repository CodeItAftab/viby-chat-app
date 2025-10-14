import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Check, CheckCheck, Clock, Play, Pause, Mic } from "lucide-react";
import type { Media, Message } from "@/types/message";
import { audioManager } from "@/lib/audio-manager";

interface AudioBubbleProps {
  message: Message;
}

export default function AudioBubble({ message }: AudioBubbleProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [, setProgressPercentage] = useState(0);

  const { media, is_sender, timestamp, state } = message;
  const audioFile = media?.[0] as Media;

  useEffect(() => {
    if (!audioFile) return;

    // Use duration from metadata if available
    if (audioFile.duration && audioFile.duration > 0) {
      setDuration(audioFile.duration);
      setIsLoading(false);
    }
  }, [audioFile]);

  if (message.type !== "audio" || !audioFile) {
    return null;
  }

  const formatTime = (date: Date | string) => {
    if (typeof date === "string") {
      date = new Date(date);
    }
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDuration = (seconds: number) => {
    // Fix for NaN and Infinity values
    if (!seconds || isNaN(seconds) || seconds === Infinity || seconds < 0) {
      return "0:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getStatusIcon = () => {
    switch (state) {
      case "sending":
        return <Clock className="h-3 w-3 text-white/70 animate-spin" />;
      case "sent":
        return <Check className="h-3 w-3 text-white/70" />;
      case "delivered":
        return <CheckCheck className="h-3 w-3 text-white/70" />;
      case "read":
        return <CheckCheck className="h-3 w-3 text-white" />;
      default:
        return null;
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      // Notify audio manager about playing this audio
      audioManager.playAudio(audioRef.current, setIsPlaying);

      audioRef.current.play().catch(() => {
        setHasError(true);
      });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentAudioTime = audioRef.current.currentTime;
      const audioDuration = audioRef.current.duration;

      setCurrentTime(currentAudioTime);

      // Only calculate percentage if duration is valid
      if (audioDuration && !isNaN(audioDuration) && audioDuration > 0) {
        setProgressPercentage((currentAudioTime / audioDuration) * 100);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      const audioDuration = audioRef.current.duration;

      // Check if the duration is valid
      if (
        audioDuration &&
        !isNaN(audioDuration) &&
        audioDuration !== Infinity &&
        audioDuration > 0
      ) {
        setDuration(audioDuration);
      } else if (audioFile.duration && audioFile.duration > 0) {
        // Fallback to metadata duration
        setDuration(audioFile.duration);
      }
      setIsLoading(false);
    }
  };

  const handleAudioError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleProgressInteraction = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !duration || duration <= 0) return;

    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = percentage * duration;

    setCurrentTime(newTime);
    setProgressPercentage(percentage * 100);

    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!duration || duration <= 0) return;

    e.preventDefault();
    setIsDragging(true);
    handleProgressInteraction(e);

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!progressRef.current || !duration || duration <= 0) return;

      const rect = progressRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, clickX / rect.width));
      const newTime = percentage * duration;

      setCurrentTime(newTime);
      setProgressPercentage(percentage * 100);

      if (audioRef.current) {
        audioRef.current.currentTime = newTime;
      }
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
    };

    document.addEventListener("mousemove", handleGlobalMouseMove);
    document.addEventListener("mouseup", handleGlobalMouseUp);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!duration || duration <= 0) return;

    if (e.key === "ArrowLeft") {
      e.preventDefault();
      const newTime = Math.max(0, currentTime - 5);
      setCurrentTime(newTime);
      setProgressPercentage((newTime / duration) * 100);
      if (audioRef.current) {
        audioRef.current.currentTime = newTime;
      }
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      const newTime = Math.min(duration, currentTime + 5);
      setCurrentTime(newTime);
      setProgressPercentage((newTime / duration) * 100);
      if (audioRef.current) {
        audioRef.current.currentTime = newTime;
      }
    } else if (e.key === " ") {
      e.preventDefault();
      togglePlayPause();
    }
  };

  // Calculate safe progress percentage
  const safeProgressPercentage =
    duration > 0
      ? Math.min(100, Math.max(0, (currentTime / duration) * 100))
      : 0;

  return (
    <>
      <div
        className={`flex ${is_sender ? "justify-end" : "justify-start"} mb-2`}
      >
        <div
          className={`relative shadow-sm transition-all duration-300 hover:shadow-md ${
            is_sender
              ? "bg-blue-500 rounded-l-2xl rounded-br-2xl rounded-tr-md"
              : "bg-white border border-gray-200 rounded-r-2xl rounded-bl-2xl rounded-tl-md"
          }`}
          style={{ width: "280px" }}
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          {/* Audio Player */}
          <div className="p-3">
            <div className="flex items-center space-x-3">
              {/* Play/Pause Button */}
              <button
                onClick={togglePlayPause}
                disabled={isLoading || hasError}
                className={`relative flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 ${
                  is_sender
                    ? "bg-white/20 hover:bg-white/30"
                    : "bg-blue-50 hover:bg-blue-100 border border-blue-100"
                } ${
                  isLoading || hasError ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <div
                    className={`w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin ${
                      is_sender ? "text-white" : "text-blue-500"
                    }`}
                  />
                ) : hasError ? (
                  <div
                    className={`text-xs font-bold ${
                      is_sender ? "text-white" : "text-red-500"
                    }`}
                    title="Audio failed to load"
                  >
                    !
                  </div>
                ) : isPlaying ? (
                  <Pause
                    className={`h-4 w-4 ${
                      is_sender ? "text-white" : "text-blue-600"
                    }`}
                  />
                ) : (
                  <Play
                    className={`h-4 w-4 ml-0.5 ${
                      is_sender ? "text-white" : "text-blue-600"
                    }`}
                  />
                )}
              </button>

              {/* Audio Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <Mic
                    className={`h-3.5 w-3.5 ${
                      is_sender ? "text-white/80" : "text-gray-500"
                    }`}
                  />
                  <span
                    className={`text-xs font-medium ${
                      is_sender ? "text-white/90" : "text-gray-700"
                    }`}
                  >
                    Voice message
                  </span>
                </div>

                {/* Progress Bar */}
                <div
                  ref={progressRef}
                  className={`w-full h-1.5 rounded-full cursor-pointer mb-2 relative group ${
                    is_sender ? "bg-white/20" : "bg-gray-200"
                  } ${
                    !duration || duration <= 0
                      ? "cursor-not-allowed opacity-50"
                      : ""
                  }`}
                  onClick={duration > 0 ? handleProgressInteraction : undefined}
                  onMouseDown={duration > 0 ? handleMouseDown : undefined}
                >
                  <div
                    className={`h-full rounded-full transition-all duration-100 relative ${
                      is_sender ? "bg-white" : "bg-blue-500"
                    }`}
                    style={{ width: `${safeProgressPercentage}%` }}
                  >
                    {/* Progress handle */}
                    {duration > 0 && (
                      <div
                        className={`absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full shadow-lg transition-all duration-200 border-2 ${
                          is_sender
                            ? "bg-white border-white"
                            : "bg-blue-500 border-blue-500"
                        } ${
                          isDragging
                            ? "scale-125 opacity-100"
                            : "opacity-0 group-hover:opacity-100 hover:scale-110"
                        }`}
                        style={{ right: "-6px" }}
                      />
                    )}
                  </div>

                  {/* Click target area */}
                  {duration > 0 && (
                    <div className="absolute inset-0 -inset-y-2" />
                  )}
                </div>

                {/* Duration and Timestamp */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs ${
                      is_sender ? "text-white/70" : "text-gray-500"
                    }`}
                  >
                    {hasError
                      ? "Error"
                      : `${formatDuration(currentTime)} / ${formatDuration(
                          duration
                        )}`}
                  </span>
                  <div className="flex items-center gap-1">
                    <span
                      className={`text-xs ${
                        is_sender ? "text-white/70" : "text-gray-500"
                      }`}
                    >
                      {formatTime(timestamp)}
                    </span>
                    {is_sender && state && (
                      <span className="flex items-center justify-center">
                        {getStatusIcon()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={audioFile.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onError={handleAudioError}
        onPlay={() => {
          setIsPlaying(true);
        }}
        onPause={() => {
          setIsPlaying(false);
          if (audioRef.current) {
            audioManager.pauseAudio(audioRef.current);
          }
        }}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentTime(0);
          if (audioRef.current) {
            audioManager.stopAudio(audioRef.current);
          }
        }}
        preload="metadata"
      />
    </>
  );
}
