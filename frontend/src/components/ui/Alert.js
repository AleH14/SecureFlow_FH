import React from 'react';
import { Alert as BootstrapAlert } from 'react-bootstrap';

const Alert = ({ 
  children, 
  variant = 'info', 
  dismissible = false, 
  onClose, 
  className = '', 
  show = true,
  ...props 
}) => {
  if (!show) return null;

  return (
    <BootstrapAlert
      variant={variant}
      dismissible={dismissible}
      onClose={onClose}
      className={`custom-alert ${className}`}
      {...props}
    >
      {children}
    </BootstrapAlert>
  );
};

export default Alert;