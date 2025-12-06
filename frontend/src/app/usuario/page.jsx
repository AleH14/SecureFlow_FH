"use client";
import React, { useState, useEffect } from "react";
import { Header, Sidebar, GradientLayout } from "../../components/ui";
import { RequestService } from "../../services";
import Inventory from "./inventory/Inventory";
import SCV from "./scv/SCV";
import NuevoActivo from "./activo/NuevoActivo";
import ModificarActivo from "./activo/ModificarActivo";
import Solicitudes from "./solicitudes/Solicitudes";
import SolicitudDetalles from "./solicitudes/SolicitudDetalles";
import { getCurrentUser } from "../../services/userService";
import ProtectedRoute from "../../middleware/ProtectedRoute";

const UsuarioPage = () => {
  const [activeTab, setActiveTab] = useState("mis-activos");
  const [showSCV, setShowSCV] = useState(false);
  const [selectedActivo, setSelectedActivo] = useState(null);
  const [showNuevoActivo, setShowNuevoActivo] = useState(false);
  const [showModificarActivo, setShowModificarActivo] = useState(false);
  const [showSolicitudDetalles, setShowSolicitudDetalles] = useState(false);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [modificarActivoContext, setModificarActivoContext] = useState(null);
  const [cambiosRechazados, setCambiosRechazados] = useState([]);
  const [solicitudesCount, setSolicitudesCount] = useState(0);
  const [userData, setUserData] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Función para refrescar el contador de solicitudes
  const refreshSolicitudesCount = () => {
    setRefreshTrigger(prev => prev + 1);
  };

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
  }, [refreshTrigger]);

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
      badgeCount: solicitudesCount > 0 ? solicitudesCount : ""
    },
  ];

  // Obtener el usuario actual
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await getCurrentUser();
        if (response.success && response.data) {
          setUserData(response.data);
          // Forzar actualización del contador cuando se obtiene el usuario
          setRefreshTrigger(prev => prev + 1);
        }
      } catch (error) {
        console.error("Error al obtener usuario:", error);
      }
    };
    fetchCurrentUser();
  }, []);

  const handleTabChange = (tabId) => {
    if (tabId === activeTab) return;
    
    if (showSolicitudDetalles && tabId !== "mis-solicitudes") {
      setShowSolicitudDetalles(false);
      setSelectedSolicitud(null);
    }

    setActiveTab(tabId);

    if (showModificarActivo) {
      setShowModificarActivo(false);
      setSelectedActivo(null);
      setModificarActivoContext(null);
    }

    if (!showModificarActivo) {
      if (showSCV) {
        setShowSCV(false);
        setSelectedActivo(null);
      }

      if (showNuevoActivo) {
        setShowNuevoActivo(false);
      }
    }

    // Actualizar contador al cambiar a la pestaña de solicitudes (mayor seguridad)
    if (tabId === "mis-solicitudes") {
      refreshSolicitudesCount();
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
    if (showModificarActivo && modificarActivoContext === "solicitudes") {
      setActiveTab("mis-solicitudes");
    } else if (showModificarActivo && modificarActivoContext === "inventory") {
      setActiveTab("mis-activos");
    }
    
    setShowSCV(false);
    setSelectedActivo(null);
    setShowNuevoActivo(false);
    setShowModificarActivo(false);
    setShowSolicitudDetalles(false);
    setSelectedSolicitud(null);
    setModificarActivoContext(null);
    setCambiosRechazados([]);
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

  const handleNavigateToModificarActivo = (activo, context = null, tipoSolicitud = null, cambios = []) => {
    setSelectedActivo(activo);
    setCambiosRechazados(cambios);
    setShowModificarActivo(true);
    setShowSCV(false);
    setShowNuevoActivo(false);
    setShowSolicitudDetalles(false);
    setSelectedSolicitud(null);
    
    if (context) {
      setModificarActivoContext(context);
    } else {
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
    refreshSolicitudesCount();
  };

  const renderContent = () => {
    if (showModificarActivo && selectedActivo) {
      return (
        <div className="main-content">
          <ModificarActivo
            activo={selectedActivo}
            cambiosRechazados={cambiosRechazados}
            onNavigateBack={handleNavigateBack}
            onUpdateActivo={handleUpdateActivo}
            onRefreshSolicitudes={refreshSolicitudesCount}
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
            onRefreshSolicitudes={refreshSolicitudesCount} 
          />
        </div>
      );
    }

    if (showNuevoActivo) {
      return (
        <div className="main-content">
          <NuevoActivo 
            onNavigateBack={handleNavigateBackFromNuevoActivo}
            onRefreshSolicitudes={refreshSolicitudesCount}
          />
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
              onRefreshCount={refreshSolicitudesCount}
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
        <Header 
          showUser={true} 
          userName={userData ? `${userData.nombre} ${userData.apellido}` : "Usuario"} 
          userRole={userData ? userData.rol : ""}
        />
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