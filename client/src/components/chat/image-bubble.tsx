import type { Message } from "@/types/message";
import { Check, CheckCheck, Clock, Download } from "lucide-react";
import { useState } from "react";
import ImageViewer from "./image-viewer";
// import { useState } from "react";
// import MediaViewer from "../media-viewer";

interface ImageBubbleProps {
  message: Message;
}

export default function ImageBubble({ message }: ImageBubbleProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );

  const { media, is_sender, timestamp, state, text_content } = message;

  if (
    message.type !== "image" ||
    !message.media ||
    message.media.length === 0
  ) {
    return;
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

  const renderImageGrid = () => {
    if ((media?.length ?? 0) === 1) {
      return (
        <div
          className="relative cursor-pointer group"
          onClick={() => setSelectedImageIndex(0)}
        >
          <img
            src={
              media?.[0] &&
              "url" in media[0] &&
              typeof media[0].url === "string"
                ? media[0].url
                : "/placeholder.svg?height=300&width=400&query=beautiful+landscape"
            }
            alt="Shared image"
            loading="lazy"
            className="w-full bg-white h-auto max-h-80 object-cover rounded-lg"
          />

          {/* Gradient overlay for timestamp visibility */}
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/50 to-transparent pointer-events-none rounded-b-lg" />

          {/* Download button */}
          <button className="absolute top-2 right-2 p-2 bg-black/40 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-black/60">
            <Download className="h-4 w-4 text-white" />
          </button>

          {/* Overlay timestamp - only show if no text content */}
          {!text_content && (
            <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 bg-black/30 backdrop-blur-sm rounded-md">
              <span className="text-[10px] text-white font-medium">
                {formatTime(timestamp)}
              </span>
              {is_sender && state && (
                <span className="flex items-center justify-center">
                  {getStatusIcon()}
                </span>
              )}
            </div>
          )}
        </div>
      );
    }

    if ((media?.length ?? 0) === 2) {
      return (
        <div className="grid grid-cols-2 gap-1 rounded-lg overflow-hidden">
          {media!.map((image, index) => (
            <div
              key={index}
              className="relative cursor-pointer group h-32"
              onClick={() => setSelectedImageIndex(index)}
            >
              <img
                src={
                  "url" in image && image.url
                    ? image.url
                    : "/placeholder.svg?height=120&width=120&query=photo"
                }
                alt={`Image ${index + 1}`}
                loading="lazy"
                className="w-full bg-white h-full object-cover"
              />

              {/* Timestamp on last image if no text */}
              {index === 1 && !text_content && (
                <>
                  <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                  <div className="absolute bottom-1 right-1 flex items-center gap-1 px-1 py-0.5 bg-black/30 backdrop-blur-sm rounded text-[10px] text-white">
                    <span>{formatTime(timestamp)}</span>
                    {is_sender && state && getStatusIcon()}
                  </div>
                </>
              )}

              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
            </div>
          ))}
        </div>
      );
    }

    if ((media?.length ?? 0) === 3) {
      return (
        <div className="space-y-1 rounded-lg overflow-hidden">
          {/* First image - full width */}
          <div
            className="relative cursor-pointer group h-32"
            onClick={() => setSelectedImageIndex(0)}
          >
            <img
              src={
                "url" in media![0] && media![0].url
                  ? media![0].url
                  : "/placeholder.svg?height=120&width=240&query=photo"
              }
              alt="Image 1"
              loading="lazy"
              className="w-full bg-white h-full object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 rounded-lg" />
          </div>

          {/* Bottom two images */}
          <div className="grid grid-cols-2 gap-1">
            {media!.slice(1).map((image, index) => (
              <div
                key={index + 1}
                className="relative cursor-pointer group h-24"
                onClick={() => setSelectedImageIndex(index)}
              >
                <img
                  src={
                    "url" in image && image.url
                      ? image.url
                      : "/placeholder.svg?height=96&width=120&query=photo"
                  }
                  alt={`Image ${index + 2}`}
                  loading="lazy"
                  className="w-full bg-white h-full object-cover rounded-lg"
                />

                {/* Timestamp on last image if no text */}
                {index === 1 && !text_content && (
                  <>
                    <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-black/50 to-transparent pointer-events-none rounded-b-lg" />
                    <div className="absolute bottom-1 right-1 flex items-center gap-1 px-1 py-0.5 bg-black/30 backdrop-blur-sm rounded text-[10px] text-white">
                      <span>{formatTime(timestamp)}</span>
                      {is_sender && state && getStatusIcon()}
                    </div>
                  </>
                )}

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-1 rounded-lg overflow-hidden">
        {media!.slice(0, 4).map((image, index) => (
          <div
            key={index}
            className="relative cursor-pointer group h-28"
            onClick={() => setSelectedImageIndex(index)}
          >
            <img
              src={
                "url" in image && image.url
                  ? image.url
                  : "/placeholder.svg?height=112&width=120&query=photo"
              }
              alt={`Image ${index + 1}`}
              loading="lazy"
              className="w-full bg-white h-full object-cover"
            />

            {/* Show +count on last visible image if there are more */}
            {index === 3 && media!.length > 4 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  +{media!.length - 4}
                </span>
              </div>
            )}

            {/* Timestamp on last image if no text */}
            {index === 3 && !text_content && (
              <>
                <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                <div className="absolute bottom-1 right-1 flex items-center gap-1 px-1 py-0.5 bg-black/30 backdrop-blur-sm rounded text-[10px] text-white">
                  <span>{formatTime(timestamp)}</span>
                  {is_sender && state && getStatusIcon()}
                </div>
              </>
            )}

            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
          </div>
        ))}
      </div>
    );
  };

  const openImageViewer = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeImageViewer = () => {
    setSelectedImageIndex(null);
  };

  return (
    <>
      <div
        className={`flex ${is_sender ? "justify-end" : "justify-start"} mb-1`}
      >
        <div
          className={`${
            // same_sender
            //   ? "rounded-2xl"
            //   :
            is_sender
              ? "chat-bubble-right rounded-l-2xl rounded-br-2xl rounded-tr-md"
              : "chat-bubble-left rounded-r-2xl rounded-bl-2xl rounded-tl-md"
          } relative max-w-xs shadow-sm overflow-hidden ${
            is_sender
              ? "bg-gradient-to-br from-blue-500 to-blue-600"
              : "bg-white border border-gray-200"
          }`}
        >
          <div className="p-1.5">{renderImageGrid()}</div>

          {/* Text content with inline timestamp */}
          {text_content && (
            <div className="px-3 pb-2">
              <div className="pb-4">
                <span
                  className={`text-sm leading-relaxed break-words ${
                    is_sender ? "text-white" : "text-gray-800"
                  }`}
                >
                  {text_content}
                </span>
              </div>

              {/* Timestamp positioned at bottom right */}
              <div className="absolute bottom-1 right-2">
                <span
                  className={`flex items-center space-x-1 text-xs ${
                    is_sender ? "text-white/80" : "text-gray-500"
                  }`}
                >
                  <span>{formatTime(timestamp)}</span>
                  {is_sender && state && getStatusIcon()}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Image Viewer */}
      {selectedImageIndex !== null && media && media?.length > 0 && (
        <ImageViewer
          images={media || []}
          initialIndex={selectedImageIndex}
          isOpen={selectedImageIndex !== null}
          onClose={closeImageViewer}
        />
      )}
    </>
  );
}
