import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface RequestCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const RequestCard = React.forwardRef<HTMLDivElement, RequestCardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(
          "bg-card/60 backdrop-blur-xl border-border hover:bg-card/80 transition-all duration-300 shadow-lg hover:shadow-xl",
          className
        )}
        {...props}
      >
        <CardContent className="p-4 sm:p-6">{children}</CardContent>
      </Card>
    );
  }
);
RequestCard.displayName = "RequestCard";

interface RequestCardAvatarProps {
  src?: string;
  alt: string;
  fallback: string;
  badge?: React.ReactNode;
  size?: "md" | "lg";
}

const RequestCardAvatar = React.forwardRef<
  HTMLDivElement,
  RequestCardAvatarProps
>(({ src, alt, fallback, badge, size = "lg" }, ref) => {
  const sizeClasses = {
    md: "w-12 h-12 sm:w-14 sm:h-14",
    lg: "w-12 h-12 sm:w-16 sm:h-16",
  };

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <Avatar
        className={cn(sizeClasses[size], "ring-2 ring-primary/20 shadow-lg")}
      >
        <AvatarImage src={src || "/placeholder.svg"} alt={alt} />
        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-sm sm:text-lg font-bold">
          {fallback}
        </AvatarFallback>
      </Avatar>
      {badge && (
        <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center shadow-lg">
          {badge}
        </div>
      )}
    </div>
  );
});
RequestCardAvatar.displayName = "RequestCardAvatar";

interface RequestCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const RequestCardContent = React.forwardRef<
  HTMLDivElement,
  RequestCardContentProps
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex-1 min-w-0 overflow-hidden", className)}
      {...props}
    >
      {children}
    </div>
  );
});
RequestCardContent.displayName = "RequestCardContent";

interface RequestCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  timestamp: string;
  badge?: React.ReactNode;
}

const RequestCardHeader = React.forwardRef<
  HTMLDivElement,
  RequestCardHeaderProps
>(({ className, name, timestamp, badge, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3",
        className
      )}
      {...props}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-bold text-foreground text-base sm:text-lg tracking-tight truncate">
            {name}
          </h3>
          {badge}
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground font-medium">
          {timestamp}
        </p>
      </div>
    </div>
  );
});
RequestCardHeader.displayName = "RequestCardHeader";

interface RequestCardActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  layout?: "horizontal" | "vertical";
}

const RequestCardActions = React.forwardRef<
  HTMLDivElement,
  RequestCardActionsProps
>(({ className, children, layout = "horizontal", ...props }, ref) => {
  const layoutClass =
    layout === "vertical"
      ? "flex flex-col sm:flex-row items-start sm:items-center gap-3"
      : "flex items-center gap-3";

  return (
    <div ref={ref} className={cn(layoutClass, className)} {...props}>
      {children}
    </div>
  );
});
RequestCardActions.displayName = "RequestCardActions";

export {
  RequestCard,
  RequestCardAvatar,
  RequestCardContent,
  RequestCardHeader,
  RequestCardActions,
};
