'use client';

import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Image from 'next/image';
import { Input, Button, Card } from './ui';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Por favor ingresa un correo electrónico válido';
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
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
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Login submitted:', formData);
      // Handle successful login here
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="auth-gradient-container login-container">
      <Row className="justify-content-center align-items-center min-vh-100">
        <Col xs={12} sm={10} md={8} lg={6} xl={5}>
          <Card className="shadow-lg">
            <Card.Body className="p-5">
              <div className="text-center mb-5">
                <Image
                  src="/icons/JPG/logo_without_name.jpg"
                  alt="SecureFlow Logo"
                  width={150}
                  height={150}
                  className="mb-3"
                  priority
                />
                <h1 className="text-navy fw-bold mb-4 app-title">
                  SecureFlow FH
                </h1>
                <h2 className="text-navy fw-bold mb-2">Bienvenido de Nuevo</h2>
                <p className="text-muted">Inicia sesión en tu cuenta</p>
              </div>
              
              <form onSubmit={handleSubmit}>
                <Input
                  type="email"
                  name="email"
                  label="Correo Electrónico"
                  placeholder="Ingresa tu correo electrónico"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  required
                />
                
                <Input
                  type="password"
                  name="password"
                  label="Contraseña"
                  placeholder="Ingresa tu contraseña"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  required
                />
                
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="rememberMe"
                    />
                    <label className="form-check-label text-sm" htmlFor="rememberMe">
                      Recuérdame
                    </label>
                  </div>

                </div>
                
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-100 mb-3"
                  loading={loading}
                  disabled={loading}
                >
                  Iniciar Sesión
                </Button>
                
                <div className="text-center">
                  <span className="text-muted"> ¿Olvidaste tu contraseña? ¿No tienes cuenta?  </span>
                  <br></br>
                  <a href="#" className="text-decoration-none text-primary-custom fw-semibold">
                    Contacta con la administración
                  </a>
                </div>
              </form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginForm;