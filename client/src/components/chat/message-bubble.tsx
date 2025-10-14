import { Button } from "@/components/ui/button";
import {
  Play,
  Pause,
  Download,
  FileText,
  ImageIcon,
  CheckCheck,
  Music,
  Video,
  Archive,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
  isOwn: boolean;
  type: "text" | "image" | "video" | "audio" | "file";
  files?: File[];
  createdAt: Date;
}

interface MessageBubbleProps {
  message: Message;
  isGrouped?: boolean;
  showTimestamp?: boolean;
  isLastInGroup?: boolean;
}

export function MessageBubble({
  message,
  isGrouped = false,
  showTimestamp = true,
  isLastInGroup = false,
}: MessageBubbleProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration) {
        setAudioProgress((audio.currentTime / audio.duration) * 100);
        setAudioCurrentTime(audio.currentTime);
      }
    };

    const updateDuration = () => {
      setAudioDuration(audio.duration);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", () => setIsPlaying(false));

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", () => setIsPlaying(false));
    };
  }, []);

  const handlePlayAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleDownload = (file: File) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return ImageIcon;
    if (file.type.startsWith("video/")) return Video;
    if (file.type.startsWith("audio/")) return Music;
    if (file.type.includes("zip") || file.type.includes("rar")) return Archive;
    return FileText;
  };

  const getFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
    );
  };

  const renderMediaContent = () => {
    if (message.type === "image") {
      const file = message.files?.[0];
      const imageSrc = file
        ? URL.createObjectURL(file)
        : "/placeholder.svg?height=200&width=300";

      return (
        <div className="relative rounded-lg overflow-hidden max-w-sm group">
          <img
            src={imageSrc || "/placeholder.svg"}
            alt="Shared image"
            className="w-full h-auto max-h-60 object-cover"
            onLoad={() => setImageLoaded(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => file && handleDownload(file)}
            className="absolute top-2 right-2 h-8 w-8 bg-black/30 hover:bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-sm rounded-full"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      );
    }

    if (message.type === "video") {
      const file = message.files?.[0];
      const videoSrc = file ? URL.createObjectURL(file) : "/placeholder.mp4";

      return (
        <div className="relative rounded-lg overflow-hidden max-w-sm bg-black group">
          <video
            controls
            className="w-full h-auto max-h-60 object-cover"
            poster="/placeholder.svg?height=200&width=300"
          >
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => file && handleDownload(file)}
            className="absolute top-2 right-2 h-8 w-8 bg-black/30 hover:bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-sm rounded-full"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      );
    }

    if (message.type === "file") {
      const file = message.files?.[0];
      const fileName = file?.name || "document.pdf";
      const fileSize = file ? getFileSize(file.size) : "2.4 MB";
      const FileIconComponent = file ? getFileIcon(file) : FileText;

      return (
        <div className="flex items-center gap-3 p-3 bg-slate-50/90 dark:bg-slate-700/40 rounded-lg max-w-xs hover:bg-slate-100/90 dark:hover:bg-slate-700/60 transition-colors group">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center shadow-sm">
            <FileIconComponent className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-slate-900 dark:text-slate-100">
              {fileName}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {fileSize}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => file && handleDownload(file)}
            className="h-8 w-8 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors rounded-lg opacity-60 group-hover:opacity-100"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      );
    }

    return null;
  };

  const renderMessageContent = () => {
    switch (message.type) {
      case "audio":
        const audioFile = message.files?.[0];
        return (
          <div className="flex items-center gap-3 p-3 bg-slate-50/80 dark:bg-slate-700/30 rounded-lg min-w-[240px] max-w-[300px]">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePlayAudio}
              className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-sm flex-shrink-0"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4 ml-0.5" />
              )}
            </Button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Music className="h-3 w-3 text-slate-500 dark:text-slate-400" />
                <span className="text-xs text-slate-600 dark:text-slate-300">
                  Voice Message
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-150"
                    style={{ width: `${audioProgress}%` }}
                  />
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {formatTime(audioCurrentTime)}
                </span>
              </div>
              {audioFile && (
                <audio
                  ref={audioRef}
                  src={URL.createObjectURL(audioFile)}
                  className="hidden"
                />
              )}
            </div>
          </div>
        );
      case "image":
      case "video":
      case "file":
        return <div className="relative">{renderMediaContent()}</div>;
      default:
        // Keep the perfect text message layout
        const isShortMessage = message.content.length <= 25;
        const isMediumMessage = message.content.length <= 80;

        if (isShortMessage) {
          return (
            <div className="px-3 py-2 relative">
              <p className="text-sm leading-relaxed whitespace-pre-wrap break-words pr-20">
                {message.content}
              </p>
            </div>
          );
        } else if (isMediumMessage) {
          return (
            <div className="px-3 py-2 relative">
              <p className="text-sm leading-relaxed whitespace-pre-wrap break-words pr-16 pb-1">
                {message.content}
              </p>
            </div>
          );
        } else {
          return (
            <div className="px-3 py-2 relative">
              <div className="relative">
                <p
                  className="text-sm leading-relaxed whitespace-pre-wrap break-words"
                  style={{
                    paddingRight: "4px",
                    marginBottom: "-18px",
                    paddingBottom: "18px",
                  }}
                >
                  {message.content}
                  <span
                    className="inline-block align-bottom ml-1"
                    style={{
                      width: "54px",
                      height: "16px",
                    }}
                  />
                </p>
              </div>
            </div>
          );
        }
    }
    return <></>;
  };

  const getBubbleRadius = () => {
    if (message.isOwn) {
      if (isGrouped && !isLastInGroup) return "rounded-2xl rounded-br-md";
      if (isGrouped && isLastInGroup) return "rounded-2xl rounded-br-lg";
      return "rounded-2xl";
    } else {
      if (isGrouped && !isLastInGroup) return "rounded-2xl rounded-bl-md";
      if (isGrouped && isLastInGroup) return "rounded-2xl rounded-bl-lg";
      return "rounded-2xl";
    }
  };

  return (
    <div
      className={cn(
        "flex group animate-in slide-in-from-bottom-2 fade-in duration-300",
        message.isOwn ? "justify-end" : "justify-start",
        isGrouped ? "mb-1" : "mb-3"
      )}
    >
      <div
        className={cn(
          "relative inline-block",
          // Improved width calculation based on message length
          message.type === "text"
            ? message.content.length <= 25
              ? "max-w-fit" // Short messages: fit to content
              : message.content.length <= 80
              ? "max-w-[75%] sm:max-w-[65%]" // Medium messages
              : "max-w-[85%] sm:max-w-[75%]" // Long messages
            : "max-w-[85%] sm:max-w-[70%]"
        )}
      >
        <div
          className={cn(
            "shadow-sm transition-all duration-200 group-hover:shadow-md relative backdrop-blur-sm",
            getBubbleRadius(),
            message.isOwn
              ? "bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 text-white shadow-blue-500/15"
              : "bg-white/95 dark:bg-slate-800/95 hover:bg-white dark:hover:bg-slate-800 shadow-slate-900/5",
            // Refined borders
            message.type === "text"
              ? message.isOwn
                ? "border border-blue-500/20"
                : "border border-slate-200/50 dark:border-slate-700/50"
              : "p-2 border border-slate-200/30 dark:border-slate-700/30"
          )}
        >
          {renderMessageContent()}

          {/* Enhanced timestamp with better positioning and styling */}
          <div
            className={cn(
              "absolute flex items-center gap-1 text-xs pointer-events-none select-none z-10",
              "bottom-1.5 right-2.5",
              message.isOwn
                ? "text-white/80"
                : "text-slate-500 dark:text-slate-400"
            )}
            style={{
              textShadow: message.isOwn
                ? "0 1px 2px rgba(0,0,0,0.15)"
                : "0 1px 1px rgba(255,255,255,0.8)",
            }}
          >
            <span className="font-medium whitespace-nowrap text-[10px] tracking-wide">
              {message.timestamp}
            </span>
            {message.isOwn && (
              <CheckCheck className="h-3 w-3 text-current opacity-75 flex-shrink-0" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
