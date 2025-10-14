import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bell, BellOff } from "lucide-react";

interface NotificationPermissionDialogProps {
  open: boolean;
  onAllowPermission: () => void;
  onDenyPermission: () => void;
  isLoading?: boolean;
}

export function NotificationPermissionDialog({
  open,
  onAllowPermission,
  onDenyPermission,
  isLoading = false,
}: NotificationPermissionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-[360px] w-[85vw] max-w-[320px] p-0 bg-white border-0 shadow-xl rounded-xl overflow-hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50/30">
          <div className="px-5 py-6 sm:px-6 sm:py-7">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                  <Bell className="w-8 h-8 text-white" />
                </div>
              </div>

              <div className="space-y-2 max-w-xs">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                  Enable Notifications
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Stay updated with important alerts and new features.
                </p>
              </div>

              <div className="w-full space-y-2 pt-1">
                <Button
                  onClick={onAllowPermission}
                  disabled={isLoading}
                  className="w-full h-10 sm:h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium text-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Requesting...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4" />
                      <span>Allow</span>
                    </div>
                  )}
                </Button>

                <Button
                  onClick={onDenyPermission}
                  variant="ghost"
                  className="w-full h-10 sm:h-11 text-gray-600 hover:text-gray-800 hover:bg-gray-100/80 font-medium text-sm rounded-lg transition-all duration-200"
                  disabled={isLoading}
                >
                  <div className="flex items-center gap-2">
                    <BellOff className="w-4 h-4" />
                    <span>Not now</span>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
