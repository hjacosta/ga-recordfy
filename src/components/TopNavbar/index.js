import React from "react";
import "./index.css";
import { FiMenu, FiChevronLeft, FiBell } from "react-icons/fi";
import { AiOutlineUser } from "react-icons/ai";
import { SidebarContext } from "../../contexts/SidebarCtx";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { NotificationContext } from "../../contexts/NotificationContext";
import { NotificationList } from "../NotificationList";
import { NotificationListItem } from "../NotificationListItem";
import { IoIosNotificationsOutline } from "react-icons/io";

function TopNavbar() {
  const iconSize = 20;
  const navigate = useNavigate();
  const { isVisible, setIsVisible } = React.useContext(SidebarContext);
  const { logout } = React.useContext(AuthContext);

  const { notifications, setNotifications } =
    React.useContext(NotificationContext);

  /*-------------------------------------------------------*/
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notifyAnchorEl, setNotifyAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotifyClick = (event) => {
    setNotifyAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotifyClose = () => {
    setNotifyAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const openNotify = Boolean(notifyAnchorEl);
  const id = open ? "simple-popover" : undefined;
  const notificationId = open ? "notify-popover" : undefined;

  /*-------------------------------------------------------*/

  return (
    <div className="topnav">
      <div className="topnav-toogle-container">
        {isVisible ? (
          <FiChevronLeft
            color="var(--dark-blue)"
            className="topnav-toggle-icon"
            size={iconSize}
            onClick={() => {
              setIsVisible((state) => !state);
            }}
          />
        ) : (
          <FiMenu
            color="var(--dark-blue)"
            className="topnav-toggle-icon"
            size={iconSize}
            onClick={() => {
              setIsVisible((state) => !state);
            }}
          />
        )}
      </div>
      <div className="topnav-actions">
        <div
          className={`topnav-actions-alert-counter ${
            notifications.length > 0 ? "visible" : ""
          }`}
        >
          {notifications?.length}
        </div>
        <FiBell
          color="#d39610"
          className={`topnav-toggle-icon  topnav-actions-alert `}
          size={22}
          onClick={handleNotifyClick}
        />
        <Popover
          id={notificationId}
          open={openNotify}
          anchorEl={notifyAnchorEl}
          onClose={handleNotifyClose}
          className="topnav-notify-wrapper"
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <div className="TopNavbar-notify-header">
            <div style={{ display: "flex", alignItems: "center" }}>
              <IoIosNotificationsOutline size={24} color="#d39610" />
              <p>NOTIFICACIONES ({notifications.length})</p>
            </div>
            <span
              className="TopNavbar-notify-header-clear"
              onClick={() => {
                setNotifications([]);
              }}
            >
              Borrar Todo
            </span>
          </div>
          <NotificationList>
            {notifications.length == 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <p>No hay nuevas notificacines</p>
              </div>
            )}
            {notifications.map((notification, index) => (
              <NotificationListItem
                notifications={notifications}
                setNotifications={setNotifications}
                key={index}
                index={index}
                notificationTitle="Documento ha expirado"
                data={notification}
              />
            ))}
          </NotificationList>
        </Popover>
        <div className="topnav-actions-menu">
          <AiOutlineUser
            color="var(--dark-blue)"
            className="topnav-toggle-icon topnav-actions-user"
            size={22}
            onClick={handleClick}
          />
          <ul id="list">
            <li>Account</li>
          </ul>
        </div>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          {/*<Typography
            className="topnav-actions-menu-item"
            onClick={() => {
              logout();
              navigate("/");
            }}
            sx={{ p: 2 }}
          >
            Logout
          </Typography>*/}
          <Typography
            className="topnav-actions-menu-item"
            onClick={() => {
              logout();
              navigate("/");
            }}
            sx={{ p: 2 }}
          >
            Cerrar Sesión
          </Typography>
        </Popover>
      </div>
    </div>
  );
}

export { TopNavbar };
