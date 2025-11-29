"use client"
import React,{ useState } from "react";
import{Header,Sidebar,GradientLayout}  from "../../components/ui"
import Inventory from "./inventory/Inventory";
import SCV from "./scv/SCV";



const AuditorPage = () => {
       const [activeTab, setActiveTab] = useState('activos');
       const [showSCV, setShowSCV] = useState(false);
       const [selectedActivo, setSelectedActivo] = useState(null);
      // Definir las pestañas dentro del componente usando iconNames
  const adminTabs = [
    {
      id: 'activos',
      name: 'Inventario de Activos',
      iconName: 'FaBoxes'
    }
  ];

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
                userName="Auditor"
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