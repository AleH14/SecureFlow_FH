'use client';

import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';
import { Input, Button, Card, Select, Alert } from './ui';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    department: '',
    userRole: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const userRoles = [
    { value: 'administrator', label: 'Administrador' },
    { value: 'security_officer', label: 'Oficial de Seguridad' },
    { value: 'internal_auditor', label: 'Auditor Interno' },
    { value: 'user', label: 'Usuario' }
  ];

  const departments = [
    { value: 'it', label: 'Tecnología de la Información' },
    { value: 'security', label: 'Seguridad' },
    { value: 'audit', label: 'Auditoría Interna' },
    { value: 'hr', label: 'Recursos Humanos' },
    { value: 'finance', label: 'Finanzas' },
    { value: 'operations', label: 'Operaciones' },
    { value: 'legal', label: 'Legal y Cumplimiento' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    // Clear success message when form is modified
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido';
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = 'El nombre debe tener al menos 2 caracteres';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido';
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = 'El apellido debe tener al menos 2 caracteres';
    }
    
    if (!formData.email) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Por favor ingresa un correo electrónico válido';
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'El número de teléfono es requerido';
    } else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Por favor ingresa un número de teléfono válido';
    }
    
    if (!formData.department) {
      newErrors.department = 'El departamento es requerido';
    }
    
    if (!formData.userRole) {
      newErrors.userRole = 'El rol de usuario es requerido';
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'La contraseña debe contener mayúscula, minúscula y número';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Por favor confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    setErrors({});
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create user object without confirmPassword
      const { confirmPassword, ...userData } = formData;
      console.log('User created:', userData);
      
      const roleLabel = userRoles.find(role => role.value === formData.userRole)?.label;
      setSuccessMessage(`El usuario ${formData.firstName} ${formData.lastName} ha sido creado exitosamente con el rol: ${roleLabel}`);
      
      // Reset form after successful creation
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        department: '',
        userRole: '',
        password: '',
        confirmPassword: ''
      });
      
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ general: 'Error al crear el usuario. Por favor intenta de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      department: '',
      userRole: '',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
    setSuccessMessage('');
  };

  return (
    <Container fluid className="auth-gradient-container register-container">
      <Row className="justify-content-center align-items-center min-vh-100 py-4">
        <Col xs={12} sm={11} md={10} lg={8} xl={6}>
          <Card className="shadow-lg">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <Image
                  src="/icons/JPG/logo_without_name.jpg"
                  alt="SecureFlow Logo"
                  width={150}
                  height={150}
                  className="mb-3"
                  priority
                />
                <h1 className="text-navy fw-bold mb-3 app-title-small">
                  SecureFlow FH
                </h1>
                <h2 className="text-navy fw-bold mb-2">Crear Nuevo Usuario</h2>
                <p className="text-muted">Panel de Administrador - Registro de Usuario</p>
              </div>

              {successMessage && (
                <Alert variant="success" dismissible onClose={() => setSuccessMessage('')}>
                  <i className="bi bi-check-circle-fill me-2"></i>
                  {successMessage}
                </Alert>
              )}

              {errors.general && (
                <Alert variant="danger" dismissible onClose={() => setErrors(prev => ({ ...prev, general: '' }))}>
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {errors.general}
                </Alert>
              )}
              
              <form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Input
                      type="text"
                      name="firstName"
                      label="Nombre"
                      placeholder="Ingresa el nombre"
                      value={formData.firstName}
                      onChange={handleChange}
                      error={errors.firstName}
                      required
                    />
                  </Col>
                  <Col md={6}>
                    <Input
                      type="text"
                      name="lastName"
                      label="Apellido"
                      placeholder="Ingresa el apellido"
                      value={formData.lastName}
                      onChange={handleChange}
                      error={errors.lastName}
                      required
                    />
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Input
                      type="email"
                      name="email"
                      label="Correo Electrónico"
                      placeholder="Ingresa el correo electrónico"
                      value={formData.email}
                      onChange={handleChange}
                      error={errors.email}
                      required
                    />
                  </Col>
                  <Col md={6}>
                    <Input
                      type="tel"
                      name="phoneNumber"
                      label="Número de Teléfono"
                      placeholder="Ingresa el número de teléfono"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      error={errors.phoneNumber}
                      required
                    />
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Select
                      name="department"
                      label="Departamento"
                      placeholder="Selecciona un departamento"
                      options={departments}
                      value={formData.department}
                      onChange={handleChange}
                      error={errors.department}
                      required
                    />
                  </Col>
                  <Col md={6}>
                    <Select
                      name="userRole"
                      label="Rol de Usuario"
                      placeholder="Selecciona un rol de usuario"
                      options={userRoles}
                      value={formData.userRole}
                      onChange={handleChange}
                      error={errors.userRole}
                      required
                    />
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Input
                      type="password"
                      name="password"
                      label="Contraseña"
                      placeholder="Ingresa la contraseña"
                      value={formData.password}
                      onChange={handleChange}
                      error={errors.password}
                      required
                    />
                    <small className="text-muted">
                      La contraseña debe contener mayúscula, minúscula y número (mín 8 caracteres)
                    </small>
                  </Col>
                  <Col md={6}>
                    <Input
                      type="password"
                      name="confirmPassword"
                      label="Confirmar Contraseña"
                      placeholder="Confirma la contraseña"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      error={errors.confirmPassword}
                      required
                    />
                  </Col>
                </Row>
                
                <div className="d-flex justify-content-between align-items-center mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={handleReset}
                    disabled={loading}
                    className="me-3"
                  >
                    Limpiar Formulario
                  </Button>
                  
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={loading}
                    disabled={loading}
                    className="flex-grow-1"
                  >
                    Crear Usuario
                  </Button>
                </div>
                
                <div className="text-center mt-4">
                  <Link href="/login" className="text-decoration-none text-primary-custom fw-semibold">
                    <i className="bi bi-arrow-left me-2"></i>
                    Volver al Inicio de Sesión
                  </Link>
                </div>
              </form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterForm;