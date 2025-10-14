import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, UserPlus, Users, Sparkles } from "lucide-react";

interface EmptyStateProps {
  type: "no-suggestions" | "no-results" | "search-prompt";
  searchQuery?: string;
}

export function EmptyState({ type, searchQuery }: EmptyStateProps) {
  const configs = {
    "no-suggestions": {
      icon: UserPlus,
      title: "Discover new people",
      description:
        "Search for people to connect with or check out our suggestions.",
      action: (
        <Button
          variant="outline"
          className="mt-6 bg-transparent border-primary/20 text-primary hover:bg-primary/10"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Browse Suggestions
        </Button>
      ),
    },
    "no-results": {
      icon: Search,
      title: "No users found",
      description: `No results found for "${searchQuery}". Try adjusting your search terms.`,
      action: null,
    },
    "search-prompt": {
      icon: Users,
      title: "Find your community",
      description:
        "Start typing to search for people you'd like to connect with.",
      action: (
        <Button
          variant="outline"
          className="mt-6 bg-transparent border-primary/20 text-primary hover:bg-primary/10"
        >
          <Users className="h-4 w-4 mr-2" />
          Browse Suggestions
        </Button>
      ),
    },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <Card className="relative overflow-hidden border border-border/50 bg-card/70 backdrop-blur-sm p-6 sm:p-8 lg:p-10 text-center flex flex-col items-center justify-center shadow-lg shadow-primary/5 dark:shadow-primary/10 animate-in fade-in-0 zoom-in-95 duration-500">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-70" />
      <div className="relative z-10 flex flex-col items-center">
        <div className="rounded-full bg-gradient-to-br from-primary/20 to-accent/20 p-4 sm:p-5 mb-4 sm:mb-6 shadow-xl shadow-primary/20 dark:shadow-primary/30">
          <Icon className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2 sm:mb-3">
          {config.title}
        </h3>

        <p className="text-sm sm:text-base text-muted-foreground max-w-md leading-relaxed">
          {config.description}
        </p>

        {config.action}
      </div>
    </Card>
  );
}
