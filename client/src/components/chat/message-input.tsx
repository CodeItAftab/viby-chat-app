import type React from "react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { AudioRecorder } from "@/components/ui/audio-recorder";
import { FileUpload } from "@/components/ui/file-upload";
import {
  Send,
  Smile,
  Paperclip,
  Mic,
  X,
  // ImageIcon,
  Video,
  FileText,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useParams } from "react-router-dom";
import { useSendMessageMutation } from "@/store/api/viby";
import { useSocket } from "@/hooks/socket";
import SocketEvents from "@/constants/event";

interface MessageInputProps {
  placeholder?: string;
  className?: string;
}

export function MessageInput({
  // onSendMessage,
  placeholder = "Type a message...",
  className,
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFile, setIsFile] = useState(false);
  const { chatId } = useParams<{ chatId: string }>();
  const [sendMessage] = useSendMessageMutation();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { socket } = useSocket();

  const handleSend = async () => {
    if (!message.trim() && selectedFiles.length === 0) return;
    if (!chatId) return;

    try {
      // setShowFileUpload(false);
      console.log(selectedFiles);
      const formData = new FormData();
      formData.append("chatId", chatId);
      formData.append("text_content", message.trim());
      formData.append(
        "type",
        isFile
          ? "file"
          : selectedFiles.length > 0
          ? selectedFiles[0].type.split("/")[0]
          : "text"
      );
      selectedFiles.forEach((file) => {
        formData.append("media", file);
      });

      setSelectedFiles([]);
      setMessage("");
      setShowFileUpload(false); // Move here
      setShowAudioRecorder(false);
      setIsFile(false);
      const res = await sendMessage(formData).unwrap();
      console.log(res);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleFileSelect = (files: File[]) => {
    setSelectedFiles((prev) => [...prev, ...files]);
    setShowFileUpload(false);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAudioRecording = async (audioBlob: Blob, duration: number) => {
    if (!chatId) return;

    const audioFile = new File([audioBlob], `recording-${Date.now()}.wav`, {
      type: "audio/wav",
    });

    try {
      const formData = new FormData();
      formData.append("text_content", ""); // keep this empty for audio
      formData.append("type", "audio");
      formData.append("chatId", chatId);
      formData.append("media", audioFile); // <— CRITICAL
      formData.append("duration", duration.toString());

      setShowAudioRecorder(false);
      setIsRecording(false);
      await sendMessage(formData); // Optimistic update will kick in
    } catch (err) {
      console.error("Error sending voice message:", err);
    }
  };

  const toggleFileUpload = () => {
    setShowFileUpload(!showFileUpload);
    setShowAudioRecorder(false);
  };

  const toggleAudioRecorder = () => {
    setShowAudioRecorder(!showAudioRecorder);
    setShowFileUpload(false);
  };

  const closeAllPanels = () => {
    setShowFileUpload(false);
    setShowAudioRecorder(false);
  };

  const handleKeyPress = () => {
    if (!socket || !chatId) return;
    if (!isTyping) {
      setIsTyping(true);
      socket?.emit(SocketEvents.Typing, { chatId, isTyping: true }); //todo : edit this
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket?.emit(SocketEvents.Typing, { chatId, isTyping: false }); //todo : edit this
    }, 1000);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  const renderFilePreview = (file: File) => {
    if (file.type.startsWith("image/")) {
      return (
        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700">
          <img
            src={URL.createObjectURL(file) || "/placeholder.svg"}
            alt={file.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <Eye className="h-4 w-4 text-white" />
          </div>
        </div>
      );
    }

    if (file.type.startsWith("video/")) {
      return (
        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700">
          <video
            src={URL.createObjectURL(file)}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Video className="h-6 w-6 text-white" />
          </div>
        </div>
      );
    }

    return (
      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
        <FileText className="h-6 w-6 text-white" />
      </div>
    );
  };

  return (
    <div
      className={cn(
        "border-t border-blue-200/50 dark:border-blue-800/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl",
        className
      )}
    >
      {/* File Upload Panel */}
      {showFileUpload && (
        <div className="p-4 border-b border-blue-200/50 dark:border-blue-800/50 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/50 dark:to-indigo-950/50 animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Share files
            </h4>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeAllPanels}
              className="h-8 w-8 hover:bg-red-100 dark:hover:bg-red-900/30"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <FileUpload setIsFile={setIsFile} onFileSelect={handleFileSelect} />
        </div>
      )}

      {/* Audio Recorder Panel */}
      {showAudioRecorder && (
        <div className="p-4 border-b border-blue-200/50 dark:border-blue-800/50 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/50 dark:to-indigo-950/50 animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Record voice message
            </h4>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeAllPanels}
              className="h-8 w-8 hover:bg-red-100 dark:hover:bg-red-900/30"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-center">
            <AudioRecorder
              onRecordingComplete={handleAudioRecording}
              onRecordingStart={() => setIsRecording(true)}
              onRecordingStop={() => setIsRecording(false)}
            />
          </div>
        </div>
      )}

      {/* File Previews */}
      {selectedFiles.length > 0 && (
        <div className="p-4 border-b border-blue-200/50 dark:border-blue-800/50 bg-gradient-to-r from-slate-50/50 to-blue-50/50 dark:from-slate-900/50 dark:to-blue-900/50">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {selectedFiles.length} file{selectedFiles.length > 1 ? "s" : ""}{" "}
              selected
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedFiles([])}
              className="text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30"
            >
              Clear all
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-h-40 overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="relative group bg-white dark:bg-slate-800 rounded-xl border border-blue-200 dark:border-blue-800 shadow-sm overflow-hidden"
              >
                <div className="p-3">
                  <div className="flex flex-col items-center gap-2">
                    {renderFilePreview(file)}
                    <div className="text-center min-w-0 w-full">
                      <p className="text-xs font-medium truncate text-slate-900 dark:text-slate-100">
                        {file.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(index)}
                  className="absolute top-1 right-1 h-6 w-6 bg-red-500/80 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message Input - Fixed height with hidden scrollbar */}

      <div className="flex items-end gap-3 p-4">
        {/* Action Buttons */}
        <div className="flex items-center flex-shrink-0">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-full p-1 shadow-sm">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={toggleFileUpload}
              className={cn(
                "h-9 w-9 rounded-full transition-all duration-200",
                showFileUpload
                  ? "bg-blue-600 text-white shadow-lg"
                  : "hover:bg-blue-100 dark:hover:bg-blue-900/50 text-slate-600 dark:text-slate-400"
              )}
            >
              {showFileUpload ? (
                <X className="h-4 w-4" />
              ) : (
                <Paperclip className="h-4 w-4" />
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={toggleAudioRecorder}
              className={cn(
                "h-9 w-9 rounded-full transition-all duration-200",
                showAudioRecorder || isRecording
                  ? "bg-red-500 text-white shadow-lg"
                  : "hover:bg-red-100 dark:hover:bg-red-900/50 text-slate-600 dark:text-slate-400"
              )}
            >
              <Mic className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Text Input Container - Fixed height with hidden scrollbar */}
        <div className="flex-1 min-w-0 relative">
          <div className="relative bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200 shadow-sm hover:shadow-md">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleInput}
              onKeyDown={handleKeyPress}
              placeholder={
                selectedFiles.length > 0 ? "Add a caption..." : placeholder
              }
              className="w-full h-9 max-h-11 resize-none border-0 bg-transparent px-4 py-1 pr-12 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none overflow-y-auto scrollbar-hide"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            />
            {/* Emoji Button */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-500 dark:text-slate-400 rounded-full"
            >
              <Smile className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* {message ? ( */}
        <Button
          onClick={handleSend}
          // disabled={!message.trim() && selectedFiles.length === 0}
          size="icon"
          className={cn(
            "h-11 w-11 rounded-full shadow-lg transition-all duration-200 flex-shrink-0",
            // message.trim() || selectedFiles.length > 0
            // ?
            "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:scale-105 text-white"
            // : "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
          )}
        >
          <Send className="h-5 w-5" />
        </Button>
        {/* ) : (
          <Button
            onClick={toggleAudioRecorder}
            // disabled={!message.trim() && selectedFiles.length === 0}
            size="icon"
            className={cn(
              "h-11 w-11 rounded-full shadow-lg transition-all duration-200 flex-shrink-0",
              // message.trim() || selectedFiles.length > 0
              // ?
              "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:scale-105 text-white"
              // : "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
            )}
          >
            <Mic className="h-5 w-5" />
          </Button>
        )} */}
      </div>

      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
