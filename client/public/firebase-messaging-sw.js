importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyCDcieVMZwjEhPKYPYwMkNNgW2qpi0LflU",
  authDomain: "notification-495f5.firebaseapp.com",
  projectId: "notification-495f5",
  storageBucket: "notification-495f5.firebasestorage.app",
  messagingSenderId: "629777589006",
  appId: "1:629777589006:web:a9e02dc2d4af3096dced5f",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );

  const { title, body, icon, avatar, click_action, type, tag, image } =
    payload.data;

  // Ensure we have a valid tag for renotify
  const notificationTag = tag || type || "default-notification";

  let notificationOptions = {
    body: body,
    icon: icon || avatar || "./icon.svg",
    badge: icon || "./icon.svg",
    vibrate: [100, 50, 100],
    renotify: true,
    tag: notificationTag,
    data: {
      click_action: click_action || "http://localhost:5173",
      type: type || "default",
      tag: notificationTag,
    },
  };

  // If the payload contains an image, add it to the notification options
  if (image) {
    notificationOptions.image = image;
  }

  switch (type) {
    case "friend_request":
      notificationOptions.actions = [
        { action: "open_requests", title: "View" },
        { action: "dismiss", title: "Dismiss" },
      ];
      break;
    case "friend_request_accepted":
      notificationOptions.actions = [
        { action: "open_friends", title: "See Friends" },
        { action: "dismiss", title: "Dismiss" },
      ];
      break;
    case "new_message":
      notificationOptions.actions = [
        { action: "open_chat", title: "Open Chat" },
        { action: "dismiss", title: "Dismiss" },
      ];
      break;
    default:
      break;
  }

  self.registration.showNotification(
    title || "Vib Notification",
    notificationOptions
  );
});

self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked:", event);

  if (event.action === "dismiss") {
    event.notification.close();
    return;
  }

  event.notification.close();

  // Handle different actions
  let targetUrl;
  switch (event.action) {
    case "open_requests":
      targetUrl = "http://localhost:5173/requests";
      break;
    case "open_friends":
      targetUrl = "http://localhost:5173/friends";
      break;
    case "open_chat":
      targetUrl = event.notification.data.click_action;
      break;
    default:
      targetUrl =
        event.notification.data.click_action || "http://localhost:5173";
      break;
  }

  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === targetUrl && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      })
  );
});
