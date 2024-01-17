import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import "./index.css";

const style = {};

function CustomModal({ children, open, onClose }) {
  return (
    <div>
      <Modal
        style={{ margin: "0 16px" }}
        open={open}
        onClose={() => {
          onClose();
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="CustomModal">{children}</div>
      </Modal>
    </div>
  );
}

export { CustomModal };
