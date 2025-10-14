/**
 * Formats a timestamp into a relative time string (e.g., "now", "2m ago", "1h ago")
 * @param isoString - ISO string timestamp or Date object
 * @returns Formatted relative time string
 */
export const formatRelativeTime = (isoString: string | Date): string => {
  const now = new Date();
  const createdAt = new Date(isoString);
  const diffInSeconds = Math.floor(
    (now.getTime() - createdAt.getTime()) / 1000
  );

  if (diffInSeconds < 60) {
    return diffInSeconds <= 5 ? "now" : `${diffInSeconds}s ago`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks}w ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths}mo ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears}y ago`;
};

/**
 * Safely converts a Date or string timestamp to ISO string
 * @param dateValue - Date object or ISO string
 * @returns ISO string
 */
export const getISOString = (dateValue: string | Date): string => {
  if (typeof dateValue === "string") {
    return dateValue;
  }
  return dateValue.toISOString();
};

export const formatTime = (date: Date | string) => {
  if (typeof date === "string") {
    date = new Date(date);
  }
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};
