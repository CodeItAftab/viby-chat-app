import {
  User,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/hooks/use-theme";
import { useEffect, useState } from "react";
import type { User as ProfileUser } from "@/types";
import { useNotification } from "@/hooks/notification";

interface MobileUserSheetProps {
  profileData: ProfileUser;
  onProfileClick?: () => void;
}

export function MobileUserSheet({
  profileData,
  onProfileClick,
}: MobileUserSheetProps) {
  const { theme, setTheme } = useTheme();
  const {
    isNotiificationEnabled,
    RequestNotificationPermission,
    DisableNotification,
  } = useNotification();

  const [notificationAllowed, setNotiificationAllowed] = useState(false);

  const HandleNotificationChange = () => {
    if (notificationAllowed) {
      try {
        // Call function to disable notifications
        setNotiificationAllowed(false);
        DisableNotification();
      } catch (error) {
        console.error("Error disabling notifications:", error);
        setNotiificationAllowed(true);
      }
    } else {
      try {
        setNotiificationAllowed(true);
        // Call function to enable notifications
        RequestNotificationPermission();
      } catch (error) {
        console.error("Error enabling notifications:", error);
        setNotiificationAllowed(false);
      }
    }
  };

  useEffect(() => {
    const isNotificationPermitted = isNotiificationEnabled();
    setNotiificationAllowed(isNotificationPermitted);
  }, [isNotiificationEnabled]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 md:w-9 md:h-9 hover:bg-muted rounded-2xl transition-all duration-300"
        >
          <Avatar className="w-6 h-6 md:w-7 md:h-7 ring-2 ring-blue-500/25 shadow-lg">
            <AvatarImage src="/placeholder.svg?height=28&width=28" />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-xs font-bold">
              {profileData?.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-80 p-0 bg-card/95 backdrop-blur-2xl border-border"
      >
        <SheetHeader className="p-6 pb-4 bg-muted/40 backdrop-blur-xl">
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16 ring-2 ring-blue-500/25 shadow-xl">
              <AvatarImage
                src={
                  profileData?.avatar ?? "/placeholder.svg?height=64&width=64"
                }
              />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-lg font-bold">
                {profileData?.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <SheetTitle className="text-foreground text-lg tracking-tight">
                {profileData?.name}
              </SheetTitle>
              <p className="text-blue-500 dark:text-blue-400 text-sm mt-1">
                {profileData?.email}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <span className="text-xs text-emerald-500 dark:text-emerald-400">
                  {/* {profileData?.status} */}
                  Available
                </span>
              </div>
            </div>
          </div>
        </SheetHeader>

        <div className="px-6 space-y-6 scrollbar-hide overflow-y-auto h-full pb-6">
          <Separator className="bg-border" />

          {/* Profile Section */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground tracking-tight">
              Profile
            </h3>
            <Button
              variant="ghost"
              onClick={onProfileClick}
              className="w-full justify-start text-left p-3 h-auto hover:bg-muted rounded-2xl text-muted-foreground hover:text-foreground transition-all duration-300"
            >
              <User className="w-5 h-5 mr-3 text-blue-500 dark:text-blue-400" />
              <div>
                <p className="text-sm font-medium">View Profile</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  See your profile details
                </p>
              </div>
            </Button>
          </div>

          <Separator className="bg-border" />

          {/* Settings Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground tracking-tight">
              Settings
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-muted transition-all duration-300">
                <div className="flex items-center">
                  <Bell className="w-5 h-5 mr-3 text-blue-500 dark:text-blue-400" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Notifications
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Push notifications
                    </p>
                  </div>
                </div>
                <Switch
                  checked={notificationAllowed}
                  onCheckedChange={HandleNotificationChange}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-muted transition-all duration-300">
                <div className="flex items-center">
                  {theme === "dark" ? (
                    <Moon className="w-5 h-5 mr-3 text-blue-500 dark:text-blue-400" />
                  ) : (
                    <Sun className="w-5 h-5 mr-3 text-blue-500 dark:text-blue-400" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-foreground">Theme</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Switch between light and dark
                    </p>
                  </div>
                </div>
                <Switch
                  checked={theme === "dark"}
                  onCheckedChange={(checked) =>
                    setTheme(checked ? "dark" : "light")
                  }
                />
              </div>

              <Button
                variant="ghost"
                className="w-full justify-start text-left p-3 h-auto hover:bg-muted rounded-2xl text-muted-foreground hover:text-foreground transition-all duration-300"
              >
                <Shield className="w-5 h-5 mr-3 text-blue-500 dark:text-blue-400" />
                <div>
                  <p className="text-sm font-medium">Privacy & Security</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Manage your privacy settings
                  </p>
                </div>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start text-left p-3 h-auto hover:bg-muted rounded-2xl text-muted-foreground hover:text-foreground transition-all duration-300"
              >
                <HelpCircle className="w-5 h-5 mr-3 text-blue-500 dark:text-blue-400" />
                <div>
                  <p className="text-sm font-medium">Help & Support</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Get help and contact support
                  </p>
                </div>
              </Button>
            </div>
          </div>

          <Separator className="bg-border" />

          {/* Sign Out */}
          <Button
            variant="ghost"
            className="w-full justify-start text-left p-3 h-auto text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-2xl transition-all duration-300"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <div>
              <p className="text-sm font-medium">Sign Out</p>
              <p className="text-xs opacity-70 mt-0.5">
                Sign out of your account
              </p>
            </div>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
