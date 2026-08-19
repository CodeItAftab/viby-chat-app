import {
  LogOut,
  MessageCircle,
  Users,
  Search,
  UserCheck,
  Settings as SettingsIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/auth";

const sidebarItems = [
  { icon: MessageCircle, label: "Chats", key: "chats", href: "/chat" },
  { icon: Users, label: "Friends", key: "friends", href: "/friends" },
  { icon: Search, label: "Discover", key: "discover", href: "/discover" },
  { icon: UserCheck, label: "Requests", key: "requests", href: "/requests" },
];

export function Sidebar() {
  const { user, Logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    Logout();
    navigate("/auth/login", { replace: true });
  };

  return (
    <div className="hidden lg:flex lg:w-16 lg:shrink-0 lg:flex-col lg:bg-card/40 lg:border-r lg:border-border lg:backdrop-blur-xl">
      <div className="flex flex-col items-center py-6 space-y-3">
        <Button
          variant="ghost"
          size="icon"
          title="Go to chats"
          aria-label="Go to chats"
          onClick={() => navigate("/chat")}
          className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-blue-500/25 hover:opacity-90"
        >
          <MessageCircle className="w-5 h-5 text-white" />
        </Button>

        {/* Navigation Items */}
        {sidebarItems.map((item, index) => (
          <NavLink key={index} to={item?.href || "#"}>
            {({ isActive }) => (
              <Button
                variant="ghost"
                size="icon"
                title={item.label}
                aria-label={item.label}
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
      <div className="mt-auto flex flex-col items-center gap-2 p-3">
        <Button
          onClick={() => navigate("/profile")}
          title="Open profile"
          aria-label="Open profile"
          variant="ghost"
          size="icon"
          className="w-10 h-10 rounded-2xl transition-all duration-300 hover:bg-muted"
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
        <Button
          onClick={handleLogout}
          title="Log out"
          aria-label="Log out"
          variant="ghost"
          size="icon"
          className="w-10 h-10 rounded-2xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-5 w-5" />
        </Button>
        <Button
          onClick={() => navigate("/settings")}
          title="Open settings"
          aria-label="Open settings"
          variant="ghost"
          size="icon"
          className="w-10 h-10 rounded-2xl text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <SettingsIcon className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
