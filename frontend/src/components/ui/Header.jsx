import React from "react";
import HeaderTitle from "./HeaderTitle";
import UserHeader from "./UserHeader";

const Header = ({ 
  children, 
  className = "", 
  showTitle = true,
  userName,
  userRole,
  userIcon,
  showUser = false,
  ...props 
}) => {
  return (
    <header 
      className={`header ${className}`}
      {...props}
    >
      <div className="header-container">
        {showTitle && <HeaderTitle />}
        
        <div className="header-content-wrapper">
          {children}
        </div>
        
        {showUser && userName && (
          <UserHeader 
            userName={userName}
            userRole={userRole} 
            userIcon={userIcon}
          />
        )}
      </div>
    </header>
  );
};

export default Header;

