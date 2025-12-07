'use client';

import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import { Input, Button, Card, Select, Alert } from '../../../components/ui';
import Toast from '../../../components/ui/Toast';
import { UserService } from '@/services';

const EditUser = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    department: '',
    userRole: '',
    password: '',
    confirmPassword: '',
    codigo: ''
  });
  const [errors, setErrors] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [emailExistsError, setEmailExistsError] = useState(''); // Error específico de correo existente

  // Función para aplicar la máscara de teléfono
  const formatPhoneNumber = (value) => {
    const numbers = value.replace(/\D/g, '');
    const limitedNumbers = numbers.slice(0, 8);
    
    if (limitedNumbers.length <= 4) {
      return limitedNumbers;
    } else {
      return `${limitedNumbers.slice(0, 4)}-${limitedNumbers.slice(4, 8)}`;
    }
  };

  // Función para manejar cambios en el teléfono
  const handlePhoneChange = (e) => {
    const { name, value } = e.target;
    const formattedValue = formatPhoneNumber(value);
    
    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
    
    // Limpiar errores cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    if (emailExistsError && name === 'email') {
      setEmailExistsError('');
    }
    if (showToast) {
      setShowToast(false);
    }
  };

  // useEffect para redirigir después del toast
  useEffect(() => {
    if (shouldRedirect && showToast) {
      const timer = setTimeout(() => {
        handleBack();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [shouldRedirect, showToast]);

  // useEffect para cargar datos del usuario
  useEffect(() => {
    const userId = searchParams.get('userId');
    if (userId) {
      const nombre = searchParams.get('nombre') || '';
      const [firstName = '', ...lastNameParts] = nombre.split(' ');
      const lastName = lastNameParts.join(' ');
      
      const departamento = searchParams.get('departamento') || '';
      const rol = searchParams.get('rol') || '';
      
      // Formatear el teléfono si es necesario
      const telefono = searchParams.get('telefono') || '';
      const formattedPhone = formatPhoneNumber(telefono);
      
      setFormData({
        firstName,
        lastName,
        email: searchParams.get('email') || '',
        phoneNumber: formattedPhone,
        department: departamento,
        userRole: rol,
        password: '',
        confirmPassword: '',
        codigo: searchParams.get('codigo') || ''
      });
    }
  }, [searchParams]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phoneNumber') {
      handlePhoneChange(e);
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar errores cuando el usuario empieza a escribir en telefono
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    if (emailExistsError && name === 'email') {
      setEmailExistsError('');
    }
    if (showToast) {
      setShowToast(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido';
      isValid = false;
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = 'El nombre debe tener al menos 2 caracteres';
      isValid = false;
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido';
      isValid = false;
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = 'El apellido debe tener al menos 2 caracteres';
      isValid = false;
    }
    
    if (!formData.email) {
      newErrors.email = 'El correo electrónico es requerido';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Por favor ingresa un correo electrónico válido';
      isValid = false;
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'El número de teléfono es requerido';
      isValid = false;
    } else {
      const phoneRegex = /^\d{4}-\d{4}$/;
      if (!phoneRegex.test(formData.phoneNumber)) {
        newErrors.phoneNumber = 'Por favor ingresa un número válido (formato: 0000-0000)';
        isValid = false;
      }
    }
    
    if (!formData.department) {
      newErrors.department = 'El departamento es requerido';
      isValid = false;
    }
    
    if (!formData.userRole) {
      newErrors.userRole = 'El rol de usuario es requerido';
      isValid = false;
    }
    
    // La contraseña es opcional en edición
    if (formData.password && formData.password.length > 0) {
      if (formData.password.length < 8) {
        newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
        isValid = false;
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
        newErrors.password = 'La contraseña debe contener mayúscula, minúscula y número';
        isValid = false;
      }
      
      if (formData.confirmPassword !== formData.password) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
        isValid = false;
      }
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar formulario
    if (!validateForm()) {
      return;
    }

    setEmailExistsError('');
    setShowToast(false);
    setShouldRedirect(false);
    
    try {
      const userId = searchParams.get('userId');
      
      if (!userId) {
        setErrors(prev => ({ ...prev, general: 'ID de usuario no encontrado.' }));
        return;
      }
      
      // Preparar datos para actualización
      const updateData = {
        nombre: formData.firstName,
        apellido: formData.lastName,
        email: formData.email,
        telefono: formData.phoneNumber,
        departamento: formData.department,
        rol: formData.userRole
      };
      
      // Solo incluir contraseña si se proporcionó
      if (formData.password && formData.password.trim()) {
        updateData.contrasena = formData.password;
      }
      
      const response = await UserService.updateUser(userId, updateData);
      
      if (response && response.success) {
        setToastMessage(`El usuario ${formData.firstName} ${formData.lastName} ha sido actualizado exitosamente.`);
        setToastVariant('success');
        setShowToast(true);
        setShouldRedirect(true);
      } else {
        setErrors(prev => ({ 
          ...prev, 
          general: response?.message || 'Error al actualizar el usuario.' 
        }));
      }
      
    } catch (error) {
      let errorMessage = 'Error al actualizar el usuario. Por favor intenta de nuevo.';
      
      // Extraer información del error si está disponible
      const errorResponse = error.response;
      
      if (errorResponse?.status === 400) {
        const errorData = errorResponse?.data;
        
        if (errorData?.message) {
          // Verificar si es error de correo duplicado
          if (errorData.message.toLowerCase().includes('correo') || 
              errorData.message.toLowerCase().includes('email') ||
              errorData.message.toLowerCase().includes('ya existe') ||
              errorData.message.toLowerCase().includes('duplicado')) {
            setEmailExistsError('El correo electrónico ya está registrado. Por favor usa otro correo.');
          } else {
            setErrors(prev => ({ ...prev, general: errorData.message }));
          }
        } else if (errorData?.errors) {
          const errorMessages = Object.values(errorData.errors).flat();
          setErrors(prev => ({ ...prev, general: errorMessages.join(', ') }));
        } else {
          setErrors(prev => ({ ...prev, general: 'Error en la solicitud. Por favor verifica los datos.' }));
        }
        
      } else if (errorResponse?.status === 409) {
        setEmailExistsError('El correo electrónico ya está registrado. Por favor usa otro correo.');
        
      } else if (errorResponse?.status === 404) {
        setErrors(prev => ({ ...prev, general: 'Usuario no encontrado.' }));
        
      } else if (errorResponse?.status === 401 || errorResponse?.status === 403) {
        setErrors(prev => ({ ...prev, general: 'No tienes permisos para realizar esta acción.' }));
        
      } else if (error.message?.includes('Network Error')) {
        setErrors(prev => ({ ...prev, general: 'Error de conexión. Por favor verifica tu internet.' }));
        
      } else {
        setErrors(prev => ({ ...prev, general: errorMessage }));
      }
    } 
  };

  const handleReset = () => {
    const userId = searchParams.get('userId');
    if (userId) {
      const nombre = searchParams.get('nombre') || '';
      const [firstName = '', ...lastNameParts] = nombre.split(' ');
      const lastName = lastNameParts.join(' ');
      
      const telefono = searchParams.get('telefono') || '';
      const formattedPhone = formatPhoneNumber(telefono);
      
      setFormData({
        firstName,
        lastName,
        email: searchParams.get('email') || '',
        phoneNumber: formattedPhone,
        department: searchParams.get('departamento') || '',
        userRole: searchParams.get('rol') || '',
        password: '',
        confirmPassword: '',
        codigo: searchParams.get('codigo') || ''
      });
    }
    
    setErrors({});
    setEmailExistsError('');
    setShowToast(false);
    setShouldRedirect(false);
  };

  return (
    <>
      <Toast
        show={showToast}
        message={toastMessage}
        variant={toastVariant}
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
                    <h2 className="text-navy fw-bold mb-2">
                      Editar Usuario
                    </h2>
                    <p className="text-muted">
                      Panel de Administrador - Editar Usuario {formData.codigo}
                    </p>
                  </div>
                </div>

                {/* Alert para error de correo existente */}
                {emailExistsError && (
                  <Alert variant="danger" dismissible onClose={() => setEmailExistsError('')}>
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {emailExistsError}
                  </Alert>
                )}

                {/* Alert para errores generales (no relacionados con campos específicos) */}
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
                        error={errors.email} // Solo error de validación, NO el de correo existente
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
                        maxLength={9}
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
                        label="Nueva Contraseña (Opcional)"
                        placeholder="Dejar vacío para mantener contraseña actual"
                        value={formData.password}
                        onChange={handleChange}
                        error={errors.password}
                      />
                      <small className="text-muted">
                        Dejar vacío para mantener la contraseña actual. Si se llena, debe contener mayúscula, minúscula y número (mín 8 caracteres)
                      </small>
                    </Col>
                    <Col md={6}>
                      <Input
                        type="password"
                        name="confirmPassword"
                        label="Confirmar Nueva Contraseña"
                        placeholder="Confirmar nueva contraseña"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        error={errors.confirmPassword}
                        required={formData.password.length > 0}
                      />
                    </Col>
                  </Row>
                  
                  <div className="d-flex justify-content-between align-items-center mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={handleReset}
                      className="me-3"
                    >
                      Restaurar Valores
                    </Button>
                    
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="flex-grow-1"
                    >
                      Actualizar Usuario
                    </Button>
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

export default EditUser;