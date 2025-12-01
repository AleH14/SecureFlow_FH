"use client";

import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";
import { Input, Button, Card, Select, Alert } from "../../../components/ui";
import {
  validateActivoForm,
  categoriasOptions,
  estadosOptions,
} from "./validacionesActivo";

const ModificarActivo = ({ activo, onNavigateBack, onUpdateActivo }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    codigo: "",
    categoria: "",
    descripcion: "",
    ubicacion: "",
    estado: "",
    responsable: "",
    justificacion: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Cargar datos del activo cuando el componente se monta o cuando cambia el prop 'activo'
  useEffect(() => {
    if (activo) {
      setFormData({
        nombre: activo.nombre || "",
        codigo: activo.codigo || "",
        categoria: activo.categoria || "",
        descripcion: activo.descripcion || "",
        ubicacion: activo.ubicacion || "",
        estado: activo.estado || "",
        responsable: activo.responsable || "",
        justificacion: "",
      });
    }
  }, [activo]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar campos requeridos (excepto justificación que se valida después)
    const validationData = { ...formData };
    delete validationData.justificacion; // Remover justificación de la validación inicial

    const newErrors = validateActivoForm(validationData);

    // Validar justificación por separado
    if (!formData.justificacion || formData.justificacion.trim() === "") {
      newErrors.justificacion = "La justificación del cambio es requerida";
    } else if (formData.justificacion.length < 10) {
      newErrors.justificacion =
        "La justificación debe tener al menos 10 caracteres";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create updated activo object
      const activoActualizado = {
        ...formData,
        version: activo?.version || "v1.0.0",
        fecha_actualizacion: new Date().toISOString().split("T")[0],
        acciones_disponibles: activo?.acciones_disponibles || [
          "Historial de Versiones",
        ],
        justificacion_cambio: formData.justificacion,
      };

      console.log("Activo actualizado:", activoActualizado);

      // Si se proporcionó la función onUpdateActivo, llamarla
      if (onUpdateActivo) {
        onUpdateActivo(activoActualizado);
      }

      setSuccessMessage(
        `El activo "${formData.nombre}" ha sido actualizado exitosamente`
      );
    } catch (error) {
      console.error("Error al actualizar activo:", error);
      setErrors({
        general: "Error al actualizar el activo. Por favor intenta de nuevo.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    // Reset to original activo data
    if (activo) {
      setFormData({
        nombre: activo.nombre || "",
        codigo: activo.codigo || "",
        categoria: activo.categoria || "",
        descripcion: activo.descripcion || "",
        ubicacion: activo.ubicacion || "",
        estado: activo.estado || "",
        responsable: activo.responsable || "",
        justificacion: "",
      });
    }
    setErrors({});
    setSuccessMessage("");
  };

  if (!activo) {
    return (
      <div className="modificar-activo-page">
        <Alert variant="warning">
          No se ha seleccionado ningún activo para modificar.
        </Alert>
        <Button onClick={handleBack}>
          <FaArrowLeft className="me-2" />
          Volver al inventario
        </Button>
      </div>
    );
  }

  return (
    <div className="modificar-activo-page">
      {/* Botón volver */}
      <div className="mb-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleBack}
          className="d-flex align-items-center"
          style={{ color: "white", borderColor: "white" }}
        >
          <FaArrowLeft className="me-2" />
          Volver al inventario
        </Button>
      </div>

      {/* Título con código y versión del activo en blanco */}
      <div className="user-header">
        <div className="user-header-text">
          <h2 style={{ color: "white" }}>Modificar Activo de Información</h2>
          <div style={{ color: "white" }}>
            <span style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
              Código: {activo.codigo}
            </span>
            <span style={{ fontSize: "1rem", marginLeft: "1rem" }}>
              Versión: {activo.version || "v1.0.0"}
            </span>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <Container fluid>
        <Row className="justify-content-center">
          <Col xs={12} lg={8} xl={6}>
            <Card className="shadow-lg" style={{ backgroundColor: "#FFEEEE" }}>
              <Card.Body className="p-4">
                <p className="text-muted text-center">
                  Panel de modificación de activo - Modifique la información
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
                  {/* Primera fila: Nombre */}
                  <Row>
                    <Col md={12}>
                      <Input
                        type="text"
                        name="nombre"
                        label="Nombre del Activo"
                        placeholder="Digite nombre del activo"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                      />
                      {errors.nombre && (
                        <div
                          className="text-danger small"
                          style={{ marginTop: "2px", marginBottom: "0" }}
                        >
                          <i className="bi bi-exclamation-circle me-1"></i>
                          {errors.nombre}
                        </div>
                      )}
                    </Col>
                  </Row>

                  {/* Segunda fila: Categoría y Estado */}
                  <Row>
                    <Col md={6}>
                      <Select
                        name="categoria"
                        label="Categoría"
                        placeholder="Seleccione una categoría"
                        options={categoriasOptions}
                        value={formData.categoria}
                        onChange={handleChange}
                        required
                      />
                      {errors.categoria && (
                        <div
                          className="text-danger small"
                          style={{ marginTop: "2px", marginBottom: "0" }}
                        >
                          <i className="bi bi-exclamation-circle me-1"></i>
                          {errors.categoria}
                        </div>
                      )}
                    </Col>
                    <Col md={6}>
                      <Select
                        name="estado"
                        label="Estado"
                        placeholder="Seleccione un estado"
                        options={estadosOptions}
                        value={formData.estado}
                        onChange={handleChange}
                        required
                      />
                      {errors.estado && (
                        <div
                          className="text-danger small"
                          style={{ marginTop: "2px", marginBottom: "0" }}
                        >
                          <i className="bi bi-exclamation-circle me-1"></i>
                          {errors.estado}
                        </div>
                      )}
                    </Col>
                  </Row>

                  {/* Tercera fila: Ubicación y Responsable */}
                  <Row>
                    <Col md={6}>
                      <Input
                        type="text"
                        name="ubicacion"
                        label="Ubicación"
                        placeholder="Digite ubicación del activo"
                        value={formData.ubicacion}
                        onChange={handleChange}
                        required
                      />
                      {errors.ubicacion && (
                        <div
                          className="text-danger small"
                          style={{ marginTop: "2px", marginBottom: "0" }}
                        >
                          <i className="bi bi-exclamation-circle me-1"></i>
                          {errors.ubicacion}
                        </div>
                      )}
                    </Col>
                    <Col md={6}>
                      <Input
                        type="text"
                        name="responsable"
                        label="Responsable"
                        placeholder="Digite nombre del responsable"
                        value={formData.responsable}
                        onChange={handleChange}
                        required
                      />
                    </Col>
                  </Row>

                  {/* Cuarta fila: Descripción */}
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
                        placeholder="Digite descripción del activo"
                        value={formData.descripcion}
                        onChange={handleChange}
                        rows={4}
                        required
                        style={{
                          resize: "vertical",
                          width: "100%",
                          padding: "8px 12px",
                          border: "1px solid #ced4da",
                          borderRadius: "4px",
                          fontSize: "14px",
                          minHeight: "100px",
                          backgroundColor: "white",
                          color: "black",
                        }}
                      />
                      {errors.descripcion && (
                        <div className="text-danger small mt-1">
                          <i className="bi bi-exclamation-circle me-1"></i>
                          {errors.descripcion}
                        </div>
                      )}
                    </Col>
                  </Row>

                  {/* Quinta fila: Justificación del cambio */}
                  <Row>
                    <Col md={12}>
                      <label
                        className="form-label fw-bold"
                        style={{ color: "var(--color-navy)" }}
                      >
                        Justificación del Cambio{" "}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <textarea
                        name="justificacion"
                        placeholder="Digite la justificación para los cambios realizados en el activo"
                        value={formData.justificacion}
                        onChange={handleChange}
                        rows={3}
                        required
                        style={{
                          resize: "vertical",
                          width: "100%",
                          padding: "8px 12px",
                          border: "1px solid #ced4da",
                          borderRadius: "4px",
                          fontSize: "14px",
                          minHeight: "80px",
                          backgroundColor: "white",
                          color: "black",
                        }}
                      />
                      {errors.justificacion && (
                        <div className="text-danger small mt-1">
                          <i className="bi bi-exclamation-circle me-1"></i>
                          {errors.justificacion}
                        </div>
                      )}
                    </Col>
                  </Row>

                  {/* Información de solo lectura - Código oculto pero presente para validación */}
                  <input type="hidden" name="codigo" value={formData.codigo} />

                  {/* Botones */}
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
                          Restablecer Cambios
                        </Button>

                        <Button
                          type="submit"
                          variant="primary"
                          size="lg"
                          loading={loading}
                          disabled={loading}
                        >
                          Actualizar Activo
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

export default ModificarActivo;
