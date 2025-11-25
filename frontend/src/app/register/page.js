import React from 'react';
import RegisterForm from '../../components/RegisterForm';

export const metadata = {
  title: 'Registrar Usuario - SecureFlow FH',
  description: 'Panel de administrador para crear nuevos usuarios en SecureFlow FH',
};

const RegisterPage = () => {
  return <RegisterForm />;
};

export default RegisterPage;