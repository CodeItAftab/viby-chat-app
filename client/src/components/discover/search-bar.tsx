import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isSearching?: boolean;
}

export function SearchBar({
  searchQuery,
  onSearchChange,
  isSearching,
}: SearchBarProps) {
  return (
    <div className="w-full max-w-full">
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />

        <Input
          placeholder="Search people..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={`w-full max-w-full pl-10 h-12 bg-background/50 backdrop-blur-sm border border-border rounded-2xl transition-colors duration-200 hover:border-border/80 text-sm ${
            searchQuery || isSearching ? "pr-11" : "pr-4"
          }`}
        />

        {searchQuery && !isSearching && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onSearchChange("")}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 hover:bg-muted rounded-full flex-shrink-0 z-10"
          >
            <X className="h-3 w-3" />
          </Button>
        )}

        {isSearching && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex-shrink-0 z-10">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}
      </div>
    </div>
  );
}
