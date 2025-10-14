import type React from "react";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface ActionButtonProps {
  icon: ReactNode;
  tooltip?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

export function ActionButton({
  icon,
  tooltip,
  onClick,
  className,
}: ActionButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center",
        "w-8 h-8 rounded-xl", // Changed from rounded-full to rounded-xl
        "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200",
        "hover:bg-slate-100 dark:hover:bg-slate-700 active:bg-slate-200 dark:active:bg-slate-600",
        "transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-1 dark:focus:ring-offset-slate-900",
        className
      )}
      onClick={onClick}
      title={tooltip}
    >
      {icon}
    </button>
  );
}
