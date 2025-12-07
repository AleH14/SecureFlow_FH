import React from "react";
import { SCVBase } from "../../../components/shared";

const SCV = ({ onNavigateBack, selectedActivo }) => {
  return (
    <SCVBase 
      onNavigateBack={onNavigateBack}
      selectedActivo={selectedActivo}
      userRole="admin"
      showActions={false}
    />
  );
}

export default SCV;