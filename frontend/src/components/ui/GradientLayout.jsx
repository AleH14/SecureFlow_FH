"use client";
import React from "react";

const GradientLayout = ({ children, className = "", ...props }) => {
  return (
    <div className={`gradient-layout-container ${className}`} {...props}>
      <div className="gradient-content">
        {children}
      </div>
    </div>
  );
};

export default GradientLayout;