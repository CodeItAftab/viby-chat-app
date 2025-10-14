import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { ReactNode } from "react";

interface ListItemProps {
  children: ReactNode;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function ListItem({
  children,
  selected,
  onClick,
  className,
}: ListItemProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-4 cursor-pointer transition-all duration-200",
        "hover:bg-slate-50 dark:hover:bg-slate-800 active:bg-slate-100 dark:active:bg-slate-600",
        "mx-2 my-1 rounded-xl", // Added rounded corners and margin
        selected &&
          "bg-blue-50 dark:bg-blue-950/50 border-l-4 border-blue-500 dark:border-blue-400", // Changed from border-r-2 to border-l-4
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

interface ListItemAvatarProps {
  src?: string;
  alt: string;
  fallback: string;
  online?: boolean;
}

export function ListItemAvatar({
  src,
  alt,
  fallback,
  online,
}: ListItemAvatarProps) {
  return (
    <div className="relative flex-shrink-0">
      <Avatar className="h-12 w-12 ring-2 ring-white dark:ring-slate-800 shadow-sm rounded-full">
        {" "}
        {/* Added rounded-full */}
        <AvatarImage src={src || "/placeholder.svg"} alt={alt} />
        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 text-white font-semibold">
          {fallback}
        </AvatarFallback>
      </Avatar>
      {online && (
        <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 bg-green-500 dark:bg-green-400 border-2 border-white dark:border-slate-900 rounded-full shadow-sm" />
      )}
    </div>
  );
}

export function ListItemContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("flex-1 min-w-0", className)}>{children}</div>;
}

export function ListItemHeader({ children }: { children: ReactNode }) {
  return <div className="flex items-center justify-between">{children}</div>;
}

export function ListItemTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={cn(
        "text-base font-medium text-slate-900 dark:text-slate-100 truncate",
        className
      )}
    >
      {children}
    </h3>
  );
}

export function ListItemMeta({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "text-xs text-slate-500 dark:text-slate-400 flex-shrink-0",
        className
      )}
    >
      {children}
    </span>
  );
}

export function ListItemDescription({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("text-sm text-slate-600 dark:text-slate-300", className)}
    >
      {children}
    </div>
  );
}

interface ListItemActionsProps {
  children: ReactNode;
  visible?: "always" | "hover";
  className?: string;
}

export function ListItemActions({
  children,
  visible = "always",
  className,
}: ListItemActionsProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-1 transition-opacity duration-200",
        visible === "hover" && "opacity-0 group-hover:opacity-100",
        className
      )}
    >
      {children}
    </div>
  );
}
