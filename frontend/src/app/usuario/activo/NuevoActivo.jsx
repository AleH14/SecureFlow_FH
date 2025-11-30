"use client";

import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";
import { Input, Button, Card, Select, Alert } from "../../../components/ui";
import {
  validateActivoForm,
  categoriasOptions,
  estadosOptions,
  generateActivoCode,
} from "./validacionesActivo";

const NuevoActivo = ({ onNavigateBack }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    codigo: "ACT-XXX-000",
    categoria: "",
    descripcion: "",
    ubicacion: "",
    estado: "en evaluación", // Estado por defecto en minúsculas
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

    // Generar código automáticamente cuando se escribe el nombre
    if (name === "nombre" && value.trim().length >= 3) {
      const cleanName = value.replace(/\s/g, "");
      const nombrePrefix = cleanName
        .substring(0, 3)
        .toUpperCase()
        .padEnd(3, "X");
      const randomNumbers = Math.floor(100 + Math.random() * 900);
      const generatedCode = `ACT-${nombrePrefix}-${randomNumbers}`;

      setFormData((prev) => ({
        ...prev,
        codigo: generatedCode,
      }));
    }

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
    if (formData.nombre) {
      const cleanName = formData.nombre.replace(/\s/g, "");
      const nombrePrefix = cleanName
        .substring(0, 3)
        .toUpperCase()
        .padEnd(3, "X");
      const randomNumbers = Math.floor(100 + Math.random() * 900);
      const generatedCode = `ACT-${nombrePrefix}-${randomNumbers}`;

      setFormData((prev) => ({
        ...prev,
        codigo: generatedCode,
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        nombre: "Primero ingresa el nombre del activo para generar el código",
      }));
    }
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
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const nuevoActivo = {
        ...formData,
        version: "v1.0.0",
        fecha_creacion: new Date().toISOString().split("T")[0],
        acciones_disponibles: ["Historial de Versiones"],
      };

      setSuccessMessage(
        `El activo "${formData.nombre}" ha sido creado exitosamente con el código: ${formData.codigo}`
      );

      setFormData({
        nombre: "",
        codigo: "ACT-XXX-000",
        categoria: "",
        descripcion: "",
        ubicacion: "",
        estado: "en evaluación",
      });
      setErrors({});
    } catch (error) {
      setErrors({
        general: "Error al crear el activo. Por favor intenta de nuevo.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      nombre: "",
      codigo: "ACT-XXX-000",
      categoria: "",
      descripcion: "",
      ubicacion: "",
      estado: "en evaluación",
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
                  Todas las modificaciones requieren aprobación del responsable
                  de seguridad. Se creará una solicitud de cambio pendiente de
                  revisión.
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
                            disabled={!formData.nombre}
                            style={{ whiteSpace: "nowrap" }}
                          >
                            Regenerar Código
                          </Button>
                        </div>
                        <Input
                          type="text"
                          name="codigo"
                          placeholder="ACT-AAA-000"
                          value={formData.codigo}
                          readOnly
                          disabled
                          error={errors.codigo}
                          required
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
