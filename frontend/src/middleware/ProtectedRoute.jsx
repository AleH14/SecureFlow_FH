"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/services/userService';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verificar si hay token
        const token = localStorage.getItem('token');
        
        if (!token) {
          router.push('/login');
          return;
        }

        // Obtener información del usuario actual
        const response = await getCurrentUser();
        
        if (!response.success || !response.data) {
          localStorage.removeItem('token');
          router.push('/login');
          return;
        }

        const userRole = response.data.rol;

        // Verificar si el rol del usuario está permitido
        if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
          // Redirigir según el rol del usuario a su dashboard correcto
          switch (userRole) {
            case 'administrador':
              router.push('/admin');
              break;
            case 'usuario':
              router.push('/usuario');
              break;
            case 'responsable_seguridad':
              router.push('/seguridad');
              break;
            case 'auditor':
              router.push('/auditor');
              break;
            default:
              router.push('/login');
          }
          return;
        }

        // Usuario autorizado
        setIsAuthorized(true);
      } catch (error) {
        console.error('Error verificando autenticación:', error);
        localStorage.removeItem('token');
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, allowedRoles]);

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{
          textAlign: 'center',
          color: 'white'
        }}>
          <div className="spinner-border" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '1.1rem' }}>Verificando acceso...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
