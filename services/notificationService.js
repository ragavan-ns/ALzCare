import PushNotification from "react-native-push-notification";

export const configureNotifications = () => {
  PushNotification.configure({
    onNotification: function (notification) {
      console.log("NOTIFICATION:", notification);
    },
    requestPermissions: true,
  });

  createNotificationChannel();
};

export const createNotificationChannel = () => {
  PushNotification.createChannel(
    {
      channelId: "alzcare-reminders",
      channelName: "AlzCare Reminders",
      importance: 4,
      vibrate: true,
    },
    (created) => console.log(`Channel created: ${created}`)
  );
};

export const scheduleNotification = (title, message, date) => {
  PushNotification.localNotificationSchedule({
    channelId: "alzcare-reminders",
    title: title,
    message: message,
    date: date,
    allowWhileIdle: true,
  });
};
