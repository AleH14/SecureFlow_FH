"use client";
import React, { useState, useEffect } from "react";
import { Header, Sidebar, GradientLayout } from "../../components/ui";
import { FaUserCircle } from "react-icons/fa";

import Inventory from "./inventory/Inventory";
import SCV from "./scv/SCV";
import Solicitudes from "./solicitudes/Solicitudes";
import Revision from "./revision/Revision"; // Componente para aprobar/rechazar
import RevisionVista from "./revision/RevisionVista"; // Componente para solo ver
import { RequestService } from "../../services";
import { getCurrentUser } from "../../services/userService"; // Importa la función para obtener el usuario actual

const SeguridadPage = () => {
  const [activeTab, setActiveTab] = useState("panel-revision");
  const [showSCV, setShowSCV] = useState(false);
  const [selectedActivo, setSelectedActivo] = useState(null);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [showRevision, setShowRevision] = useState(false);
  const [showRevisionVista, setShowRevisionVista] = useState(false);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [userData, setUserData] = useState(null); //almacenar datos del usuario

  // Cargar conteo al montar el componente
  useEffect(() => {
    const loadPendingRequestsCount = async () => {
      try {
        const response = await RequestService.getRequests();
        if (response && response.success && response.data) {
          const solicitudes = response.data.solicitudes || [];
          const pendingCount = solicitudes.filter(solicitud => solicitud.estado === 'Pendiente').length;
          setPendingRequestsCount(pendingCount);
          console.log(`Solicitudes pendientes encontradas: ${pendingCount}`);
        }
      } catch (error) {
        console.error('Error cargando conteo de solicitudes pendientes:', error);
        setPendingRequestsCount(0);
      }
    };

    loadPendingRequestsCount();
  }, []);

  // Tabs del Responsable de Seguridad
  const seguridadTabs = [
    {
      id: "panel-revision",
      name: "Panel de Revisión",
      iconName: "FaTasks",
      badgeCount: pendingRequestsCount
    },
    {
      id: "inventario",
      name: "Inventario de Activos",
      iconName: "FaBoxes"
    }
  ];

  // Obtener el usuario actual
    useEffect(() => {
      const fetchCurrentUser = async () => {
        try {
          const response = await getCurrentUser(); // Esto devuelve {success, message, data}
  
          if (response.success && response.data) {
            setUserData(response.data); // response.data contiene la info del usuario
          }
        } catch (error) {
          console.error("Error al obtener usuario:", error);
        }
      };
  
      fetchCurrentUser();
    }, []); // El array vacío [] significa que se ejecuta solo una vez al montar el componente

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
    
    // Recargar el conteo de solicitudes pendientes cuando se regresa de la revisión
    const updatePendingCount = async () => {
      try {
        const response = await RequestService.getRequests();
        if (response && response.success && response.data) {
          const solicitudes = response.data.solicitudes || [];
          const pendingCount = solicitudes.filter(solicitud => solicitud.estado === 'Pendiente').length;
          setPendingRequestsCount(pendingCount);
        }
      } catch (error) {
        console.error('Error actualizando conteo de solicitudes pendientes:', error);
      }
    };
    
    updatePendingCount();
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
              onSolicitudesLoaded={(solicitudes) => {
                const pendingCount = solicitudes.filter(s => s.estadoGeneral === 'Pendiente').length;
                setPendingRequestsCount(pendingCount);
              }}
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
        userName={userData ? `${userData.nombre} ${userData.apellido}` : "Responsable de Seguridad"}
        userRole="Responsable de Seguridad"
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