"use client";
import React, { useState, useEffect } from "react";
import { FaUsers, FaBoxes, FaCog, FaChartBar, FaFileAlt, FaShieldAlt, FaUserPlus } from "react-icons/fa";

// Mapeo de iconos disponibles
const iconMap = {
  FaUsers,
  FaBoxes,
  FaCog,
  FaChartBar,
  FaFileAlt,
  FaShieldAlt,
  FaUserPlus
};

const Sidebar = ({ 
  tabs = [],
  defaultActiveTab = null,
  onTabChange = () => {},
  className = "", 
  ...props 
}) => {
  const [activeTab, setActiveTab] = useState(
    defaultActiveTab || (tabs.length > 0 ? tabs[0].id : null)
  );

  useEffect(() => {
    if (activeTab) {
      onTabChange(activeTab);
    }
  }, [activeTab, onTabChange]);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    console.log('Pestaña cambiada a:', tabId);
  };

  if (!tabs || tabs.length === 0) {
    return null;
  }

  return (
    <div className={`sidebar-container ${className}`} {...props}>
      <nav className="sidebar-nav">
        <ul className="sidebar-tabs">
          {tabs.map((tab) => {
            const IconComponent = iconMap[tab.iconName];
            return (
              <li key={tab.id} className="sidebar-tab-item">
                <button 
                  className={`sidebar-tab-link ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => handleTabClick(tab.id)}
                >
                  {IconComponent && <IconComponent className="sidebar-icon" />}
                  {tab.name}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;