let appStatusColors = {
  colors: {
    empty: {
      background: "#fafafa",
      shadow: "#778899",
    },
    danger: {
      background: "var(--error)",
      shadow: "#ff6d4e",
    },
    warning: {
      background: "var(--warning)",
      shadow: "#febf34",
    },
    success: {
      background: "var(--success)",
      shadow: "#7bd283",
    },
  },
};

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

function getRiskLevelTag(riskLevel) {
  let tag = {};
  switch (riskLevel) {
    case "HIGH":
      tag.color = appStatusColors.colors.danger.background;
      tag.label = "ALTO";
      break;
    case "MEDIUM":
      tag.color = appStatusColors.colors.warning.background;
      tag.label = "MEDIO";
      break;
    case "LOW":
      tag.color = appStatusColors.colors.success.background;
      tag.label = "BAJO";
      break;
    default:
      tag.color = "grey";
      break;
  }

  return tag;
}

function getStatusColor(status) {
  let statusColors = {
    backgroundColor: "",
    boxShadow: "0 0 10px ",
  };

  switch (status) {
    case "empty":
      statusColors.backgroundColor = appStatusColors.colors.empty.background;
      statusColors.boxShadow += appStatusColors.colors.empty.shadow;
      break;
    case "uncompleted":
      statusColors.backgroundColor = appStatusColors.colors.danger.background;
      statusColors.boxShadow += appStatusColors.colors.danger.shadow;
      break;
    case "inprogress":
      statusColors.backgroundColor = appStatusColors.colors.warning.background;
      statusColors.boxShadow += appStatusColors.colors.warning.shadow;
      break;
    case "completed":
      statusColors.backgroundColor = appStatusColors.colors.success.background;
      statusColors.boxShadow += appStatusColors.colors.success.shadow;
      break;
    default:
      break;
  }

  return statusColors;
}

export { setStatusFromFileNumber, getStatusColor, getRiskLevelTag };
