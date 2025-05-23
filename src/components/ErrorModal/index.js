import * as React from "react";
import Modal from "@mui/material/Modal";
import { TiWarning } from "react-icons/ti";
import "./index.css";

function ErrorModal({ isOpen, errorBody, onClose }) {
  return (
    <div>
      <Modal
        style={{ margin: "0 16px" }}
        open={isOpen}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
          className="ErrorModal"
        >
          <div className="ErrorModal-header">
            <TiWarning size={24} color={"darkred"} />
            <h3>Error</h3>
          </div>
          <div className="ErrorModal-body">{errorBody} </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              alignSelf: "flex-end",
              justifyContent: "space-between",
            }}
          >
            <p
              className="choice-item choice-item--yes"
              onClick={async () => {}}
            ></p>
            <p
              className="choice-item choice-item--no"
              onClick={() => {
                onClose();
              }}
            >
              Ok
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export { ErrorModal };
