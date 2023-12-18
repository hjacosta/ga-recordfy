import React from "react";
import "./index.css";
import { FiMenu, FiChevronLeft, FiBell } from "react-icons/fi";
import { AiOutlineUser } from "react-icons/ai";
import { SidebarContext } from "../../contexts/SidebarCtx";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function TopNavbar() {
  const iconSize = 20;
  const navigate = useNavigate();
  const { isVisible, setIsVisible } = React.useContext(SidebarContext);
  const { logout } = React.useContext(AuthContext);

  /*-------------------------------------------------------*/
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

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
        <div className="topnav-actions-alert-counter">40</div>
        <FiBell
          color="#d39610"
          className="topnav-toggle-icon  topnav-actions-alert"
          size={22}
        />
        <div className="topnav-actions-menu">
          <AiOutlineUser
            color="var(--dark-blue)"
            className="topnav-togle-icon topnav-actions-user"
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
            Logout
          </Typography>
        </Popover>
      </div>
    </div>
  );
}

export { TopNavbar };
