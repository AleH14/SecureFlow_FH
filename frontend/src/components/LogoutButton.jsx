"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaSignOutAlt, FaSpinner } from 'react-icons/fa';
import { AuthService } from '@/services';

const LogoutButton = ({ 
  variant = "outline", 
  size = "sm", 
  className = "", 
  showIcon = true,
  showText = true,
  text = "Cerrar Sesión",
  ...props 
}) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevenir múltiples clics

    try {
      setIsLoggingOut(true);
      console.log('Iniciando proceso de logout...');
      
      // Llamar al servicio de logout que incluye el endpoint del backend
      await AuthService.logout();
      
      console.log('Logout exitoso, redirigiendo a login...');
      
      // Redirigir al login
      router.push('/login');
      
    } catch (error) {
      console.error('Error durante el logout:', error);
      
      // Aún con error, redirigir al login por seguridad
      router.push('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getButtonClass = () => {
    let baseClass = "btn";
    
    // Aplicar variante
    if (variant === "outline") {
      baseClass += " btn-outline-danger";
    } else if (variant === "solid") {
      baseClass += " btn-danger";
    } else if (variant === "ghost") {
      baseClass += " btn-link text-danger";
    }
    
    // Aplicar tamaño
    if (size === "sm") {
      baseClass += " btn-sm";
    } else if (size === "lg") {
      baseClass += " btn-lg";
    }
    
    // Estado de carga
    if (isLoggingOut) {
      baseClass += " disabled";
    }
    
    return `${baseClass} ${className}`.trim();
  };

  return (
    <button
      type="button"
      className={getButtonClass()}
      onClick={handleLogout}
      disabled={isLoggingOut}
      title={text}
      {...props}
    >
      {isLoggingOut ? (
        <>
          {showIcon && <FaSpinner className="me-2 fa-spin" />}
          {showText && "Cerrando..."}
        </>
      ) : (
        <>
          {showIcon && <FaSignOutAlt className={showText ? "me-2" : ""} />}
          {showText && text}
        </>
      )}
    </button>
  );
};

export default LogoutButton;