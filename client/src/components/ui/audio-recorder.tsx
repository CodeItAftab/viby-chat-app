import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, Play, Pause, Trash2, Send, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSocket } from "@/hooks/socket";
import { useParams } from "react-router-dom";
import SocketEvents from "@/constants/event";

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob, duration: number) => void;
  onRecordingStart?: () => void;
  onRecordingStop?: () => void;
}

export function AudioRecorder({
  onRecordingComplete,
  onRecordingStart,
  onRecordingStop,
}: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [displayTime, setDisplayTime] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pauseStartRef = useRef<number | null>(null);
  const accumulatedTimeRef = useRef<number>(0);

  const { socket } = useSocket();

  const chatId = useParams<{ chatId: string }>().chatId;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  useEffect(() => {
    // Check if audio is being recorded
    if (!socket || !chatId) return;
    if (isRecording && !isPaused && !isPlaying) {
      socket.emit(SocketEvents.Recording, { chatId, isRecording: true });
    } else if (mediaRecorderRef.current && (isPaused || !isRecording)) {
      socket.emit(SocketEvents.Recording, { chatId, isRecording: false });
    }
  }, [isRecording, isPaused, isPlaying, socket, chatId]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/wav" });
        setRecordedBlob(blob);
        stream.getTracks().forEach((track) => track.stop());

        // Final duration
        const totalDuration = Math.round(
          (Date.now() -
            (startTimeRef.current ?? 0) -
            accumulatedTimeRef.current) /
            1000
        );
        setDuration(totalDuration);
      };

      // Setup timing
      startTimeRef.current = Date.now();
      accumulatedTimeRef.current = 0;
      pauseStartRef.current = null;

      // Start media recording
      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);
      setDisplayTime(0);
      onRecordingStart?.();

      // Start interval to update displayTime
      intervalRef.current = setInterval(() => {
        if (startTimeRef.current) {
          const now = Date.now();
          const pausedTime =
            isPaused && pauseStartRef.current ? now - pauseStartRef.current : 0;

          const displayDuration = Math.round(
            (now -
              startTimeRef.current -
              accumulatedTimeRef.current -
              pausedTime) /
              1000
          );
          setDisplayTime(displayDuration);
        }
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      pauseStartRef.current = Date.now();
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);

      if (pauseStartRef.current) {
        const pausedTime = Date.now() - pauseStartRef.current;
        accumulatedTimeRef.current += pausedTime;
      }
      pauseStartRef.current = null;
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      onRecordingStop?.();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setDisplayTime(0);
      }
    }
  };

  const playRecording = () => {
    if (recordedBlob && !isPlaying) {
      const url = URL.createObjectURL(recordedBlob);
      audioRef.current = new Audio(url);
      audioRef.current.play();
      setIsPlaying(true);

      audioRef.current.onended = () => {
        setIsPlaying(false);
        setCurrentTime(0);
        URL.revokeObjectURL(url);
      };

      // Update current time
      const updateTime = () => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime);
          if (!audioRef.current.paused) {
            requestAnimationFrame(updateTime);
          }
        }
      };
      updateTime();
    } else if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const deleteRecording = () => {
    setRecordedBlob(null);
    setDuration(0);
    setCurrentTime(0);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setDisplayTime(0);
  };

  const sendRecording = () => {
    if (recordedBlob) {
      onRecordingComplete(recordedBlob, duration);
      deleteRecording();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Recording preview
  if (recordedBlob) {
    return (
      <div className="w-full bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        {/* Mobile Layout */}
        <div className="block sm:hidden">
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Voice Message
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Player */}
          <div className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={playRecording}
                className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg flex-shrink-0 transition-transform hover:scale-105"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5 ml-0.5" />
                )}
              </Button>
              <div className="flex-1">
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-300 ease-out"
                    style={{
                      width: `${Math.min(
                        100,
                        duration > 0 ? (currentTime / duration) * 100 : 0
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={deleteRecording}
                className="flex-1 h-10 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/20"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
              <Button
                onClick={sendRecording}
                size="sm"
                className="flex-1 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
              >
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:block">
          <div className="p-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={playRecording}
                className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg flex-shrink-0 transition-transform hover:scale-105"
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6 ml-0.5" />
                )}
              </Button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-3">
                  <Volume2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Voice Message
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-mono ml-auto">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-300 ease-out"
                    style={{
                      width: `${Math.min(
                        100,
                        duration > 0 ? (currentTime / duration) * 100 : 0
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={deleteRecording}
                  className="h-11 w-11 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/20"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button
                  onClick={sendRecording}
                  size="sm"
                  className="h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg px-6"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Recording controls
  return (
    <div className="flex items-center gap-3">
      <Button
        variant={isRecording ? "destructive" : "default"}
        size="icon"
        onClick={isRecording ? stopRecording : startRecording}
        className={cn(
          "h-14 w-14 rounded-full transition-all duration-300 shadow-lg relative overflow-hidden",
          isRecording
            ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
            : "bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white hover:scale-105"
        )}
      >
        {isRecording ? (
          <Square className="h-6 w-6" />
        ) : (
          <Mic className="h-6 w-6" />
        )}

        {/* Recording pulse effect */}
        {isRecording && !isPaused && (
          <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75" />
        )}
      </Button>

      {/* Pause/Resume button when recording */}
      {isRecording && (
        <Button
          variant="outline"
          size="icon"
          onClick={isPaused ? resumeRecording : pauseRecording}
          className={cn(
            "h-12 w-12 rounded-full border-2 transition-all duration-200",
            isPaused
              ? "border-yellow-500 bg-yellow-50 hover:bg-yellow-100 text-yellow-600 dark:bg-yellow-950/20 dark:hover:bg-yellow-950/30 dark:text-yellow-400"
              : "border-blue-500 bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-950/20 dark:hover:bg-blue-950/30 dark:text-blue-400"
          )}
        >
          {isPaused ? (
            <Play className="h-5 w-5 ml-0.5" />
          ) : (
            <Pause className="h-5 w-5" />
          )}
        </Button>
      )}

      {/* Recording status */}
      {isRecording && (
        <div className="flex items-center gap-3 bg-white dark:bg-gray-800 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm animate-in slide-in-from-left-2 duration-300">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                isPaused ? "bg-yellow-500" : "bg-red-500 animate-pulse"
              )}
            />
            <span
              className={cn(
                "text-sm font-medium transition-colors duration-300",
                isPaused
                  ? "text-yellow-600 dark:text-yellow-400"
                  : "text-red-600 dark:text-red-400"
              )}
            >
              {isPaused ? "Paused" : "Recording"}
            </span>
          </div>
          <div className="w-px h-4 bg-gray-300 dark:bg-gray-600" />
          <span className="text-sm text-gray-600 dark:text-gray-400 font-mono tabular-nums">
            {formatTime(displayTime)}
          </span>
        </div>
      )}
    </div>
  );
}
