import React from "react";
import { SCVBase } from "../../../components/shared";

const SCV = ({ onNavigateBack, selectedActivo }) => {
  return (
    <SCVBase 
      onNavigateBack={onNavigateBack}
      selectedActivo={selectedActivo}
      userRole="security"
      showActions={false}
    />
  );
}

export default SCV;