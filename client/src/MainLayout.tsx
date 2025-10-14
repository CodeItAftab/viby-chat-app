import { Outlet } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { MobileBottomNav } from "./components/mobile-bottom-nav";
import { cn } from "./lib/utils";
import NotificationProvider from "./provider/NotificationProvider";

const MainLayout = () => {
  console.log("MainLayout rendered");
  return (
    <NotificationProvider>
      <div
        className={cn(
          "flex h-screen bg-background text-foreground overflow-hidden"
          // GeistSans.className
        )}
      >
        <Sidebar />

        <Outlet />
        <MobileBottomNav />
      </div>
    </NotificationProvider>
  );
};

export default MainLayout;
