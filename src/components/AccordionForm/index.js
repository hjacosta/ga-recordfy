import React from "react";
import "./index.css";

function AccordionForm({ isVisible, form, customStyles }) {
  return (
    <div className="AccordionForm-container">
      <div
        className={
          isVisible
            ? "AccordionForm-content-container--open"
            : "AccordionForm-content-container"
        }
      >
        <div>{form}</div>
      </div>
    </div>
  );
}

export { AccordionForm };
