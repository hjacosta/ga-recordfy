import React from "react";
import "./index.css";
import { FiMenu, FiChevronLeft, FiBell } from "react-icons/fi";
import { AiOutlineUser } from "react-icons/ai";
import { SidebarContext } from "../../contexts/SidebarCtx";

function TopNavbar() {
  const iconSize = 20;
  const { isVisible, setIsVisible } = React.useContext(SidebarContext);

  return (
    <div className="topnav">
      <div className="topnav-toogle-container">
        {isVisible ? (
          <FiChevronLeft
            className="topnav-toggle-icon"
            size={iconSize}
            onClick={() => {
              setIsVisible((state) => !state);
            }}
          />
        ) : (
          <FiMenu
            className="topnav-toggle-icon"
            size={iconSize}
            onClick={() => {
              setIsVisible((state) => !state);
            }}
          />
        )}
      </div>
      <div className="topnav-actions">
        <div className="topnav-actions-alert-counter">40</div>
        <FiBell
          className="topnav-toggle-icon  topnav-actions-alert"
          size={22}
        />
        <div className="topnav-actions-menu">
          <AiOutlineUser
            className="topnav-togle-icon topnav-actions-user"
            size={22}
          />
          <ul id="list">
            <li>Account</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export { TopNavbar };
