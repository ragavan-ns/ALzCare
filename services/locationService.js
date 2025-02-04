import BackgroundTimer from "react-native-background-timer";
import Geolocation from "react-native-geolocation-service";

const API_URL = "http://localhost:3000";

export const startLocationUpdates = (userId) => {
  BackgroundTimer.runBackgroundTimer(() => {
    Geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        await fetch(`${API_URL}/update-location`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, latitude, longitude }),
        });
      },
      (error) => console.error(error),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }, 1800000); // 30 minutes in milliseconds
};
