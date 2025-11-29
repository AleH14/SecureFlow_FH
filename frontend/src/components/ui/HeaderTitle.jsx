import React from "react";
import Image from "next/image";

const HeaderTitle = ({ className = "", ...props }) => {
  return (
    <div className={`header-title ${className}`} {...props}>
      <div className="header-title-content">
        <div className="header-logo">
          <Image 
            src="/icons/JPG/logo_without_name.jpg"
            alt="SecureFlow FH Logo"
            width={125}
            height={125}
            priority
          />
        </div>
        <div className="header-text">
          <h1 className="header-main-title">SecureFlow FH</h1>
          <p className="header-subtitle">Sistemas de Gestión de Seguridad de Información</p>
        </div>
      </div>
    </div>
  );
};

export default HeaderTitle;