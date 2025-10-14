import { MessageCircle, Users, Phone, Search, UserCheck } from "lucide-react";
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
  { icon: Phone, label: "Calls", key: "calls", href: "/calls" },
];

export function MobileBottomNav({
  showSettings = false,
  showNotifications = false,
}: MobileBottomNavProps) {
  const { chatId } = useParams<"chatId">();

  return (
    <div
      className={cn(
        "lg:hidden fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-2xl border-t border-border px-2 md:px-4 py-2 safe-area-pb",
        chatId && "max-lg:hidden"
      )}
    >
      <div className="flex items-center justify-around">
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
