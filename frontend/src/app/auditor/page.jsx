"use client"
import React,{ useState, useEffect } from "react";
import{Header,Sidebar,GradientLayout}  from "../../components/ui"
import Inventory from "./inventory/Inventory";
import SCV from "./scv/SCV";
import { getCurrentUser } from "../../services/userService"; // Importa la función para obtener el usuario actual

const AuditorPage = () => {
       const [activeTab, setActiveTab] = useState('activos');
       const [showSCV, setShowSCV] = useState(false);
       const [selectedActivo, setSelectedActivo] = useState(null);
       const [userData, setUserData] = useState(null); //almacenar datos del usuario

      // Definir las pestañas dentro del componente usando iconNames
  const adminTabs = [
    {
      id: 'activos',
      name: 'Inventario de Activos',
      iconName: 'FaBoxes'
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
    if (tabId !== 'activos') {
      setShowSCV(false);
      setSelectedActivo(null);
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

    const renderContent = () => {
    switch (activeTab) {
      case 'activos':
        if (showSCV) {
          return (
            <div className="main-content">
              <SCV onNavigateBack={handleNavigateBack} selectedActivo={selectedActivo} />
            </div>
          );
        } else {
          return (
            <div className="main-content">
              <Inventory onNavigateToSCV={handleNavigateToSCV} />
            </div>
          );
        }
      default:
        return (
          <div className="main-content">
            <Inventory onNavigateToSCV={handleNavigateToSCV} />
          </div>
        );
    }}

  

    return (  
        <GradientLayout>
            <Header
                showUser={true}
                 userName={userData ? `${userData.nombre} ${userData.apellido}` : "Auditor"}
                 userRole={userData ? userData.rol : ""} // Pasar el rol
            />  
                  <Sidebar 
                    tabs={adminTabs}
                    defaultActiveTab="activos"
                    onTabChange={handleTabChange}
                  />
                   {renderContent()}

        </GradientLayout>
    );
}

export default AuditorPage;