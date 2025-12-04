"use client";
import React, { useState, useEffect } from 'react';

const ConnectionStatus = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch('http://localhost:5000/health', { 
          method: 'GET',
          signal: AbortSignal.timeout(5000)
        });
        
        if (response.ok) {
          if (!isConnected) {
            setIsConnected(true);
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 5000);
          } else {
            setIsConnected(true);
          }
        } else {
          setIsConnected(false);
          setShowNotification(true);
        }
      } catch (error) {
        setIsConnected(false);
        setShowNotification(true);
      }
    };

    // Verificar conexión inicialmente
    checkConnection();
    
    // Verificar conexión cada 30 segundos
    const interval = setInterval(checkConnection, 30000);
    
    return () => clearInterval(interval);
  }, [isConnected]);

  if (!showNotification) return null;

  return (
    <div 
      className={`position-fixed top-0 start-50 translate-middle-x mt-3 alert ${
        isConnected ? 'alert-success' : 'alert-danger'
      } shadow-lg`}
      style={{ zIndex: 9999, minWidth: '300px' }}
      role="alert"
    >
      <div className="d-flex align-items-center">
        <i className={`bi ${isConnected ? 'bi-wifi' : 'bi-wifi-off'} me-2`}></i>
        <div>
          <strong>
            {isConnected ? '¡Conexión restablecida!' : 'Sin conexión al servidor'}
          </strong>
          <div className="small">
            {isConnected 
              ? 'La aplicación está funcionando normalmente.' 
              : 'Verifique que el backend esté ejecutándose.'
            }
          </div>
        </div>
        <button
          type="button"
          className="btn-close ms-auto"
          onClick={() => setShowNotification(false)}
          aria-label="Close"
        ></button>
      </div>
    </div>
  );
};

export default ConnectionStatus;