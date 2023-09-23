import React from "react";
import "./index.css";
import { SidebarContext } from "../../contexts/SidebarCtx";
import { useResize } from "../../hooks/useResize";
import {
  AiFillHome,
  AiFillFolder,
  AiFillFileText,
  AiFillSetting,
} from "react-icons/ai";
import logo from "../../assets/images/w-logo.png";
import logoNoTxt from "../../assets/images/logo-no-txt.png";
import { NavLink } from "react-router-dom";

function Sidebar() {
  const { isVisible, setIsVisible, sidebarWidth } =
    React.useContext(SidebarContext);
  const { width, height } = useResize();

  const sidebarItems = [
    {
      label: "Home",
      icon: <AiFillHome size={28} />,
      link: "/",
    },
    {
      label: "Expedientes",
      icon: <AiFillFolder size={28} />,
      link: "/records",
    },
    {
      label: "Reportes",
      icon: <AiFillFileText size={28} />,
      link: "/reports",
    },
    {
      label: "Configuración",
      icon: <AiFillSetting size={28} />,
      link: "/settings",
    },
  ];

  return (
    <div
      style={layoutCSS(width, isVisible, sidebarWidth)}
      className={"sidebar"}
    >
      <div className="sidebar-content">
        <div className="sidebar-header">
          {/* <img
            className={isVisible ? "sidebar-logo" : "sidebar-logo-no-txt"}
            src={isVisible ? logo : logoNoTxt}
            alt="logo"
          /> */}
        </div>
        <div className="sidebar-body">
          <ul className="sidebar-body-list">
            {sidebarItems.map((sbItem, index) => (
              <SidebarItem
                key={index}
                label={sbItem.label}
                icon={sbItem.icon}
                link={sbItem.link}
                isVisible={isVisible}
              />
            ))}
          </ul>
        </div>
        <div
          className="sidebar-footer"
          style={{ left: isVisible ? "50px" : "10px" }}
        >
          {isVisible ? (
            <span>Deveoped By Grupo Avant V-1.0.0</span>
          ) : (
            <span>{width > 768 && "GA V-1.0.0"}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export { Sidebar };

function layoutCSS(scWidth, isVisible, sbWidth) {
  let styles = {};

  if (scWidth > 768) {
    styles = { width: isVisible ? sbWidth : "70px" };
  } else {
    styles = {
      width: isVisible ? sbWidth : "0",
      // padding: isVisible ? "20px" : "0",
    };
  }

  return styles;
}

function SidebarItem(props) {
  return (
    <li>
      <NavLink className="sidebar-body-list-item" to={props.link}>
        <div className="sidebar-body-list-item-icon">{props.icon}</div>
        {props.isVisible && <span>{props.label}</span>}
      </NavLink>
    </li>
  );
}
