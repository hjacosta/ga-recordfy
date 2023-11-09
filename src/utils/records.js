function setStatusFromFileNumber(fileNumber, fileLimit) {
  let completePercetage = parseInt(fileNumber) / parseInt(fileLimit);

  if (completePercetage == 0) {
    return "empty";
  }

  if (completePercetage < 0.5) {
    return "uncompleted";
  }

  if (completePercetage >= 0.5 && completePercetage <= 0.9) {
    return "inprogress";
  }

  if (completePercetage >= 1) {
    return "completed";
  }
}

function getStatusColor(status) {
  let statusColors = {
    backgroundColor: "",
    boxShadow: "0 0 10px ",
  };

  switch (status) {
    case "empty":
      statusColors.backgroundColor = "#fafafa";
      statusColors.boxShadow += "#778899";
      break;
    case "uncompleted":
      statusColors.backgroundColor = "var(--error)";
      statusColors.boxShadow += "#ff6d4e";
      break;
    case "inprogress":
      statusColors.backgroundColor = "var(--warning)";
      statusColors.boxShadow += "#febf34";
      break;
    case "completed":
      statusColors.backgroundColor = "var(--success)";
      statusColors.boxShadow += "#7bd283";
      break;
    default:
      break;
  }

  return statusColors;
}

export { setStatusFromFileNumber, getStatusColor };
