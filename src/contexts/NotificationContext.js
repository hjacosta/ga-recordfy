import React from "react";
import NotifySound from "../assets/sounds/notification-sound.wav";

const NotificationContext = React.createContext({});
let notificationSound = new Audio(NotifySound);

// Connection opened
const socket = new WebSocket("ws://10.1.102.31:3002");
socket.addEventListener("open", (event) => {
  socket.send("Connection established");
});

function NotificationProvider({ children }) {
  const [notifications, setNotifications] = React.useState([]);

  // Listen for messages
  socket.addEventListener("message", (event) => {
    setNotifications([...JSON.parse(event.data), ...notifications]);
    if (Object.entries(JSON.parse(event.data)).length > 0) {
      //notificationSound.play();
    }
    //
    // console.log(JSON.parse(event.data)[0]);
  });

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        setNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export { NotificationProvider, NotificationContext };
