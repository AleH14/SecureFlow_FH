"use client";

import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Modal,
  Button as BootstrapButton, //para modal
} from "react-bootstrap";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Input, Button, Card } from "./ui";
import { AuthService } from "@/services";

import { FiAlertTriangle } from "react-icons/fi";

const LoginForm = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    // Clear general error too
    if (errors.general) {
      setErrors((prev) => ({
        ...prev,
        general: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Por favor ingresa un correo electrónico válido";
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
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
    setErrors({}); // Limpia todos los errores

    try {
      const response = await AuthService.login(
        formData.email,
        formData.password
      );

      const { token, user } = response.data;

      if (!user || !user.rol) {
        throw new Error("Respuesta del servidor inválida");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      //vistas segun rol logueado
      switch (user.rol) {
        case "administrador":
          router.push("/admin");
          break;
        case "responsable_seguridad":
          router.push("/seguridad");
          break;
        case "auditor":
          router.push("/auditor");
          break;
        case "usuario":
        default:
          router.push("/usuario");
          break;
      }
    } catch (error) {
    let errorMessage = "Error al iniciar sesión";
    
    if (error.response?.data?.message) {
      const backendMessage = error.response.data.message;
      
      if (backendMessage.includes("Cuenta inactiva contacta al administrador")) {
        errorMessage = "Cuenta inactiva. Contacta al administrador.";
      } else {
        errorMessage = "Credenciales inválidas";
      }
    }

    setErrors({
      general: errorMessage,
    });
    } finally {
      setLoading(false);
    }
  };

  const handleContactAdmin = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
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

              <form onSubmit={handleSubmit} noValidate>
                {errors.general && (
                  <div
                    className="alert alert-danger mb-3 d-flex align-items-center"
                  >
                    <FiAlertTriangle className="me-2" />
                    <span>{errors.general}</span>
                  </div>
                )}

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
                  <span className="text-muted">
                    {" "}
                    ¿Olvidaste tu contraseña? ¿No tienes cuenta?{" "}
                  </span>
                  <br></br>
                  <a
                    href="#"
                    className="text-decoration-none text-primary-custom fw-semibold"
                    onClick={handleContactAdmin}
                  >
                    Contacta con la administración
                  </a>
                </div>
              </form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        contentClassName="bg-body-secondary"
      >
        <Modal.Header closeButton className="bg-secondary text-white">
          <Modal.Title>Soporte</Modal.Title>
        </Modal.Header>

        <Modal.Body className="text-center">
          <p className="mb-3">
            Si tienes problemas para acceder, contacta al administrador.
          </p>

          <div className="mb-2">
            <strong>Extensión:</strong> 503
          </div>

          <div className="mb-2">
            <strong>Correo:</strong> admin@em.com
          </div>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default LoginForm;
