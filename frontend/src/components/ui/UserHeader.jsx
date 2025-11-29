import React from "react";
import { FaUser, FaUserCircle } from "react-icons/fa";

const UserHeader = ({ 
  userName, 
  userIcon = FaUserCircle, 
  className = "", 
  showIcon = true,
  ...props 
}) => {
  const IconComponent = userIcon;

  return (
    <div className={`user-header ${className}`} {...props}>
      <div className="user-header-content">
                <div className="user-info">
          <span className="user-name">{userName}</span>
        </div>
        {showIcon && (
          <div className="user-icon">
            <IconComponent size={32} />
          </div>
        )}

      </div>
    </div>
  );
};

export default UserHeader;