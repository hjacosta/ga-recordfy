import * as React from "react";
import Modal from "@mui/material/Modal";
import { FaFireFlameCurved } from "react-icons/fa6";
import "./index.css";

function WelcomeModal({ isOpen, setIsOpen, confirmFunction }) {
  return (
    <div>
      <Modal
        style={{ margin: "0 16px" }}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
          className="WelcomeModal"
        >
          <div className="WelcomeModal-header">
            <FaFireFlameCurved size={28} color={"#e34e2b"} />
            <FaFireFlameCurved
              style={{ position: "absolute" }}
              size={24}
              color={"#fed334"}
            />
            <h3>Bienvenido!</h3>
          </div>
          <div className="WelcomeModal-body">
            <p>
              Tu cuenta ya está casi lista. Vefica tu buzón de correo
              electrónico y completa el registro de tu cuenta.
            </p>
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              alignSelf: "flex-end",
              justifyContent: "center",
            }}
          >
            <p
              className="choice-item choice-item--no"
              onClick={() => {
                setIsOpen(false);
                confirmFunction();
              }}
            >
              Entendido
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export { WelcomeModal };
