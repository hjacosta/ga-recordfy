/**
 * This functions is used to manage all the labels in dataTables and UI Components
 * @param {string} label
 */

function getLabelName(label) {
  let labelName = "";
  switch (label) {
    case "PHYSICAL_PERSON":
      labelName = "Persona Física";
      break;
    case "LEGAL_PERSON":
      labelName = "Persona Jurídica";
      break;
    default:
      break;
  }

  return labelName;
}

export default getLabelName;
