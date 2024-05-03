import React from "react";
import NotifySound from "../assets/sounds/notification-sound.wav";

const NotificationContext = React.createContext({});
let notificationSound = new Audio(NotifySound);

// Connection opened
//ws://op.grupoavant.com.do:19705
//ws://172.16.0.212:3002
const socket = new WebSocket(`ws://op.grupoavant.com.do:19705`);
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
