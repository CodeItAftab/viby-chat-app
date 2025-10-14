import { useState } from "react";
import {
  Check,
  CheckCheck,
  Clock,
  Download,
  File,
  FileText,
  FileImage,
  FileVideo,
  Music,
  Archive,
  Code,
} from "lucide-react";
import type { Media, Message } from "@/types/message";

interface FileBubbleProps {
  message: Message;
}

export default function FileBubble({ message }: FileBubbleProps) {
  const [downloadingFiles, setDownloadingFiles] = useState<Set<number>>(
    new Set()
  );

  if (message.type !== "file" || !message.media || message.media.length === 0) {
    return null;
  }

  const { media, is_sender, timestamp, state, text_content } = message;

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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
    );
  };

  const getFileIcon = (filename: string, format?: string) => {
    const extension = format || filename.split(".").pop()?.toLowerCase() || "";

    if (
      ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"].includes(extension)
    ) {
      return <FileImage className="h-5 w-5" />;
    }
    if (
      ["mp4", "avi", "mov", "wmv", "flv", "webm", "mkv"].includes(extension)
    ) {
      return <FileVideo className="h-5 w-5" />;
    }
    if (["mp3", "wav", "ogg", "m4a", "aac", "flac"].includes(extension)) {
      return <Music className="h-5 w-5" />;
    }
    if (["pdf", "doc", "docx", "txt", "rtf", "odt"].includes(extension)) {
      return <FileText className="h-5 w-5" />;
    }
    if (["zip", "rar", "7z", "tar", "gz", "bz2"].includes(extension)) {
      return <Archive className="h-5 w-5" />;
    }
    if (
      [
        "js",
        "ts",
        "jsx",
        "tsx",
        "html",
        "css",
        "py",
        "java",
        "cpp",
        "c",
        "php",
        "rb",
        "go",
        "rs",
      ].includes(extension)
    ) {
      return <Code className="h-5 w-5" />;
    }
    return <File className="h-5 w-5" />;
  };

  const getFileTypeColor = (filename: string, format?: string) => {
    const extension = format || filename.split(".").pop()?.toLowerCase() || "";

    if (
      ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"].includes(extension)
    ) {
      return is_sender
        ? "text-green-200 bg-green-500/20"
        : "text-green-600 bg-green-50";
    }
    if (
      ["mp4", "avi", "mov", "wmv", "flv", "webm", "mkv"].includes(extension)
    ) {
      return is_sender
        ? "text-red-200 bg-red-500/20"
        : "text-red-600 bg-red-50";
    }
    if (["mp3", "wav", "ogg", "m4a", "aac", "flac"].includes(extension)) {
      return is_sender
        ? "text-purple-200 bg-purple-500/20"
        : "text-purple-600 bg-purple-50";
    }
    if (["pdf", "doc", "docx", "txt", "rtf", "odt"].includes(extension)) {
      return is_sender
        ? "text-blue-200 bg-blue-500/20"
        : "text-blue-600 bg-blue-50";
    }
    if (["zip", "rar", "7z", "tar", "gz", "bz2"].includes(extension)) {
      return is_sender
        ? "text-yellow-200 bg-yellow-500/20"
        : "text-yellow-600 bg-yellow-50";
    }
    if (
      [
        "js",
        "ts",
        "jsx",
        "tsx",
        "html",
        "css",
        "py",
        "java",
        "cpp",
        "c",
        "php",
        "rb",
        "go",
        "rs",
      ].includes(extension)
    ) {
      return is_sender
        ? "text-orange-200 bg-orange-500/20"
        : "text-orange-600 bg-orange-50";
    }
    return is_sender ? "text-white/80 bg-white/10" : "text-gray-600 bg-gray-50";
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

  const handleDownload = async (file: Media, index: number) => {
    if (downloadingFiles.has(index)) return;

    setDownloadingFiles((prev) => new Set(prev).add(index));

    try {
      const response = await fetch(file.url);
      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.name || `file-${Date.now()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download file");
    } finally {
      setDownloadingFiles((prev) => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    }
  };

  return (
    <div className={`flex ${is_sender ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`relative max-w-xs shadow-lg transition-all duration-300 hover:shadow-xl ${
          is_sender
            ? "bg-gradient-to-br from-blue-500 to-blue-600 rounded-l-2xl rounded-br-2xl rounded-tr-md"
            : "bg-white border border-gray-200 rounded-r-2xl rounded-bl-2xl rounded-tl-md"
        }`}
      >
        {/* Files */}
        <div className="p-3 space-y-2">
          {media.map((file, index) => {
            const fileName = file.name || "Unknown file";
            // const fileSize = file.bytes || 0;
            const fileFormat = (file as Media)?.format;
            const isDownloading = downloadingFiles.has(index);

            return (
              <div
                key={index}
                className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 hover:scale-[1.02] ${
                  is_sender
                    ? "bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15"
                    : "bg-gray-50 border border-gray-100 hover:bg-gray-100"
                }`}
              >
                {/* File Icon */}
                <div
                  className={`p-2.5 rounded-lg transition-all duration-200 ${getFileTypeColor(
                    fileName,
                    fileFormat
                  )}`}
                >
                  {getFileIcon(fileName, fileFormat)}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <div
                    className={`font-medium text-sm truncate ${
                      is_sender ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {fileName}
                  </div>
                  <div
                    className={`text-xs mt-0.5 ${
                      is_sender ? "text-white/70" : "text-gray-500"
                    }`}
                  >
                    {typeof file.bytes === "number"
                      ? formatFileSize(file.bytes)
                      : "Unknown size"}
                    {fileFormat && ` • ${fileFormat.toUpperCase()}`}
                  </div>
                </div>

                {/* Download Button */}
                <button
                  onClick={() => {
                    if (
                      "url" in file &&
                      "public_id" in file &&
                      "resource_type" in file
                    ) {
                      handleDownload(file as Media, index);
                    } else {
                      alert("This file cannot be downloaded.");
                    }
                  }}
                  disabled={isDownloading}
                  className={`p-2.5 rounded-lg transition-all duration-200 hover:scale-110 ${
                    is_sender
                      ? "bg-white/20 hover:bg-white/30 text-white border border-white/30"
                      : "bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200"
                  } ${isDownloading ? "opacity-50 cursor-not-allowed" : ""}`}
                  title="Download file"
                >
                  {isDownloading ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Text content if present */}
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
        )}

        {/* Timestamp overlay for files without text */}
        {!text_content && (
          <>
            <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/20 to-transparent pointer-events-none rounded-b-2xl" />
            <div className="absolute bottom-2 right-3 flex items-center gap-1 px-2 py-1 bg-black/20 backdrop-blur-sm rounded-md">
              <span
                className={`text-xs font-medium ${
                  is_sender ? "text-white/90" : "text-gray-700"
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
          </>
        )}
      </div>
    </div>
  );
}
