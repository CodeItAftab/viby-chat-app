import { cn } from "@/lib/utils";

import type { ReactNode } from "react";

interface DotBackgroundProps {
  children: ReactNode;
  className?: string;
}

export function DotBackground({ children, className }: DotBackgroundProps) {
  return (
    <div className={cn("relative", className)}>
      {/* Dot pattern background */}
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:20px_20px]",
          "[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]"
          // "dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]"
        )}
      />
      {/* Radial gradient for fade effect */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_100%,black)]" />
      {/* Children content */}
      <div className="relative z-20">{children}</div>
    </div>
  );
}
