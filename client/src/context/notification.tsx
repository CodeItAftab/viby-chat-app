import { createContext } from "react";

type NotificationContextType = {
  RequestNotificationPermission: () => Promise<void>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isNotiificationEnabled: () => boolean;
  DisableNotification: () => void;
  showNotificationPermissionDialog: () => void;
};

export const NotificationContext =
  createContext<NotificationContextType | null>(null);
