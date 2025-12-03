import React from "react";
import { InventoryBase } from "../../../components/shared";

const Inventory = ({ 
  className = "", 
  onNavigateToSCV, 
  onNavigateToNuevoActivo,
  onNavigateToModificarActivo,
  ...props 
}) => {
  return (
    <InventoryBase
      role="usuario"
      className={className}
      onNavigateToSCV={onNavigateToSCV}
      onNavigateToNuevoActivo={onNavigateToNuevoActivo}
      onNavigateToModificarActivo={onNavigateToModificarActivo}
      showCreateButton={true}
      {...props}
    />
  );
};

export default Inventory;