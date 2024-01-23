import React from "react";
import { BsClock } from "react-icons/bs";
import { MdClose } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import "./index.css";

function NotificationListItem({
  notifications,
  setNotifications,
  notificationTitle,
  data,
  index,
}) {
  const navigate = useNavigate();
  const handleRemoveNotification = (event, indexToRemove) => {
    event.stopPropagation();
    let newNotifications = notifications?.filter(
      (item, internalIndex) => internalIndex != indexToRemove
    );

    setNotifications(newNotifications);
  };

  return (
    <li
      className="Notification-list-item"
      onClick={() => {
        navigate(`/records/${data.record_id}`);
        //navigate(0);
      }}
    >
      <div>
        <BsClock />
      </div>
      <div>
        <h5>{notificationTitle}</h5>
        <div className="Notification-list-item-body">
          <p>
            {new Date(data.expiration_date).toLocaleDateString("es-Es", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
          <p>{data.file_type}</p>
          <p>{data.customer_name}</p>
        </div>
      </div>
      <div style={{ marginLeft: 15 }}>
        <MdClose
          size={18}
          color="#b25353"
          onClick={(e) => handleRemoveNotification(e, index)}
        />
      </div>
    </li>
  );
}

export { NotificationListItem };
