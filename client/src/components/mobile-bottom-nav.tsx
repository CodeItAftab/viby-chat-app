import {
  MessageCircle,
  Users,
  //  Phone,
  Search,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";

interface MobileBottomNavProps {
  showSettings?: boolean;
  showNotifications?: boolean;
}

const bottomNavItems = [
  { icon: MessageCircle, label: "Chats", key: "chats", href: "/chat" },
  { icon: Users, label: "Friends", key: "friends", href: "/friends" },
  { icon: Search, label: "Discover", key: "discover", href: "/discover" },
  { icon: UserCheck, label: "Requests", key: "requests", href: "/requests" },
];

export function MobileBottomNav({
  showSettings = false,
  showNotifications = false,
}: MobileBottomNavProps) {
  const { chatId } = useParams<"chatId">();

  return (
    <div
      className={cn(
        "lg:hidden fixed inset-x-0 bottom-0 z-50 min-h-16 bg-card/95 backdrop-blur-2xl border-t border-border px-2 pb-[env(safe-area-inset-bottom)] pt-1 md:px-4",
        chatId && "max-lg:hidden",
      )}
    >
      <div className="flex min-h-14 items-center justify-around">
        {bottomNavItems.map((item, index) => (
          <NavLink key={index} to={item?.href || "#"}>
            {({ isActive }) => (
              <Button
                variant="ghost"
                size="icon"
                className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex flex-col items-center justify-center space-y-0.5 transition-all duration-300 ${
                  isActive && !showSettings && !showNotifications
                    ? "text-foreground bg-gradient-to-br from-blue-600/25 to-cyan-600/25 shadow-lg shadow-blue-500/20 border border-blue-500/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <item.icon className="w-4 h-4 md:w-5 md:h-5" />
                {/* <span className="text-xs font-medium tracking-tight">
                  {item.label}
                </span> */}
              </Button>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
