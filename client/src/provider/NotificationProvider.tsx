import { NotificationPermissionDialog } from "@/components/notification-permission-dialog";
import { NotificationContext } from "@/context/notification";
import {
  GenerateFCMToken,
  RemoveFCMTokenFromServer,
  UpdateFCMTokenToServer,
} from "@/lib/firebase";
import React, { useEffect } from "react";
import { useCallback } from "react";

const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = React.useState(false);

  const ShouldAskForNotificationPermission = useCallback(() => {
    const lastPromptedTime = localStorage.getItem("notificationPromptedTime");

    const permissionn = Notification.permission;

    if (permissionn === "granted") return false;

    if (!lastPromptedTime) return true;

    const lastDate = new Date(lastPromptedTime);

    const now = new Date();

    const diffInMiliseconds = now.getTime() - lastDate.getTime();

    const diffInDays = diffInMiliseconds / (1000 * 60 * 60 * 24);

    return diffInDays >= 7; // Prompt again after 7 days
  }, []);

  const ShouldGenerateNewFCMToken = useCallback(() => {
    const lastTokenGenerationTime = localStorage.getItem(
      "fcmTokenGenerationTime"
    );
    if (!lastTokenGenerationTime) return true;
    const lastDate = new Date(lastTokenGenerationTime);
    const now = new Date();
    const diffInMiliseconds = now.getTime() - lastDate.getTime();
    const diffInDays = diffInMiliseconds / (1000 * 60 * 60 * 24);
    return diffInDays >= 30; // Generate new token after 30 days
  }, []);

  const UpdateFCMToken = useCallback(async () => {
    if (Notification.permission !== "granted") return;

    if (localStorage.getItem("isNotificationDisabled") === "true") {
      return;
    }

    let browserId = localStorage.getItem("browserId");
    if (!browserId) {
      browserId = crypto.randomUUID();
      localStorage.setItem("browserId", browserId);
    }

    if (Notification.permission === "granted" && !ShouldGenerateNewFCMToken())
      return;

    const fcm_token = await GenerateFCMToken();

    if (!fcm_token) {
      console.error("Failed to generate FCM token");
      return;
    }

    await UpdateFCMTokenToServer({
      token: fcm_token,
      browserId: browserId,
    });

    localStorage.setItem("fcmTokenGenerationTime", new Date().toISOString());
    return;
  }, [ShouldGenerateNewFCMToken]);

  const RequestNotificationPermission = useCallback(async () => {
    const isNotificationDisabled = localStorage.getItem(
      "isNotificationDisabled"
    );

    if (
      !ShouldAskForNotificationPermission() &&
      isNotificationDisabled !== "true"
    )
      return;

    localStorage.setItem("isNotificationDisabled", "false");

    const permission = Notification.permission;

    if (permission === "granted") {
      setOpen(false);
      UpdateFCMToken();
      return;
    } else if (permission === "default") {
      const new_permission = await Notification.requestPermission();
      if (new_permission === "granted") {
        setOpen(false);
        UpdateFCMToken();
      } else {
        console.log("❌Permission denied");
        setOpen(false);
      }
    } else if (permission === "denied") {
      console.log("❌Permission denied");
      alert(
        "Please enable notifications in your browser settings to receive updates."
      );
      setOpen(false);
    }
  }, [ShouldAskForNotificationPermission, UpdateFCMToken]);

  useEffect(() => {
    console.log("NotificationProvider mounted");
    if (ShouldAskForNotificationPermission()) {
      setOpen(true);
    }
  }, [ShouldAskForNotificationPermission]);

  useEffect(() => {
    UpdateFCMToken();
  }, [UpdateFCMToken]);

  console.log("notification dialog open:", open);

  const isNotiificationEnabled = () => {
    const permission = Notification.permission;
    if (permission === "denied" || permission === "default") {
      return false;
    }

    const browserId = localStorage.getItem("browserId");
    const fcmTokenGenerationTime = localStorage.getItem(
      "fcmTokenGenerationTime"
    );

    if (!browserId || !fcmTokenGenerationTime) {
      return false;
    }
    return true;
  };

  const DisableNotification = useCallback(() => {
    const browserId = localStorage.getItem("browserId");
    if (browserId) {
      // revoke the FCM token from the server
      RemoveFCMTokenFromServer(browserId);
    }
    localStorage.removeItem("fcmTokenGenerationTime");
    localStorage.removeItem("notificationPromptedTime");
    localStorage.removeItem("browserId");
    localStorage.setItem("isNotificationDisabled", "true");
    localStorage.setItem("notificationPromptedTime", new Date().toISOString());
    setOpen(false);
  }, []);

  const showNotificationPermissionDialog = () => {
    if (Notification.permission === "granted") return;
    setOpen(true);
  };

  return (
    <NotificationContext.Provider
      value={{
        RequestNotificationPermission,
        open,
        setOpen,
        isNotiificationEnabled,
        DisableNotification,
        showNotificationPermissionDialog,
      }}
    >
      {children}
      <NotificationPermissionDialog
        open={open}
        onAllowPermission={RequestNotificationPermission}
        onDenyPermission={() => {
          setOpen(false);
          DisableNotification();
        }}
      />
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
