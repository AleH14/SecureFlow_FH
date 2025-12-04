"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/services/userService';
import useIsClient from '@/hooks/useIsClient';

const ProtectedRoute = ({ children, allowedRoles = [], redirectTo = '/login' }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const isClient = useIsClient();

  const redirectToUserHome = useCallback((userRole) => {
    switch (userRole) {
      case 'administrador':
        router.push('/admin');
        break;
      case 'responsable_seguridad':
        router.push('/seguridad');
        break;
      case 'auditor':
        router.push('/auditor');
        break;
      case 'usuario':
        router.push('/usuario');
        break;
      default:
        router.push('/login');
        break;
    }
  }, [router]);

  useEffect(() => {
    const checkAuth = async () => {
      // Solo ejecutar en el cliente para evitar errores de hidratación
      if (!isClient) return;
      
      try {
        // Verificar si hay token en localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.log('No token found, redirecting to login');
          router.push(redirectTo);
          return;
        }

        // Verificar si el token es válido obteniendo el usuario actual
        const response = await getCurrentUser();
        
        if (response && response.success && response.data) {
          const userData = response.data;
          setUser(userData);
          setIsAuthenticated(true);

          // Verificar autorización por rol si se especificaron roles permitidos
          if (allowedRoles.length > 0) {
            const userRole = userData.rol;
            const hasPermission = allowedRoles.includes(userRole);
            
            if (!hasPermission) {
              console.log(`User role '${userRole}' not authorized for this route. Allowed roles:`, allowedRoles);
              // Redirigir a la página apropiada según el rol del usuario
              redirectToUserHome(userRole);
              return;
            }
          }
          
          setIsAuthorized(true);
        } else {
          throw new Error('Invalid user response');
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        
        // Limpiar datos de autenticación
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        setIsAuthenticated(false);
        setIsAuthorized(false);
        
        // Redirigir al login
        router.push(redirectTo);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, redirectTo, allowedRoles, redirectToUserHome, isClient]);

  // Prevenir flash durante la hidratación
  if (!isClient) {
    return <div suppressHydrationWarning={true}></div>;
  }

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3 text-muted">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado o autorizado, no mostrar nada (el redirect ya se ejecutó)
  if (!isAuthenticated || !isAuthorized) {
    return null;
  }

  // Si está autenticado y autorizado, mostrar el contenido
  return children;
};

export default ProtectedRoute;