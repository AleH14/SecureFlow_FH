'use client';

import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import { Input, Button, Card, Select, Alert } from '../../../components/ui';
import Toast from '../../../components/ui/Toast';
import { AuthService } from '@/services';

const RegisterPage = () => {
  const router = useRouter();
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
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleBack = () => {
    router.back();
  };

  const userRoles = [
    { value: 'administrador', label: 'Administrador' },
    { value: 'usuario', label: 'Usuario Lector' },
    { value: 'responsable_seguridad', label: 'Responsable de Seguridad' },
    { value: 'auditor', label: 'Auditor' }
  ];

  const departments = [
    { value: 'Tecnologia_de_la_Informacion', label: 'Tecnología de la Información' },
    { value: 'recursos_humanos', label: 'Recursos Humanos' },
    { value: 'seguridad', label: 'Seguridad' },
    { value: 'auditoria', label: 'Auditoría' },
    { value: 'finanzas', label: 'Finanzas' },
    { value: 'operaciones', label: 'Operaciones' },
    { value: 'legal_y_cumplimiento', label: 'Legal y Cumplimiento' }
  ];

  // Función para aplicar la máscara de teléfono
  const formatPhoneNumber = (value) => {
    // Eliminar todos los caracteres no numéricos
    const numbers = value.replace(/\D/g, '');
    
    // Limitar a 8 dígitos máximo
    const limitedNumbers = numbers.slice(0, 8);
    
    // Aplicar formato 0000-0000
    if (limitedNumbers.length <= 4) {
      return limitedNumbers;
    } else {
      return `${limitedNumbers.slice(0, 4)}-${limitedNumbers.slice(4, 8)}`;
    }
  };

  const handlePhoneChange = (e) => {
    const { name, value } = e.target;
    
    // Aplicar la máscara
    const formattedValue = formatPhoneNumber(value);
    
    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    // Clear toast when form is modified
    if (showToast) {
      setShowToast(false);
    }
    // Clear general error
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: '' }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Si es el campo de teléfono, usar la función especial
    if (name === 'phoneNumber') {
      handlePhoneChange(e);
      return;
    }
    
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
    // Clear toast when form is modified
    if (showToast) {
      setShowToast(false);
    }
    // Clear general error
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: '' }));
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
    } else {
      // Validar formato 0000-0000 (8 dígitos con guión)
      const phoneRegex = /^\d{4}-\d{4}$/;
      if (!phoneRegex.test(formData.phoneNumber)) {
        newErrors.phoneNumber = 'Por favor ingresa un número válido (formato: 0000-0000)';
      }
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
  setShowToast(false);
  
  try {
    const response = await AuthService.register(
      formData.firstName,
      formData.lastName,  
      formData.email,
      formData.phoneNumber,
      formData.department,
      formData.password,
      formData.confirmPassword,
      formData.userRole
    );
    
    // Si llegamos aquí, la respuesta fue exitosa
    const usuarioCreado = response.data;
    
    setToastMessage(`Usuario creado exitosamente`);
    setShowToast(true);
    
    // Reset form
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
    
    setTimeout(() => {
      handleBack();
    }, 3000);
    
  } catch (error) {
    // Manejar error 409 específicamente
    if (error.response?.status === 409) {
      setErrors({ 
        general: 'El correo electrónico ya está registrado. Por favor usa otro correo.' 
      });
    } else {
      // Para otros errores
      const errorMessage = error.response?.data?.message || 
                          'Error al crear el usuario. Por favor intenta de nuevo.';
      setErrors({ general: errorMessage });
    }
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
    setShowToast(false);
  };

  return (
    <>
      <Toast
        show={showToast}
        message={toastMessage}
        variant="success"
        autohide={true}
        delay={5000}
        onClose={() => setShowToast(false)}
      />
      
      <Container fluid className="auth-gradient-container register-container">
        <Row className="justify-content-center align-items-center min-vh-100 py-4">
          <Col xs={12} sm={11} md={10} lg={8} xl={6}>
            <Card className="shadow-lg">
              <Card.Body className="p-5">
                <div className="mb-4">
                  <div className="d-flex align-items-center mb-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                      className="me-3 d-flex align-items-center"
                    >
                      <FaArrowLeft className="me-2" />
                      Regresar
                    </Button>
                  </div>
                  
                  <div className="text-center">
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
                </div>

                {/* Mostrar error general con Alert */}
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
                        placeholder="0000-0000"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        error={errors.phoneNumber}
                        required
                        maxLength={9} // 8 numeros + 1 guión
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
                  </div>
                </form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default RegisterPage;