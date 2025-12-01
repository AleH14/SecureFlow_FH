"use client";
import React, { useState } from "react";
import { Header, Sidebar, GradientLayout } from "../../components/ui";
import { FaUserCircle } from "react-icons/fa";

import Inventory from "./inventory/Inventory";
import SCV from "./scv/SCV";
import Solicitudes from "./solicitudes/Solicitudes";
import Revision from "./revision/Revision"; // Componente para aprobar/rechazar
import RevisionVista from "./revision/RevisionVista"; // Componente para solo ver

const SeguridadPage = () => {
  const [activeTab, setActiveTab] = useState("panel-revision");
  const [showSCV, setShowSCV] = useState(false);
  const [selectedActivo, setSelectedActivo] = useState(null);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [showRevision, setShowRevision] = useState(false);
  const [showRevisionVista, setShowRevisionVista] = useState(false);

  // Tabs del Responsable de Seguridad
  const seguridadTabs = [
    {
      id: "panel-revision",
      name: "Panel de Revisión",
      iconName: "FaTasks",
      badgeCount: 1
    },
    {
      id: "inventario",
      name: "Inventario de Activos",
      iconName: "FaBoxes"
    }
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);

    if (tabId !== "inventario") {
      setShowSCV(false);
      setSelectedActivo(null);
    }

    if (tabId !== "panel-revision") {
      setSelectedSolicitud(null);
      setShowRevision(false);
      setShowRevisionVista(false);
    }
  };

  const handleNavigateToSCV = (activo) => {
    setSelectedActivo(activo);
    setShowSCV(true);
  };

  const handleNavigateBack = () => {
    setShowSCV(false);
    setSelectedActivo(null);
  };

  const handleNavigateToDetalles = (solicitud) => {
    setSelectedSolicitud(solicitud);
    
    // Si es "Pendiente", va a Revision (flujo de aprobación)
    // Si es "Aprobado" o "Rechazado", va a RevisionVista (solo vista)
    if (solicitud.estadoGeneral === "Pendiente") {
      setShowRevision(true);
      setShowRevisionVista(false);
    } else {
      setShowRevisionVista(true);
      setShowRevision(false);
    }
  };

  const handleNavigateBackFromRevision = () => {
    setShowRevision(false);
    setShowRevisionVista(false);
    setSelectedSolicitud(null);
  };

  const renderContent = () => {
    // Si estamos en vista de revisión (solo lectura para aprobadas/rechazadas)
    if (showRevisionVista && selectedSolicitud) {
      return (
        <div className="main-content">
          <RevisionVista 
            solicitud={selectedSolicitud}
            onNavigateBack={handleNavigateBackFromRevision}
          />
        </div>
      );
    }
    
    // Si estamos en flujo de revisión (para aprobar/rechazar pendientes)
    if (showRevision && selectedSolicitud) {
      return (
        <div className="main-content">
          <Revision 
            solicitud={selectedSolicitud}
            onNavigateBack={handleNavigateBackFromRevision}
          />
        </div>
      );
    }

    switch (activeTab) {
      case "inventario":
        return (
          <div className="main-content">
            {showSCV ? (
              <SCV
                onNavigateBack={handleNavigateBack}
                selectedActivo={selectedActivo}
              />
            ) : (
              <Inventory onNavigateToSCV={handleNavigateToSCV} />
            )}
          </div>
        );

      case "panel-revision":
        return (
          <div className="main-content">
            <Solicitudes
              onNavigateToDetalles={handleNavigateToDetalles}
            />
          </div>
        );

      default:
        return (
          <div className="main-content">
            <Inventory onNavigateToSCV={handleNavigateToSCV} />
          </div>
        );
    }
  };

  return (
    <GradientLayout>
      <Header
        showUser={true}
        userName="Responsable de Seguridad"
        userIcon={FaUserCircle}
      />

      <Sidebar
        tabs={seguridadTabs}
        defaultActiveTab="panel-revision"
        onTabChange={handleTabChange}
      />

      {renderContent()}
    </GradientLayout>
  );
};

export default SeguridadPage;