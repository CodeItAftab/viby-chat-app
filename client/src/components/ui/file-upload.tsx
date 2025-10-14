import type React from "react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Video, Camera, Folder } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileSelect: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  setIsFile?: (isFile: boolean) => void; // Optional prop to set file type state
  className?: string;
}

export function FileUpload({
  onFileSelect,
  accept = "*/*",
  multiple = true,
  setIsFile,
  className,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setIsFile?.(true);
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files: File[]) => {
    onFileSelect(files);
  };

  const openFileDialog = (type: "image" | "video" | "file" = "file") => {
    switch (type) {
      case "image":
        imageInputRef.current?.click();
        break;
      case "video":
        videoInputRef.current?.click();
        break;
      case "file":
        fileInputRef.current?.click();
        break;
    }
  };

  return (
    <div className={cn("space-y-3 sm:space-y-4", className)}>
      {/* Hidden inputs for each type */}
      <input
        ref={imageInputRef}
        type="file"
        multiple={multiple}
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
      <input
        ref={videoInputRef}
        type="file"
        multiple={multiple}
        accept="video/*"
        onChange={handleChange}
        className="hidden"
      />
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={(e) => {
          setIsFile?.(true);
          handleChange(e);
        }}
        className="hidden"
      />
      {/* Quick Action Buttons - Mobile Friendly */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <Button
          variant="outline"
          onClick={() => openFileDialog("image")}
          className="flex flex-col items-center gap-1 sm:gap-2 h-16 sm:h-20 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900 dark:hover:to-indigo-900"
        >
          <Camera className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
          <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
            Photos
          </span>
        </Button>
        <Button
          variant="outline"
          onClick={() => openFileDialog("video")}
          className="flex flex-col items-center gap-1 sm:gap-2 h-16 sm:h-20 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800 hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900 dark:hover:to-pink-900"
        >
          <Video className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-400" />
          <span className="text-xs font-medium text-purple-700 dark:text-purple-300">
            Videos
          </span>
        </Button>
        <Button
          variant="outline"
          onClick={() => openFileDialog("file")}
          className="flex flex-col items-center gap-1 sm:gap-2 h-16 sm:h-20 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 border-emerald-200 dark:border-emerald-800 hover:from-emerald-100 hover:to-teal-100 dark:hover:from-emerald-900 dark:hover:to-teal-900"
        >
          <Folder className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600 dark:text-emerald-400" />
          <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
            Files
          </span>
        </Button>
      </div>

      {/* Drop Zone */}
      <div
        className={cn(
          "relative border-2 border-dashed rounded-xl sm:rounded-2xl p-4 sm:p-8 text-center transition-all duration-300 cursor-pointer max-lg:hidden",
          dragActive
            ? "border-blue-500 bg-blue-50 dark:bg-blue-950/50 scale-105 shadow-lg"
            : "border-blue-300 dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-950/30"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => openFileDialog()}
      >
        <div className="space-y-3 sm:space-y-4">
          <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
            <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          </div>
          <div className="space-y-1 sm:space-y-2">
            <p className="text-sm sm:text-lg font-semibold text-slate-900 dark:text-slate-100">
              Drop files here or{" "}
              <span className="text-blue-600 dark:text-blue-400">browse</span>
            </p>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Supports images, videos, documents and more
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Maximum file size: 10MB per file
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
