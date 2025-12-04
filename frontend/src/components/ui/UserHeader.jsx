"use client";
import React, { useState } from "react";
import { FaUser, FaUserCircle, FaSignOutAlt, FaChevronDown } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { AuthService } from '@/services';

const UserHeader = ({ 
  userName, 
  userIcon = FaUserCircle, 
  className = "", 
  showIcon = true,
  ...props 
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const IconComponent = userIcon;

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      router.push('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      // Even if there's an error, redirect to login
      router.push('/login');
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <div className={`user-header ${className}`} {...props}>
      <div className="user-header-content">
        <div className="user-info">
          <span className="user-name">{userName}</span>
        </div>
        {showIcon && (
          <div className="user-icon-container">
            <button
              className="user-dropdown-trigger"
              onClick={toggleDropdown}
              aria-label="Menú de usuario"
            >
              <div className="user-icon">
                <IconComponent size={32} />
              </div>
              <FaChevronDown 
                size={12} 
                className={`dropdown-arrow ${isDropdownOpen ? 'rotated' : ''}`} 
              />
            </button>
            
            {isDropdownOpen && (
              <>
                <div className="dropdown-overlay" onClick={closeDropdown}></div>
                <div className="user-dropdown-menu">
                  <button 
                    className="dropdown-item logout-btn"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt className="dropdown-item-icon" />
                    Cerrar Sesión
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .user-header {
          position: relative;
        }

        .user-icon-container {
          position: relative;
        }

        .user-dropdown-trigger {
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          color: inherit;
          padding: 4px;
          border-radius: 6px;
          transition: background-color 0.2s ease;
        }

        .user-dropdown-trigger:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        .dropdown-arrow {
          transition: transform 0.2s ease;
        }

        .dropdown-arrow.rotated {
          transform: rotate(180deg);
        }

        .dropdown-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1000;
        }

        .user-dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          z-index: 1001;
          min-width: 160px;
          overflow: hidden;
          margin-top: 8px;
        }

        .dropdown-item {
          width: 100%;
          padding: 12px 16px;
          border: none;
          background: none;
          text-align: left;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          color: #333;
          font-size: 14px;
          transition: background-color 0.2s ease;
        }

        .dropdown-item:hover {
          background-color: #f5f5f5;
        }

        .logout-btn:hover {
          background-color: #fee;
          color: #dc3545;
        }

        .dropdown-item-icon {
          font-size: 12px;
        }
      `}</style>
    </div>
  );
};

export default UserHeader;