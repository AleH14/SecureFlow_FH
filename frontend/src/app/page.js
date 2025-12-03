import React from 'react';
import LoginForm from '../components/LoginForm';

export const metadata = {
  title: 'SecureFlow FH - Inicio de Sesión',
  description: 'Sistema de gestión segura - Iniciar sesión',
};

export default function Home() {
  return <LoginForm />;
}