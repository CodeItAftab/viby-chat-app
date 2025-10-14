import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import { POST } from "@/lib/axios";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const messaging = getMessaging(app);

const GenerateFCMToken = async () => {
  try {
    const token = await getToken(messaging, { vapidKey });
    return token;
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
};

const UpdateFCMTokenToServer = async (data: {
  token: string;
  browserId: string;
}) => {
  try {
    const res = (await POST("notification/update-fcm-token", data)) as {
      success: boolean;
    };
    if (res.success) {
      console.log("FCM token updated successfully");
    }
  } catch (error) {
    console.error("Error updating FCM token to server:", error);
  }
};

const RemoveFCMTokenFromServer = async (browserId: string) => {
  try {
    const res = (await POST("notification/remove-fcm-token", {
      browserId,
    })) as {
      success: boolean;
    };
    if (res.success) {
      console.log("FCM token removed successfully");
    }
  } catch (error) {
    console.error("Error removing FCM token from server:", error);
  }
};

export { GenerateFCMToken, UpdateFCMTokenToServer, RemoveFCMTokenFromServer };
