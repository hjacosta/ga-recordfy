import { NotificationManager } from "react-notifications";

function createNotification(type, msg) {
  console.log(type, msg);
  return () => {
    switch (type) {
      case "info":
        NotificationManager.info("Info message");
        break;
      case "success":
        NotificationManager.success("Success message", "Title here");
        break;
      case "warning":
        NotificationManager.warning(
          "Warning message",
          "Close after 3000ms",
          3000
        );
        break;
      case "error":
        // NotificationManager.error("Error message", "Click me!", 5000, () => {
        //   alert("callback");
        // });

        NotificationManager.error("Error message", `${msg}`);
        break;
    }
  };
}

export { createNotification };
