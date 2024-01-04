import React from "react";
import "./index.css";

function NotificationList(props) {
  return (
    <div className="Notification-list-wrapper">
      <ul>{props.children}</ul>
    </div>
  );
}

export { NotificationList };
