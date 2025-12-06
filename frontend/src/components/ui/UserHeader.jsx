"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { logout } from "@/services/authService";

const UserHeader = ({ 
  userName, 
  userRole,
  userIcon = FaUserCircle, 
  className = "", 
  showIcon = true,
  ...props 
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const IconComponent = userIcon;
  const dropdownRef = useRef(null);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    try {
      logout();
      setIsDropdownOpen(false);
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className={`user-header ${className}`} ref={dropdownRef} {...props}>
      <div className="position-relative d-inline-block">
        <div 
          className="user-header-content"
          onClick={toggleDropdown}
          style={{ cursor: 'pointer' }}
        >
          {showIcon && (
            <div className="user-icon">
              <IconComponent size={32} />
            </div>
          )}
          
          <div className="user-info">
            <span className="user-name">{userName}</span>
            {userRole && (
              <span className="user-role">
                {userRole}
              </span>
            )}
          </div>
        </div>

        {/* Dropdowncon Bootstrap  - cerrar sesión */}
        {isDropdownOpen && (
          <div className="position-absolute start-0 mt-1">
            <div className="dropdown-menu show">
              <button
                className="dropdown-item text-danger"
                onClick={handleLogout}
              >
                <FaSignOutAlt className="me-2" />
                Cerrar sesión
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserHeader;