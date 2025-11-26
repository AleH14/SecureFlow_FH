import React from 'react';
import { Button as BootstrapButton } from 'react-bootstrap';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false, 
  className = '', 
  onClick,
  type = 'button',
  ...props 
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'primary':
        return 'btn-custom-primary';
      case 'secondary':
        return 'btn-custom-secondary';
      case 'outline':
        return 'btn-custom-outline';
      default:
        return `btn-${variant}`;
    }
  };

  return (
    <BootstrapButton
      type={type}
      size={size}
      disabled={disabled || loading}
      className={`${getVariantClass()} ${className}`}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <>
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Cargando...
        </>
      ) : (
        children
      )}
    </BootstrapButton>
  );
};

export default Button;