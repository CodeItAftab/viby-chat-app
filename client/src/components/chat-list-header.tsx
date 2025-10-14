import { Search, Plus, BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MobileUserSheet } from "@/components/mobile-user-sheet";
import { useAuth } from "@/hooks/auth";

interface ChatListHeaderProps {
  title: string;
  activeSection: string;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  showNotifications?: boolean;
  profileData?: { name: string; email: string; status: string };
  onNotificationsClick?: () => void;
  onProfileClick?: () => void;
}

export function ChatListHeader({
  title,
  activeSection,
  searchQuery,
  onSearchChange,
  showNotifications,
  onNotificationsClick,
  onProfileClick,
}: ChatListHeaderProps) {
  const { user } = useAuth();

  return (
    <div className="p-4 md:p-6 pb-4 border-b border-border bg-card/15 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent tracking-tight">
          {title}
        </h1>
        <div className="flex items-center space-x-2">
          {/* Notifications Button - Mobile */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={onNotificationsClick}
              className={`w-8 h-8 md:w-9 md:h-9 rounded-2xl transition-all duration-300 ${
                showNotifications
                  ? "bg-gradient-to-br from-blue-600/25 to-cyan-600/25 text-foreground shadow-lg shadow-blue-500/20 border border-blue-500/30"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <BellRing className="w-4 h-4" />
            </Button>
          </div>

          {activeSection === "chats" && (
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 md:w-9 md:h-9 hover:bg-muted rounded-2xl text-muted-foreground hover:text-foreground transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
            </Button>
          )}

          {/* Mobile Avatar with Sheet */}
          <div className="lg:hidden">
            <MobileUserSheet
              profileData={user}
              onProfileClick={onProfileClick}
            />
          </div>
        </div>
      </div>

      {/* Search - Only show for sections that need it */}
      {(activeSection === "chats" ||
        activeSection === "friends" ||
        activeSection === "calls" ||
        activeSection === "discover") && (
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={`Search ${activeSection}...`}
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onSearchChange && onSearchChange(e.target.value)
            }
            className="pl-11 bg-muted/25 border-border rounded-2xl h-10 md:h-11 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all backdrop-blur-sm shadow-sm text-sm"
          />
        </div>
      )}
    </div>
  );
}
