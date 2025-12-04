import React from "react";
import { FaUserCircle } from "react-icons/fa";

const UserHeader = ({ 
  userName, 
  userRole, // Nueva prop para el rol
  userIcon = FaUserCircle, 
  className = "", 
  showIcon = true,
  ...props 
}) => {
  const IconComponent = userIcon;

  return (
    <div className={`user-header ${className}`} {...props}>
      <div className="user-header-content">
        {showIcon && (
          <div className="user-icon">
            <IconComponent size={32} />
          </div>
        )}
        
        <div className="user-info">
          <span className="user-name">{userName}</span>
          {/* Mostrar el rol */}
          {userRole && (
            <span className="user-role">
              {userRole}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserHeader;