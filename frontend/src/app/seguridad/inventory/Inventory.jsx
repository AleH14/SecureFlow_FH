import React from "react";
import { InventoryBase } from "../../../components/shared";

const Inventory = ({ className = "", onNavigateToSCV, ...props }) => {
    return (
        <InventoryBase
            role="responsable_seguridad"
            className={className}
            onNavigateToSCV={onNavigateToSCV}
            {...props}
        />
    );
};

export default Inventory;