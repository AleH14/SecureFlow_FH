"use client";

import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";
import { Input, Button, Card, Select, Alert } from "../../../components/ui";
import { ActivoService } from "@/services";
import {
  validateActivoForm,
  categoriasOptions,
} from "./validacionesActivo";

const NuevoActivo = ({ onNavigateBack }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    codigo: "(Se generará automáticamente)",
    categoria: "",
    descripcion: "",
    ubicacion: "",
    estado: "En Revision", // Estado por defecto del backend
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleBack = () => {
    if (onNavigateBack) {
      onNavigateBack();
    }
  };

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

    // Clear success message when form is modified
    if (successMessage) {
      setSuccessMessage("");
    }
  };

  const handleGenerateCode = () => {
    setErrors((prev) => ({
      ...prev,
      codigo: "El código se generará automáticamente al crear el activo",
    }));
    
    // Limpiar el error después de 3 segundos
    setTimeout(() => {
      setErrors((prev) => ({
        ...prev,
        codigo: "",
      }));
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar el formulario
    const newErrors = validateActivoForm(formData);
    setErrors(newErrors);

    // Si hay errores, no enviar el formulario
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setLoading(true);

    try {
      // Preparar datos para el backend (sin el código ya que se genera automáticamente)
      const activoData = {
        nombre: formData.nombre.trim(),
        categoria: formData.categoria,
        descripcion: formData.descripcion.trim(),
        ubicacion: formData.ubicacion.trim()
      };

      // Llamar al servicio para crear el activo
      const response = await ActivoService.createActivo(activoData);
      
      console.log('Activo creado exitosamente:', response);
      
      // El backend devuelve tanto el activo como la solicitud de cambio
      const codigoGenerado = response.activo?.codigo || 'Código no disponible';
      const solicitudCodigo = response.solicitud?.codigoSolicitud || '';
      
      setSuccessMessage(
        `El activo "${formData.nombre}" ha sido creado exitosamente con el código: ${codigoGenerado}. ` +
        `Se ha generado la solicitud de aprobación: ${solicitudCodigo}`
      );

      // Limpiar formulario
      setFormData({
        nombre: "",
        codigo: "(Se generará automáticamente)",
        categoria: "",
        descripcion: "",
        ubicacion: "",
        estado: "En Revision",
      });
      setErrors({});
      
    } catch (error) {
      console.error('Error creando activo:', error);
      
      let errorMessage = "Error al crear el activo. Por favor intenta de nuevo.";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 400) {
        errorMessage = "Datos inválidos. Verifica la información ingresada.";
      } else if (error.response?.status === 401) {
        errorMessage = "No tienes permisos para crear activos. Inicia sesión nuevamente.";
      } else if (error.response?.status >= 500) {
        errorMessage = "Error interno del servidor. Intenta más tarde.";
      }
      
      setErrors({
        general: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      nombre: "",
      codigo: "(Se generará automáticamente)",
      categoria: "",
      descripcion: "",
      ubicacion: "",
      estado: "En Revision",
    });
    setErrors({});
    setSuccessMessage("");
  };

  return (
    <div className="nuevo-activo-page">
      <div className="mb-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleBack}
          className="d-flex align-items-center"
          style={{ color: "white", borderColor: "white" }}
        >
          <FaArrowLeft className="me-2" />
          Volver a mis activos
        </Button>
      </div>

      <div className="user-header">
        <div className="user-header-text">
          <h2>Creación de Nuevo Activo de Información</h2>
        </div>
      </div>

      <Container fluid>
        <Row className="justify-content-center">
          <Col xs={12} lg={8} xl={6}>
            <Card className="shadow-lg" style={{ backgroundColor: "#FFEEEE" }}>
              <Card.Body className="p-4">
                <p className="text-muted text-center">
                  Panel de creación de activo - Digite toda la información
                  requerida
                </p>
                 {/* Alert informativo */}
                <div
                  className="p-3 mb-4 rounded"
                  style={{
                    backgroundColor: "#F2F8FF",
                    color: "#8b7f7fff",
                    fontSize: "0.9rem"
                  }}
                >
                  <strong>Proceso de Control de Cambios ISO 27001:</strong>{" "}
                  Los nuevos activos se crean en estado &quot;En Revisión&quot; y requieren aprobación del responsable
                  de seguridad. Se generará automáticamente una solicitud de cambio pendiente de
                  revisión. El código del activo se asignará automáticamente.
                </div>

                {successMessage && (
                  <Alert
                    variant="success"
                    dismissible
                    onClose={() => setSuccessMessage("")}
                  >
                    <i className="bi bi-check-circle-fill me-2"></i>
                    {successMessage}
                  </Alert>
                )}

                {errors.general && (
                  <Alert
                    variant="danger"
                    dismissible
                    onClose={() =>
                      setErrors((prev) => ({ ...prev, general: "" }))
                    }
                  >
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {errors.general}
                  </Alert>
                )}

                <form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Input
                        type="text"
                        name="nombre"
                        label="Nombre del Activo"
                        placeholder="Digite nombre del activo"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                      />
                      {/* Mensaje de error manual para nombre */}
                      {errors.nombre && (
                        <div
                          className="text-danger small"
                          style={{
                            marginTop: "-12px",
                            marginBottom: "8px",
                            display: "block",
                            position: "relative",
                            zIndex: 1,
                          }}
                        >
                          <i className="bi bi-exclamation-circle me-1"></i>
                          {errors.nombre}
                        </div>
                      )}
                    </Col>
                    <Col md={6}>
                      <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <label
                            className="form-label fw-bold"
                            style={{ color: "var(--color-navy)" }}
                          >
                            Código <span style={{ color: "red" }}>*</span>
                          </label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleGenerateCode}
                            style={{ whiteSpace: "nowrap" }}
                          >
                            Info Código
                          </Button>
                        </div>
                        <Input
                          type="text"
                          name="codigo"
                          placeholder="Se generará automáticamente"
                          value={formData.codigo}
                          readOnly
                          disabled
                          error={errors.codigo}
                          style={{
                            marginTop: "0",
                            backgroundColor: "#f8f9fa",
                            cursor: "not-allowed",
                          }}
                        />
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Select
                        name="categoria"
                        label="Categoría"
                        placeholder="Seleccione una categoría"
                        options={categoriasOptions}
                        value={formData.categoria}
                        onChange={handleChange}
                        error={errors.categoria}
                        required
                      />
                    </Col>
                    <Col md={6}>
                      <Input
                        type="text"
                        name="estado"
                        label="Estado"
                        value={formData.estado}
                        readOnly
                        disabled
                        style={{
                          backgroundColor: "#f8f9fa",
                          cursor: "not-allowed",
                          color: "black",
                        }}
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col md={12}>
                      <Input
                        type="text"
                        name="ubicacion"
                        label="Ubicación"
                        placeholder="Digite ubicación del activo"
                        value={formData.ubicacion}
                        onChange={handleChange}
                        required
                      />
                      {/* Mensaje de error manual para ubicación */}
                      {errors.ubicacion && (
                        <div
                          className="text-danger small"
                          style={{
                            marginTop: "-12px",
                            marginBottom: "8px",
                            display: "block",
                            position: "relative",
                            zIndex: 1,
                          }}
                        >
                          <i className="bi bi-exclamation-circle me-1"></i>
                          {errors.ubicacion}
                        </div>
                      )}
                    </Col>
                  </Row>

                  <Row>
                    <Col md={12}>
                      <label
                        className="form-label fw-bold"
                        style={{ color: "var(--color-navy)" }}
                      >
                        Descripción <span style={{ color: "red" }}>*</span>
                      </label>
                      <textarea
                        name="descripcion"
                        placeholder="Digite descripción del activo (mínimo 10 caracteres)"
                        value={formData.descripcion}
                        onChange={handleChange}
                        rows={4}
                        required
                        style={{
                          resize: "vertical",
                          width: "100%",
                          padding: "8px 12px",
                          border: errors.descripcion
                            ? "1px solid #dc3545"
                            : "1px solid #ced4da",
                          borderRadius: "4px",
                          fontSize: "14px",
                          minHeight: "100px",
                          backgroundColor: "white",
                          color: "black",
                        }}
                      />
                      {errors.descripcion && (
                        <div className="text-danger small mt-1">
                          {errors.descripcion}
                        </div>
                      )}
                    </Col>
                  </Row>

                  <Row>
                    <Col md={12}>
                      <div className="d-flex justify-content-center gap-3 mt-4">
                        <Button
                          type="button"
                          variant="outline"
                          size="lg"
                          onClick={handleReset}
                          disabled={loading}
                        >
                          Limpiar Formulario
                        </Button>

                        <Button
                          type="submit"
                          variant="primary"
                          size="lg"
                          loading={loading}
                          disabled={loading}
                        >
                          Crear Activo
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default NuevoActivo;
