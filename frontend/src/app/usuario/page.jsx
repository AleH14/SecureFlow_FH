"use client";
import React, { useState, useEffect } from "react";
import { Header, Sidebar, GradientLayout } from "../../components/ui";
import { ProtectedRoute, LogoutButton } from "../../components";
import { RequestService } from "../../services";
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
  const [modificarActivoContext, setModificarActivoContext] = useState(null); // 'inventory' o 'solicitudes'
  const [solicitudesCount, setSolicitudesCount] = useState(0);

  // Cargar el conteo de solicitudes pendientes al montar el componente
  useEffect(() => {
    const loadSolicitudesPendientesCount = async () => {
      try {
        const response = await RequestService.getRequests();
        if (response && response.success && response.data) {
          const solicitudesPendientes = response.data.solicitudes?.filter(
            solicitud => solicitud.estado === 'Pendiente'
          ) || [];
          setSolicitudesCount(solicitudesPendientes.length);
        }
      } catch (error) {
        console.error('Error cargando conteo de solicitudes pendientes:', error);
        setSolicitudesCount(0);
      }
    };

    loadSolicitudesPendientesCount();
  }, []);

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
      ...(solicitudesCount > 0 && { badgeCount: solicitudesCount })
    },
  ];

  const handleTabChange = (tabId) => {
    // Si es la misma pestaña actual, no hacer nada (evita resetear en re-renders)
    if (tabId === activeTab) {
      return;
    }
    
    // Limpiar detalles de solicitud si cambiamos de pestaña
    if (showSolicitudDetalles && tabId !== "mis-solicitudes") {
      setShowSolicitudDetalles(false);
      setSelectedSolicitud(null);
    }

    // Siempre cambiar la pestaña activa
    setActiveTab(tabId);

    // Resetear ModificarActivo cuando se cambia de pestaña manualmente
    // Esto permite que el usuario navegue libremente entre pestañas
    if (showModificarActivo) {
      setShowModificarActivo(false);
      setSelectedActivo(null);
      setModificarActivoContext(null);
    }

    // Resetear otros estados solo si no hay ModificarActivo activo
    if (!showModificarActivo) {
      if (showSCV) {
        setShowSCV(false);
        setSelectedActivo(null);
      }

      if (showNuevoActivo) {
        setShowNuevoActivo(false);
      }
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
    // Si estamos regresando desde ModificarActivo, considerar el contexto
    if (showModificarActivo && modificarActivoContext === "solicitudes") {
      // Regresar a la pestaña de solicitudes
      setActiveTab("mis-solicitudes");
    } else if (showModificarActivo && modificarActivoContext === "inventory") {
      // Regresar a la pestaña de activos
      setActiveTab("mis-activos");
    }
    
    // Limpiar todos los estados
    setShowSCV(false);
    setSelectedActivo(null);
    setShowNuevoActivo(false);
    setShowModificarActivo(false);
    setShowSolicitudDetalles(false);
    setSelectedSolicitud(null);
    setModificarActivoContext(null);
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

  const handleNavigateToModificarActivo = (activo, context = null) => {
    setSelectedActivo(activo);
    setShowModificarActivo(true);
    setShowSCV(false);
    setShowNuevoActivo(false);
    setShowSolicitudDetalles(false);
    setSelectedSolicitud(null);
    
    // Recordar el contexto desde donde se navegó
    if (context) {
      setModificarActivoContext(context);
    } else {
      // Si no se especifica contexto, inferirlo del estado actual
      if (showSolicitudDetalles || activeTab === "mis-solicitudes") {
        setModificarActivoContext("solicitudes");
      } else {
        setModificarActivoContext("inventory");
      }
    }
    

  };

  const handleUpdateActivo = (activoActualizado) => {

    setShowModificarActivo(false);
    setSelectedActivo(null);
  };

  const handleNavigateToSolicitudDetalles = (solicitud) => {
    setSelectedSolicitud(solicitud);
    setShowSolicitudDetalles(true);
  };

  const handleNavigateBackFromDetalles = () => {
    setShowSolicitudDetalles(false);
    setSelectedSolicitud(null);
  };

  const renderContent = () => {
    // MODIFICAR ACTIVO TIENE MÁXIMA PRIORIDAD ABSOLUTA - SE MUESTRA EN CUALQUIER TAB
    if (showModificarActivo && selectedActivo) {
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
    <ProtectedRoute allowedRoles={['usuario']}>
      <GradientLayout>
        <Header showUser={true} userName="Usuario">
          <div className="d-flex align-items-center">
            <LogoutButton 
              variant="outline" 
              size="sm" 
              className="text-white border-white"
            />
          </div>
        </Header>
        <Sidebar
          tabs={usuarioTabs}
          defaultActiveTab={activeTab}
          onTabChange={handleTabChange}
        />
        {renderContent()}
      </GradientLayout>
    </ProtectedRoute>
  );
};

export default UsuarioPage;