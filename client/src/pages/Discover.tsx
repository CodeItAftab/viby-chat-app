import { UserCard } from "@/components/discover/user-card";
import { SearchBar } from "@/components/discover/search-bar";
import { EmptyState } from "@/components/discover/empty-state";
import { SectionHeader } from "@/components/discover/section-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, TrendingUp, MoreHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  useGetSuggestedUsersQuery,
  useLazySearchUsersQuery,
} from "@/store/api/viby";

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: suggestedUsers = [] } = useGetSuggestedUsersQuery();
  const [triggerSearch, { data: searchResults = [], isLoading: isSearching }] =
    useLazySearchUsersQuery();

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear previous debounce timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set new debounce timeout
    debounceRef.current = setTimeout(() => {
      if (searchQuery.trim()) {
        triggerSearch(searchQuery.trim());
      }
    }, 300);

    // Cleanup on component unmount
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchQuery, triggerSearch]);

  return (
    <div className="flex-1 bg-gradient-to-br from-background via-background/95 to-muted/20 dark:from-background dark:via-background/98 dark:to-muted/10 min-w-0">
      <div className="flex flex-col h-full min-w-0 overflow-visible">
        {/* Header */}
        <div className="flex-shrink-0 border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="p-3 sm:p-4 lg:p-6 xl:p-8 min-w-0">
            {/* Top Bar */}
            <div className="flex items-center justify-between gap-2 sm:gap-4 mb-4 sm:mb-6 lg:mb-8 min-w-0">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl lg:rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20 flex-shrink-0">
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent truncate">
                    Discover People
                  </h1>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 truncate">
                    Connect with amazing people
                  </p>
                </div>
              </div>

              {/* Removed ThemeToggle and Mobile Menu Toggle as requested */}
            </div>

            {/* Search Bar and Filter */}
            <div className="flex gap-2 sm:gap-3 min-w-0 px-2 py-1">
              <div className="flex-1 min-w-0">
                <SearchBar
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  isSearching={isSearching}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto pb-16 lg:pb-0 min-w-0 min-h-0">
          <div className="p-4 sm:p-4 lg:p-6 xl:p-8 space-y-4 sm:space-y-6 lg:space-y-8 pb-20 sm:pb-8 min-w-0 max-w-full">
            {/* Search Results */}
            {searchQuery && (
              <div className="space-y-4 sm:space-y-4 min-w-0">
                <SectionHeader
                  icon={<TrendingUp className="h-5 w-5 text-primary" />}
                  title="Search Results"
                  badge={
                    isSearching
                      ? "Searching..."
                      : `${searchResults.length} found`
                  }
                  badgeColor="primary"
                />

                {isSearching ? (
                  <div className="space-y-3 sm:space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="bg-muted/50 rounded-xl sm:rounded-2xl h-20 sm:h-24" />
                      </div>
                    ))}
                  </div>
                ) : searchResults.length === 0 ? (
                  <EmptyState type="no-results" searchQuery={searchQuery} />
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {searchResults.map((user) => (
                      <UserCard key={user._id} user={user} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Suggested Users */}
            {!searchQuery && suggestedUsers.length > 0 && (
              <div className="space-y-4 sm:space-y-6 min-w-0">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex-shrink-0">
                      <Heart className="h-5 w-5 text-pink-500" />
                    </div>
                    <h2 className="text-lg sm:text-xl font-semibold text-foreground truncate">
                      <span className="sm:hidden">Suggestions</span>
                      <span className="hidden sm:inline">
                        People you may know
                      </span>
                    </h2>
                    <Badge
                      variant="secondary"
                      className={`text-xs px-2 py-1 bg-pink-500/10 text-pink-500 border-pink-500/20 hover:bg-pink-500/20`}
                    >
                      {suggestedUsers.length} suggestions
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {suggestedUsers.map((user) => (
                    <UserCard key={user._id} user={user} showSuggestionBadge />
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {!searchQuery && suggestedUsers.length === 0 && (
              <EmptyState type="no-suggestions" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
