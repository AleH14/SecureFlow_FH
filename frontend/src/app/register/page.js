import React from 'react';
import RegisterForm from '../../components/RegisterForm';

export const metadata = {
  title: 'Register User - SecureFlow FH',
  description: 'Administrator panel for creating new users in SecureFlow FH',
};

const RegisterPage = () => {
  return <RegisterForm />;
};

export default RegisterPage;