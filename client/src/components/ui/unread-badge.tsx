import { cn } from "@/lib/utils";

interface UnreadBadgeProps {
  count: number;
  className?: string;
}

export function UnreadBadge({ count, className }: UnreadBadgeProps) {
  if (count === 0) return null;

  const displayCount = count > 99 ? "99+" : count.toString();

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center",
        "min-w-[20px] h-5 px-1.5 rounded-lg", // Changed from rounded-full to rounded-lg
        "bg-blue-500 dark:bg-blue-600 text-white text-xs font-semibold",
        "shadow-sm dark:shadow-slate-900/20",
        className
      )}
    >
      {displayCount}
    </div>
  );
}
