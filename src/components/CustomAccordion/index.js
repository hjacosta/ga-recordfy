import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { CustomDatatable } from "../CustomDatatable";
import { SearchBar } from "../SearchBar";
import { getCustomersApi, getCustomerTypeApi } from "../../api/customer";
import { CustomerCrud } from "../CustomerCrud";
import { CustomerTypeCrud } from "../CustomerTypeCrud";
import "./index.css";
import { TopBar } from "../TopBar";
import { FileTypeCrud } from "../FileTypeCrud";
import { SectionDivision } from "../SectionDivision";

function CustomAcordion() {
  return (
    <div className="CustomAcordion-container">
      <SectionDivision title={"Clientes"} />

      <Accordion className="CustomAcordion-section">
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className="CustomAcordion-section-title ">
            Clientes
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <CustomerCrud />
        </AccordionDetails>
      </Accordion>
      <Accordion className="CustomAcordion-section">
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className="CustomAcordion-section-title ">
            Tipos de clientes
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <CustomerTypeCrud />
        </AccordionDetails>
      </Accordion>
      <SectionDivision title={"Archivos"} />
      <Accordion className="CustomAcordion-section">
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className="CustomAcordion-section-title ">
            Tipos de archivos
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FileTypeCrud />
        </AccordionDetails>
      </Accordion>
      <Accordion className="CustomAcordion-section">
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className="CustomAcordion-section-title ">
            Archivos por tipos de socios
          </Typography>
        </AccordionSummary>
        <AccordionDetails></AccordionDetails>
      </Accordion>
    </div>
  );
}

export { CustomAcordion };
