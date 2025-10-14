import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import type { ReactNode } from "react";

interface SectionHeaderProps {
  icon: ReactNode;
  title: string;
  count?: number;
  badge?: string;
  badgeColor?: string;
  showMore?: boolean;
}

export function SectionHeader({
  icon,
  title,
  count,
  badge,
  badgeColor = "primary",
  showMore,
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex-shrink-0">{icon}</div>
        <h2 className="text-lg sm:text-xl font-semibold text-foreground truncate">
          {title}
        </h2>
        {(count !== undefined || badge) && (
          <Badge
            variant="secondary"
            className={`bg-${badgeColor}/10 text-${badgeColor} border-${badgeColor}/20 text-xs sm:text-sm flex-shrink-0`}
          >
            {badge || `${count} ${count === 1 ? "person" : "people"}`}
          </Badge>
        )}
      </div>

      {showMore && (
        <Button
          variant="ghost"
          size="sm"
          className="flex-shrink-0 text-muted-foreground hover:text-foreground"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
