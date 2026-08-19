import { ArrowLeft, Bell, LogOut, Moon, Sun, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/auth";
import { useNotification } from "@/hooks/notification";
import { useTheme } from "@/hooks/use-theme";

export default function Settings() {
  const navigate = useNavigate();
  const { Logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const {
    isNotiificationEnabled,
    RequestNotificationPermission,
    DisableNotification,
  } = useNotification();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    setNotificationsEnabled(isNotiificationEnabled());
  }, [isNotiificationEnabled]);

  const handleNotificationsChange = async (enabled: boolean) => {
    if (enabled) {
      await RequestNotificationPermission();
    } else {
      DisableNotification();
    }
    setNotificationsEnabled(isNotiificationEnabled());
  };

  const handleLogout = () => {
    Logout();
    navigate("/auth/login", { replace: true });
  };

  return (
    <main className="min-w-0 flex-1 overflow-y-auto bg-background p-4 pb-24 sm:p-6 sm:pb-24 lg:p-10 lg:pb-10">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-start gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            title="Go back"
            aria-label="Go back"
            className="mt-0.5 shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              Settings
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your account and app preferences.
            </p>
          </div>
        </div>

        <Card className="border-border/60 bg-card/80 shadow-xl shadow-primary/5">
          <CardHeader>
            <CardTitle className="text-lg">Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="ghost"
              onClick={() => navigate("/profile")}
              className="h-auto w-full justify-start gap-3 p-3 text-left"
            >
              <UserRound className="h-5 w-5 text-primary" />
              <span>
                <span className="block font-medium">Profile details</span>
                <span className="block text-xs text-muted-foreground">
                  View your name, username, email, and bio
                </span>
              </span>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/80 shadow-xl shadow-primary/5">
          <CardHeader>
            <CardTitle className="text-lg">Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="flex items-center justify-between gap-4 rounded-xl p-3">
              <div className="flex items-center gap-3">
                {theme === "dark" ? (
                  <Moon className="h-5 w-5 text-primary" />
                ) : (
                  <Sun className="h-5 w-5 text-primary" />
                )}
                <span>
                  <span className="block font-medium">Dark theme</span>
                  <span className="block text-xs text-muted-foreground">
                    Use a darker color scheme
                  </span>
                </span>
              </div>
              <Switch
                checked={theme === "dark"}
                onCheckedChange={(checked) =>
                  setTheme(checked ? "dark" : "light")
                }
                aria-label="Toggle dark theme"
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between gap-4 rounded-xl p-3">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-primary" />
                <span>
                  <span className="block font-medium">Notifications</span>
                  <span className="block text-xs text-muted-foreground">
                    Receive browser notifications
                  </span>
                </span>
              </div>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={handleNotificationsChange}
                aria-label="Toggle notifications"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive/30 bg-card/80">
          <CardContent className="p-4">
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="h-auto w-full justify-start gap-3 p-3 text-left text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="h-5 w-5" />
              <span>
                <span className="block font-medium">Log out</span>
                <span className="block text-xs opacity-75">
                  Sign out of this account
                </span>
              </span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
