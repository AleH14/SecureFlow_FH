"use client";
import React, { useState } from "react";
import { Header, Sidebar, GradientLayout } from "../../components/ui";
import Inventory from "./inventory/Inventory";
import SCV from "./scv/SCV";
import NuevoActivo from "./activo/NuevoActivo";
import ModificarActivo from "./activo/ModificarActivo";
import Solicitudes from "./solicitudes/Solicitudes";
import SolicitudDetalles from "./solicitudes/SolicitudDetalles";

const UsuarioPage = () => {
  const [activeTab, setActiveTab] = useState("mis-activos");
  const [showSCV, setShowSCV] = useState(false);
  const [selectedActivo, setSelectedActivo] = useState(null);
  const [showNuevoActivo, setShowNuevoActivo] = useState(false);
  const [showModificarActivo, setShowModificarActivo] = useState(false);
  const [showSolicitudDetalles, setShowSolicitudDetalles] = useState(false);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);

  const usuarioTabs = [
    {
      id: "mis-activos",
      name: "Mis Activos",
      iconName: "FaBoxes",
    },
    {
      id: "mis-solicitudes",
      name: "Mis Solicitudes",
      iconName: "FaFileAlt",
      badgeCount: 3,
    },
  ];

  const handleTabChange = (tabId) => {
    console.log("🔀 Cambiando tab a:", tabId, "showSolicitudDetalles:", showSolicitudDetalles);

    if (showSolicitudDetalles && tabId !== "mis-solicitudes") {
      setShowSolicitudDetalles(false);
      setSelectedSolicitud(null);
    }

    setActiveTab(tabId);

    if (tabId !== "mis-activos" && !showSolicitudDetalles) {
      setShowSCV(false);
      setSelectedActivo(null);
      setShowNuevoActivo(false);
      setShowModificarActivo(false);
    }
  };

  const handleNavigateToSCV = (activo) => {
    setSelectedActivo(activo);
    setShowSCV(true);
    setShowNuevoActivo(false);
    setShowModificarActivo(false);
    setShowSolicitudDetalles(false);
  };

  const handleNavigateBack = () => {
    setShowSCV(false);
    setSelectedActivo(null);
    setShowNuevoActivo(false);
    setShowModificarActivo(false);
    setShowSolicitudDetalles(false);
  };

  const handleNavigateToNuevoActivo = () => {
    setShowNuevoActivo(true);
    setShowSCV(false);
    setSelectedActivo(null);
    setShowModificarActivo(false);
    setShowSolicitudDetalles(false);
  };

  const handleNavigateBackFromNuevoActivo = () => {
    setShowNuevoActivo(false);
  };

  const handleNavigateToModificarActivo = (activo) => {
    console.log("🔄 Navegando a ModificarActivo desde solicitud:", activo);
    setSelectedActivo(activo);
    setShowModificarActivo(true);
    setShowSCV(false);
    setShowNuevoActivo(false);
    setShowSolicitudDetalles(false);
    setSelectedSolicitud(null);
    // NO CAMBIAR EL TAB AQUÍ - SE QUEDA EN LA TAB ACTUAL
  };

  const handleUpdateActivo = (activoActualizado) => {
    console.log("Activo actualizado:", activoActualizado);
    setShowModificarActivo(false);
    setSelectedActivo(null);
  };

  const handleNavigateToSolicitudDetalles = (solicitud) => {
    console.log("RECIBIENDO SOLICITUD EN PAGE:", solicitud);
    setSelectedSolicitud(solicitud);
    setShowSolicitudDetalles(true);
  };

  const handleNavigateBackFromDetalles = () => {
    setShowSolicitudDetalles(false);
    setSelectedSolicitud(null);
  };

  const renderContent = () => {
    console.log("🔄 Renderizando contenido:", { 
      activeTab, 
      showSolicitudDetalles,
      showModificarActivo,
      selectedSolicitud: !!selectedSolicitud,
      selectedActivo: !!selectedActivo
    });

    // MODIFICAR ACTIVO TIENE MÁXIMA PRIORIDAD - SE MUESTRA EN CUALQUIER TAB
    if (showModificarActivo) {
      console.log("📝 Mostrando ModificarActivo (PRIORIDAD MÁXIMA)");
      return (
        <div className="main-content">
          <ModificarActivo
            activo={selectedActivo}
            onNavigateBack={handleNavigateBack}
            onUpdateActivo={handleUpdateActivo}
          />
        </div>
      );
    }

    if (showSolicitudDetalles && selectedSolicitud) {
      console.log("📄 Mostrando SolicitudDetalles");
      return (
        <div className="main-content">
          <SolicitudDetalles
            solicitud={selectedSolicitud}
            onNavigateBack={handleNavigateBackFromDetalles}
            onNavigateToModificarActivo={handleNavigateToModificarActivo}
          />
        </div>
      );
    }

    if (showNuevoActivo) {
      return (
        <div className="main-content">
          <NuevoActivo onNavigateBack={handleNavigateBackFromNuevoActivo} />
        </div>
      );
    }

    switch (activeTab) {
      case "mis-activos":
        if (showSCV) {
          return (
            <div className="main-content">
              <SCV
                onNavigateBack={handleNavigateBack}
                selectedActivo={selectedActivo}
              />
            </div>
          );
        } else {
          return (
            <div className="main-content">
              <Inventory
                onNavigateToSCV={handleNavigateToSCV}
                onNavigateToNuevoActivo={handleNavigateToNuevoActivo}
                onNavigateToModificarActivo={handleNavigateToModificarActivo}
              />
            </div>
          );
        }
      case "mis-solicitudes":
        console.log("📋 Mostrando lista de Solicitudes");
        return (
          <div className="main-content">
            <Solicitudes
              onNavigateToDetalles={handleNavigateToSolicitudDetalles}
            />
          </div>
        );

      default:
        return (
          <div className="main-content">
            <Inventory
              onNavigateToSCV={handleNavigateToSCV}
              onNavigateToNuevoActivo={handleNavigateToNuevoActivo}
              onNavigateToModificarActivo={handleNavigateToModificarActivo}
            />
          </div>
        );
    }
  };

  return (
    <GradientLayout>
      <Header showUser={true} userName="Usuario" />
      <Sidebar
        tabs={usuarioTabs}
        defaultActiveTab={activeTab}
        onTabChange={handleTabChange}
      />
      {renderContent()}
    </GradientLayout>
  );
};

export default UsuarioPage;