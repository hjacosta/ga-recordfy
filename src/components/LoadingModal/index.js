import React from "react";
import { Puff } from "react-loader-spinner";
import { FiCheckCircle } from "react-icons/fi";

import "./index.css";

function LoadingModal(props) {
  return (
    <div className="loading-modal-bg">
      <div className="loading-modal-body">
        {!props.isLoading ? (
          <Puff
            {...props}
            radius={1}
            ariaLabel="puff-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        ) : (
          <FiCheckCircle color="green" size={40} />
        )}
      </div>
    </div>
  );
}

export { LoadingModal };
