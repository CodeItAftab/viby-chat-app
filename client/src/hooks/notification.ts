import { NotificationContext } from "@/context/notification";
import { useContext } from "react";

export const useNotification = () => {
  const notification = useContext(NotificationContext);
  if (!notification) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return notification;
};
