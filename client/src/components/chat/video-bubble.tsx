import type React from "react";

import { useState, useMemo, useCallback } from "react";
import { Check, CheckCheck, Clock, Play, Video, Download } from "lucide-react";
import type { Media, Message } from "@/types/message";
import VideoPlayer from "./video-player";

interface VideoBubbleProps {
  message: Message;
}

export default function VideoBubble({ message }: VideoBubbleProps) {
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number | null>(
    null
  );

  // if (
  //   message.type !== "video" ||
  //   !message.media ||
  //   message.media.length === 0
  // ) {
  //   return null;
  // }

  const { media, is_sender, timestamp, state, text_content } = message;

  // Memoize expensive calculations
  const formattedTime = useMemo(() => {
    const date =
      typeof timestamp === "string" ? new Date(timestamp) : timestamp;
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }, [timestamp]);

  const formatDuration = useMemo(
    () => (seconds: number) => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = Math.floor(seconds % 60);

      if (hours > 0) {
        return `${hours}:${minutes
          .toString()
          .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
      }
      return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    },
    []
  );

  const statusIcon = useMemo(() => {
    switch (state) {
      case "sending":
        return <Clock className="h-3 w-3 text-white/70" />; // Removed animation
      case "sent":
        return <Check className="h-3 w-3 text-white/70" />;
      case "delivered":
        return <CheckCheck className="h-3 w-3 text-white/70" />;
      case "read":
        return <CheckCheck className="h-3 w-3 text-white" />;
      default:
        return null;
    }
  }, [state]);

  const openVideoViewer = useCallback((index: number) => {
    setSelectedVideoIndex(index);
  }, []);

  const closeVideoViewer = () => {
    setSelectedVideoIndex(null);
  };

  const isValidVideoUrl = useCallback((url: string) => {
    return (
      url &&
      !url.includes("placeholder.svg") &&
      (url.includes(".mp4") || url.includes(".webm") || url.includes(".mov"))
    );
  }, []);

  const handleDownload = useCallback(
    async (video: Media, e: React.MouseEvent) => {
      e.stopPropagation();

      if (!isValidVideoUrl(video.url)) {
        alert("This is a demo video and cannot be downloaded");
        return;
      }

      try {
        const response = await fetch(video.url);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = video.name || `video-${Date.now()}.mp4`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Download failed:", error);
        alert("Failed to download video");
      }
    },
    [isValidVideoUrl]
  );

  const renderVideoThumbnail = useCallback(
    (video: Media | File, index: number, className = "") => {
      const isValid =
        "url" in video && typeof video.url === "string"
          ? isValidVideoUrl(video.url)
          : false;

      const hasThumbnail =
        "thumbnail_url" in video &&
        typeof video.thumbnail_url === "string" &&
        video.thumbnail_url;

      return (
        <div
          className={`relative cursor-pointer group overflow-hidden ${className}`}
          onClick={() => openVideoViewer(index)}
          style={{
            minHeight: "80px",
            backgroundColor: "#000",
          }}
        >
          {hasThumbnail ? (
            <img
              src={video.thumbnail_url}
              alt={`Video ${index + 1}`}
              loading="lazy"
              className="w-full h-full object-cover"
              style={{
                minHeight: "80px",
                display: "block",
              }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div
              className="w-full h-full bg-black flex items-center justify-center"
              style={{ minHeight: "80px" }}
            >
              <div className="p-2 bg-black/60 rounded-full">
                <Play className="h-4 w-4 text-white ml-0.5" />
              </div>
            </div>
          )}

          {/* Simplified play button overlay */}
          {hasThumbnail && (
            <div
              className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-100 group-hover:bg-black/40"
              style={{ minHeight: "80px" }}
            >
              <div className="p-2 bg-black/60 rounded-full">
                <Play className="h-4 w-4 text-white ml-0.5" />
              </div>
            </div>
          )}

          {/* Simplified download button */}
          {isValid && (
            <button
              onClick={(e) => {
                if ("url" in video && typeof video.url === "string") {
                  handleDownload(video, e);
                }
              }}
              className="absolute top-1 right-6 p-1 bg-black/60 rounded-full opacity-0 group-hover:opacity-100"
              title="Download video"
            >
              <Download className="h-2.5 w-2.5 text-white" />
            </button>
          )}

          {/* Duration badge */}
          {(video as Media).duration &&
            typeof (video as Media).duration === "number" && (
              <div className="absolute top-1 right-1 px-1 py-0.5 bg-black/80 rounded text-white">
                <span className="text-xs font-medium leading-none">
                  {formatDuration((video as Media).duration ?? 0)}
                </span>
              </div>
            )}

          {/* Video type indicator */}
          <div className="absolute top-1 left-1 p-1 bg-black/60 rounded-full">
            <Video className="h-2.5 w-2.5 text-white" />
          </div>
        </div>
      );
    },
    [openVideoViewer, isValidVideoUrl, handleDownload, formatDuration]
  );

  const videoGrid = useMemo(() => {
    if (!media || media.length === 0) {
      return null;
    }

    if (media.length === 1) {
      return (
        <div style={{ minHeight: "160px" }}>
          {renderVideoThumbnail(media[0], 0, "rounded-lg h-40")}
        </div>
      );
    }

    if (media.length === 2) {
      return (
        <div
          className="grid grid-cols-2 gap-1.5 rounded-lg overflow-hidden"
          style={{ minHeight: "96px" }}
        >
          {media.map((video, index) => (
            <div key={index} style={{ minHeight: "96px" }}>
              {renderVideoThumbnail(video, index, "h-24")}
            </div>
          ))}
        </div>
      );
    }

    if (media.length === 3) {
      return (
        <div className="space-y-1.5 rounded-lg overflow-hidden">
          <div style={{ minHeight: "96px" }}>
            {renderVideoThumbnail(media[0], 0, "rounded-lg h-24")}
          </div>
          <div
            className="grid grid-cols-2 gap-1.5"
            style={{ minHeight: "72px" }}
          >
            {media.slice(1).map((video, index) => (
              <div key={index + 1} style={{ minHeight: "72px" }}>
                {renderVideoThumbnail(video, index + 1, "rounded-lg h-18")}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div
        className="grid grid-cols-2 gap-1.5 rounded-lg overflow-hidden"
        style={{ minHeight: "84px" }}
      >
        {media.slice(0, 4).map((video, index) => (
          <div key={index} className="relative" style={{ minHeight: "84px" }}>
            {renderVideoThumbnail(video, index, "h-21")}
            {index === 3 && media.length > 4 && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded">
                <span className="text-white font-bold text-sm">
                  +{media.length - 4}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }, [media, renderVideoThumbnail]);

  return (
    <>
      <div
        className={`flex ${is_sender ? "justify-end" : "justify-start"} mb-2`}
      >
        <div
          className={`relative max-w-xs sm:max-w-sm md:max-w-md shadow-lg ${
            is_sender
              ? "bg-gradient-to-br from-blue-500 to-blue-600 rounded-l-2xl rounded-br-2xl rounded-tr-md"
              : "bg-white border border-gray-200 rounded-r-2xl rounded-bl-2xl rounded-tl-md"
          }`}
        >
          {/* Videos */}
          <div className="p-1.5">{videoGrid}</div>

          {/* Text content */}
          {text_content && (
            <div className="px-3 pb-3">
              <div className="mb-6">
                <p
                  className={`text-sm leading-relaxed break-words ${
                    is_sender ? "text-white" : "text-gray-800"
                  }`}
                >
                  {text_content}
                </p>
              </div>

              {/* Timestamp and status */}
              <div className="absolute bottom-2 right-3">
                <div className="flex items-center space-x-1">
                  <span
                    className={`text-xs ${
                      is_sender ? "text-white/80" : "text-gray-500"
                    }`}
                  >
                    {formattedTime}
                  </span>
                  {is_sender && state && (
                    <span className="flex items-center justify-center">
                      {statusIcon}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Timestamp overlay for videos without text */}
          {!text_content && (
            <>
              <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/50 to-transparent pointer-events-none rounded-b-2xl" />
              <div className="absolute bottom-1.5 right-2 flex items-center gap-1 px-2 py-1 bg-black/30 rounded-md">
                <span className="text-xs text-white font-medium">
                  {formattedTime}
                </span>
                {is_sender && state && (
                  <span className="flex items-center justify-center">
                    {statusIcon}
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Video Viewer */}
      {selectedVideoIndex !== null && (
        <VideoPlayer
          videos={media}
          initialIndex={selectedVideoIndex}
          isOpen={selectedVideoIndex !== null}
          onClose={closeVideoViewer}
        />
      )}
    </>
  );
}
