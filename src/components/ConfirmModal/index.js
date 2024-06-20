import * as React from "react";
import Modal from "@mui/material/Modal";
import { TiWarning } from "react-icons/ti";
import "./index.css";

function ConfirmModal({
  isOpen,
  setIsOpen,
  confirmFunction,
  modalType,
  deleteParams,
  modalMessage,
  elementLabel,
}) {
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
          className="ConfirmModal"
        >
          <div className="ConfirmModal-header">
            <TiWarning size={24} color={"#2e5e6c"} />
            <h3>Advertencia</h3>
          </div>
          <div className="ConfirmModal-body">
            <p>
              {modalType == "FORM" && !modalMessage
                ? `¿Está seguro que desea descartar este formulario? Perderá toda la
              información ya digitada en el mismo.`
                : modalType == "FORM" && modalMessage}
              {modalType == "DELETE" && !modalMessage
                ? `¿Está seguro que desea eliminar este ${
                    elementLabel || "elemento"
                  }? Esta operación es irreversible.`
                : modalType == "DELETE" && modalMessage}
            </p>
          </div>
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
              onClick={async () => {
                setIsOpen(false);
                switch (modalType) {
                  case "FORM":
                    confirmFunction(true);
                    break;
                  case "DELETE":
                    await confirmFunction(true, deleteParams);
                    break;

                  default:
                    break;
                }
              }}
            >
              {modalType == "FORM" ? "Si, Descartar" : "Si"}
            </p>
            <p
              className="choice-item choice-item--no"
              onClick={() => {
                setIsOpen(false);
              }}
            >
              {modalType == "FORM" ? "Continuar editando" : "Cancelar"}
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export { ConfirmModal };
