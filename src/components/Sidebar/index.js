import React from "react";
import "./index.css";
import { SidebarContext } from "../../contexts/SidebarCtx";
import { useResize } from "../../hooks/useResize";
import {
  AiFillHome,
  AiFillFolder,
  AiFillFileText,
  AiFillSetting,
  AiOutlinePartition,
} from "react-icons/ai";
import { RiMindMap } from "react-icons/ri";
import { LuLayoutDashboard } from "react-icons/lu";
import logo from "../../assets/images/w-logo.png";
import logoNoTxt from "../../assets/images/logo-no-txt.png";
import { NavLink } from "react-router-dom";

function Sidebar() {
  const { isVisible, setIsVisible, sidebarWidth } =
    React.useContext(SidebarContext);
  const { width, height } = useResize();
  const iconSize = 25;

  const [sidebarItems, setSidebarItems] = React.useState([
    {
      label: "Dashboard",
      icon: <LuLayoutDashboard size={iconSize} />,
      link: "/",
      active: true,
    },
    // {
    //   label: "Grupos",
    //   icon: <AiOutlinePartition size={iconSize} />,
    //   link: "/record-groups",
    //   active: false,
    // },
    {
      label: "Expedientes",
      icon: <AiFillFolder size={iconSize} />,
      link: "/records",
      active: false,
    },
    {
      label: "Reportes",
      icon: <AiFillFileText size={iconSize} />,
      link: "/reports",
      active: false,
    },
    {
      label: "Configuración",
      icon: <AiFillSetting size={iconSize} />,
      link: "/settings",
      active: false,
    },
  ]);

  const selectItem = (label) => {
    let options = [...sidebarItems];

    options.forEach((sidebarItem) => {
      if (sidebarItem.label === label) {
        sidebarItem.active = true;
      } else {
        sidebarItem.active = false;
      }
    });
    setSidebarItems(options);
  };

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
                item={sbItem}
                active={sbItem.active}
                label={sbItem.label}
                icon={sbItem.icon}
                link={sbItem.link}
                isVisible={isVisible}
                selectItem={selectItem}
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
    styles = { width: isVisible ? sbWidth : "60px" };
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
    <li className={`${props.active == true && "active"}`}>
      <b></b>
      <NavLink
        onClick={(e) => {
          props.selectItem(props.item.label);
        }}
        className={`sidebar-body-list-item `}
        to={props.link}
      >
        <div className="sidebar-body-list-item-icon">{props.icon}</div>
        {props.isVisible && <span>{props.label}</span>}
      </NavLink>
      <b></b>
    </li>
  );
}
