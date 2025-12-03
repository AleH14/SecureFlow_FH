"use client";
import React, { useState } from "react";
import { Header, Sidebar, GradientLayout } from "../../components/ui";
import { FaUserCircle } from "react-icons/fa";

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('mis-activos');

  // Pestañas para usuarios normales
  const userTabs = [
    {
      id: 'mis-activos',
      name: 'Mis Activos',
      iconName: 'FaBoxes'
    },
    {
      id: 'mis-solicitudes',
      name: 'Mis Solicitudes',
      iconName: 'FaFileAlt'
    }
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'mis-activos':
        return (
          <div className="main-content">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Mis Activos</h5>
                <button className="btn btn-primary">
                  <i className="fas fa-plus me-2"></i>
                  Solicitar Nuevo Activo
                </button>
              </div>
              <div className="card-body">
                <p>Aquí puedes ver y gestionar los activos que has creado o que tienes asignados.</p>
                {/* Aquí se implementará la lista de activos del usuario */}
              </div>
            </div>
          </div>
        );
      case 'mis-solicitudes':
        return (
          <div className="main-content">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Mis Solicitudes de Cambio</h5>
              </div>
              <div className="card-body">
                <p>Aquí puedes ver el estado de todas tus solicitudes de cambio.</p>
                {/* Aquí se implementará la lista de solicitudes del usuario */}
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="main-content">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Dashboard</h5>
              </div>
              <div className="card-body">
                <h4>Bienvenido a SecureFlow</h4>
                <p>Desde aquí puedes gestionar tus activos y solicitudes de cambio.</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <GradientLayout>
      <Header
        showUser={true}
        userName="Usuario"
        userIcon={FaUserCircle}
      />
      <Sidebar 
        tabs={userTabs}
        defaultActiveTab="mis-activos"
        onTabChange={handleTabChange}
      />
      {renderContent()}
    </GradientLayout>
  );
};

export default DashboardPage;