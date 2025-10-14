import { MessageCircle, Users, Phone, Search, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/hooks/auth";

const sidebarItems = [
  { icon: MessageCircle, label: "Chats", key: "chats", href: "/chat" },
  { icon: Users, label: "Friends", key: "friends", href: "/friends" },
  { icon: Search, label: "Discover", key: "discover", href: "/discover" },
  { icon: UserCheck, label: "Requests", key: "requests", href: "/requests" },
  { icon: Phone, label: "Calls", key: "calls", href: "/calls" },
];

export function Sidebar() {
  const { user } = useAuth();

  return (
    <div className="hidden lg:flex lg:w-16 lg:flex-col lg:bg-card/40 lg:border-r lg:border-border lg:backdrop-blur-xl">
      <div className="flex flex-col items-center py-6 space-y-3">
        {/* Logo */}
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-blue-500/25">
          <MessageCircle className="w-5 h-5 text-white" />
        </div>

        {/* Navigation Items */}
        {sidebarItems.map((item, index) => (
          <NavLink key={index} to={item?.href || "#"}>
            {({ isActive }) => (
              <Button
                variant="ghost"
                size="icon"
                className={`w-10 h-10 rounded-2xl transition-all cursor-pointer duration-300 ${
                  isActive
                    ? "bg-gradient-to-br from-blue-600/25 to-cyan-600/25 text-foreground shadow-lg shadow-blue-500/20 border border-blue-500/30"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="w-5 h-5" />
              </Button>
            )}
          </NavLink>
        ))}
      </div>

      {/* User Avatar at Bottom */}
      <div className="mt-auto p-4">
        <Button
          variant="ghost"
          size="icon"
          // onClick={onSettingsClick}
          className={`w-10 h-10 rounded-2xl transition-all duration-300 ${
            // showSettings
            // ?
            "bg-gradient-to-br from-blue-600/25 to-cyan-600/25 shadow-lg shadow-blue-500/20 border border-blue-500/30"
            // : "hover:bg-muted"
          }`}
        >
          <Avatar className="w-8 h-8 ring-2 ring-primary/25 shadow-lg">
            <AvatarImage
              src={user?.avatar ?? "/placeholder.svg?height=32&width=32"}
            />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-xs font-bold">
              {user?.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        </Button>
      </div>
    </div>
  );
}
