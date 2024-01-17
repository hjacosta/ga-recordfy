import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {
  HiMiniEllipsisHorizontal,
  HiPencil,
  HiEye,
  HiTrash,
} from "react-icons/hi2";
import "./index.css";

function DTOptionsMenu(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const editElement = () => {
    props.setCurrentItem(props.row);
    props.setFormVisible(true);
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <HiMiniEllipsisHorizontal />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem
          className="MenuItem"
          onClick={() => {
            editElement();
            handleClose();
          }}
        >
          <HiPencil />
          &nbsp; <p>Editar</p>
        </MenuItem>
        <MenuItem className="MenuItem" onClick={handleClose}>
          <HiEye />
          &nbsp;<p>Ver</p>
        </MenuItem>
        <MenuItem className="MenuItem" disabled onClick={handleClose}>
          <HiTrash />
          &nbsp; <p>Eliminar</p>
        </MenuItem>
      </Menu>
    </div>
  );
}

export { DTOptionsMenu };
