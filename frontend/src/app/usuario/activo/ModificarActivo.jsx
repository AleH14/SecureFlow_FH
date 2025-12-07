"use client";

import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { FaArrowLeft, FaChevronDown, FaSearch } from "react-icons/fa";
import { Input, Button, Card, Select } from "../../../components/ui";
import Toast from "../../../components/ui/Toast";
import {
  validateActivoForm,
  categoriasOptions,
} from "./validacionesActivo";
import { ActivoService } from "@/services";

const ModificarActivo = ({ activo, onNavigateBack, onUpdateActivo, onRefreshSolicitudes, cambiosRechazados }) => {
  const estadosOptions = [
    { value: 'Activo', label: 'Activo' },
    { value: 'Inactivo', label: 'Inactivo' },
    { value: 'En Mantenimiento', label: 'En Mantenimiento' },
    { value: 'En Revision', label: 'En Revisión' }
  ];

  const [formData, setFormData] = useState({
    nombre: "",
    codigo: "",
    categoria: "",
    descripcion: "",
    ubicacion: "",
    estado: "",
    responsableId: "",
    responsableNombre: "",
    justificacion: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [usuariosOptions, setUsuariosOptions] = useState([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [loadingUsuarios, setLoadingUsuarios] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showResponsablesList, setShowResponsablesList] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [camposModificados, setCamposModificados] = useState({});
  
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (activo) {
      // Identificar campos que fueron modificados en la solicitud rechazada
      let modificados = {};
      if (cambiosRechazados && Array.isArray(cambiosRechazados)) {
        cambiosRechazados.forEach(cambio => {
          const campo = cambio.campo.toLowerCase();
          modificados[campo] = {
            valorAnterior: cambio.valorAnterior,
            valorNuevo: cambio.valorNuevo
          };
        });
        setCamposModificados(modificados);
      }

      // Para campos modificados, usar valorNuevo; para no modificados, usar valor actual
      setFormData({
        nombre: modificados['nombre'] ? modificados['nombre'].valorNuevo : (activo.nombre || ""),
        codigo: activo.codigo || "",
        categoria: modificados['categoria'] ? modificados['categoria'].valorNuevo : (activo.categoria || ""),
        descripcion: modificados['descripcion'] ? modificados['descripcion'].valorNuevo : (activo.descripcion || ""),
        ubicacion: modificados['ubicacion'] ? modificados['ubicacion'].valorNuevo : (activo.ubicacion || ""),
        estado: modificados['estado'] ? modificados['estado'].valorNuevo : (activo.estado || ""),
        responsableId: modificados['responsableid'] ? modificados['responsableid'].valorNuevo : (activo.responsable?.id || ""),
        responsableNombre: modificados['responsableid'] ? modificados['responsableid'].valorNuevo : (activo.responsable?.nombreCompleto || activo.responsable || ""),
        justificacion: "",
      });
      setSearchTerm(modificados['responsableid'] ? modificados['responsableid'].valorNuevo : (activo.responsable?.nombreCompleto || activo.responsable || ""));
    }
  }, [activo, cambiosRechazados]);

  useEffect(() => {
    cargarResponsablesDisponibles();
    
    // Cerrar dropdown al hacer clic fuera
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowResponsablesList(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filtrar usuarios basado en el término de búsqueda
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setUsuariosFiltrados(usuariosOptions);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = usuariosOptions.filter(usuario =>
        usuario.value.toLowerCase().includes(term) ||
        (usuario.email && usuario.email.toLowerCase().includes(term))
      );
      setUsuariosFiltrados(filtered);
    }
  }, [searchTerm, usuariosOptions]);

  const cargarResponsablesDisponibles = async () => {
    setLoadingUsuarios(true);
    try {
      const response = await ActivoService.getResponsablesDisponibles();
      
      let responsablesData = [];
      
      if (Array.isArray(response)) {
        responsablesData = response;
      } else if (response && response.data && Array.isArray(response.data)) {
        responsablesData = response.data;
      } else if (response && response.success && Array.isArray(response.data)) {
        responsablesData = response.data;
      }
      
      const responsablesFiltrados = responsablesData
        .map(user => ({
          id: user.id || user._id,
          value: user.nombreCompleto || `${user.nombre} ${user.apellido}`,
          label: user.nombreCompleto || `${user.nombre} ${user.apellido}`,
          email: user.email || ''
        }))
        .filter(user => user.value && user.value.trim() !== "")
        .sort((a, b) => a.value.localeCompare(b.value));
      
      setUsuariosOptions(responsablesFiltrados);
      setUsuariosFiltrados(responsablesFiltrados);
      
    } catch (error) {
      setUsuariosOptions([]);
      setUsuariosFiltrados([]);
    } finally {
      setLoadingUsuarios(false);
    }
  };

  const handleBack = () => {
    if (onNavigateBack) {
      onNavigateBack();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "responsableNombre") {
      setSearchTerm(value);
      setFormData((prev) => ({
        ...prev,
        responsableNombre: value,
        responsableId: ""
      }));
      
      // Mostrar lista si hay texto y ocultar si está vacío
      if (value.trim() !== "") {
        setShowResponsablesList(true);
      } else {
        setShowResponsablesList(false);
      }
      
      if (errors.responsableNombre) {
        setErrors((prev) => ({
          ...prev,
          responsableNombre: "",
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    }

    if (showToast) {
      setShowToast(false);
    }
  };

  const handleSelectResponsable = (usuario) => {
    setFormData(prev => ({
      ...prev,
      responsableNombre: usuario.value,
      responsableId: usuario.id
    }));
    setSearchTerm(usuario.value);
    setShowResponsablesList(false);
    
    if (errors.responsableNombre) {
      setErrors(prev => ({
        ...prev,
        responsableNombre: ""
      }));
    }
  };

  const toggleResponsablesList = () => {
    if (!loadingUsuarios) {
      setShowResponsablesList(!showResponsablesList);
      if (!showResponsablesList && inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  // Función para verificar si un campo fue modificado en la solicitud rechazada
  const esCampoModificado = (nombreCampo) => {
    return camposModificados.hasOwnProperty(nombreCampo.toLowerCase());
  };

  // Función para obtener el valor que se intentó cambiar
  const getValorIntentado = (nombreCampo) => {
    const campo = nombreCampo.toLowerCase();
    return camposModificados[campo]?.valorNuevo || null;
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationData = { ...formData };
    delete validationData.justificacion;
    delete validationData.responsableId;
    delete validationData.responsableNombre;

    const newErrors = validateActivoForm(validationData);

    if (!formData.responsableNombre || formData.responsableNombre.trim() === "") {
      newErrors.responsableNombre = "Debe seleccionar un responsable de la lista";
    } else if (!formData.responsableId || formData.responsableId.trim() === "") {
      const usuarioValido = usuariosOptions.find(
        usuario => usuario.value === formData.responsableNombre
      );
      
      if (!usuarioValido) {
        newErrors.responsableNombre = "El responsable seleccionado no es válido. Seleccione de la lista.";
      } else {
        setFormData(prev => ({
          ...prev,
          responsableId: usuarioValido.id
        }));
      }
    }

    if (!formData.justificacion || formData.justificacion.trim() === "") {
      newErrors.justificacion = "La justificación del cambio es requerida";
    } else if (formData.justificacion.length < 10) {
      newErrors.justificacion = "La justificación debe tener al menos 10 caracteres";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const updateData = {
        nombre: formData.nombre.trim(),
        categoria: formData.categoria,
        descripcion: formData.descripcion.trim(),
        ubicacion: formData.ubicacion.trim(),
        estado: formData.estado,
        comentario: formData.justificacion.trim(),
      };

      const objectIdRegex = /^[0-9a-fA-F]{24}$/;
      if (formData.responsableId && objectIdRegex.test(formData.responsableId)) {
        updateData.responsableId = formData.responsableId;
      } else {
        const usuarioReal = usuariosOptions.find(
          usuario => usuario.value === formData.responsableNombre
        );
        if (usuarioReal && usuarioReal.id && objectIdRegex.test(usuarioReal.id)) {
          updateData.responsableId = usuarioReal.id;
        }
      }

      if (!activo.id || !objectIdRegex.test(activo.id)) {
        throw new Error('ID de activo inválido');
      }

      const response = await ActivoService.updateActivo(activo.id, updateData);
      
      // Si no hubo cambios, mostrar mensaje informativo
      if (response.data?.sinCambios) {
        setErrors({
          general: 'No se detectaron cambios en el activo',
        });
        return;
      }
      
      setShowToast(true);
      
      if (onRefreshSolicitudes) {
        onRefreshSolicitudes();
      }

      if (onUpdateActivo && response.activo) {
        onUpdateActivo(response.activo);
      }

      setTimeout(() => {
        if (onNavigateBack) {
          onNavigateBack();
        }
      }, 3000);

    } catch (error) {
      let errorMessage = "Error al actualizar el activo. Por favor intenta de nuevo.";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
        
        if (error.response.data.message.includes('ID de activo inválido')) {
          errorMessage = "El ID del activo no es válido. Por favor, recarga la página e intenta nuevamente.";
        }
      } else if (error.message && error.message.includes('ID de activo inválido')) {
        errorMessage = "El ID del activo no es válido. Por favor, recarga la página e intenta nuevamente.";
      }
      
      setErrors({
        general: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (activo) {
      setFormData({
        nombre: activo.nombre || "",
        codigo: activo.codigo || "",
        categoria: activo.categoria || "",
        descripcion: activo.descripcion || "",
        ubicacion: activo.ubicacion || "",
        estado: activo.estado || "",
        responsableId: activo.responsable?.id || "",
        responsableNombre: activo.responsable?.nombreCompleto || activo.responsable || "",
        justificacion: "",
      });
      setSearchTerm(activo.responsable?.nombreCompleto || activo.responsable || "");
    }
    setErrors({});
    setShowToast(false);
    setShowResponsablesList(false);
  };

  if (!activo) {
    return (
      <div className="modificar-activo-page">
        <Button onClick={handleBack}>
          <FaArrowLeft className="me-2" />
          Volver al inventario
        </Button>
      </div>
    );
  }

  return (
    <>
      <Toast
        show={showToast}
        message="¡Solicitud de modificación enviada exitosamente!"
        variant="success"
        autohide={true}
        delay={3000}
        onClose={() => setShowToast(false)}
      />
      
      <div className="modificar-activo-page">
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

        <div className="user-header">
          <div className="user-header-text">
            <h2 style={{ color: "white" }}>Modificar Activo de Información</h2>
            <div style={{ color: "white" }}>
              <span style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
                Código: {activo.codigo}
              </span>
            </div>
          </div>
        </div>

        <Container fluid>
          <Row className="justify-content-center">
            <Col xs={12} lg={8} xl={6}>
              <Card className="shadow-lg" style={{ backgroundColor: "#FFEEEE" }}>
                <Card.Body className="p-4">
                  <p className="text-muted text-center">
                    Panel de modificación de activo - Modifique la información
                    requerida
                  </p>

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
                    de seguridad. Se creará automáticamente una solicitud de cambio pendiente de
                    revisión. Solo se pueden modificar activos de los cuales eres responsable.
                  </div>

                  {errors.general && (
                    <div
                      className="p-3 mb-4 rounded"
                      style={{
                        backgroundColor: "#f8d7da",
                        color: "#721c24",
                        fontSize: "0.9rem"
                      }}
                    >
                      <i className="bi bi-exclamation-triangle-fill me-2"></i>
                      {errors.general}
                    </div>
                  )}

                  {cambiosRechazados && cambiosRechazados.length > 0 && (
                    <div
                      className="p-3 mb-4 rounded"
                      style={{
                        backgroundColor: "#fff3cd",
                        color: "#856404",
                        fontSize: "0.9rem"
                      }}
                    >
                      <i className="bi bi-info-circle-fill me-2"></i>
                      <strong>Solicitud rechazada:</strong> Los campos marcados fueron modificados en la solicitud rechazada. 
                      Los valores actuales (guardados en la base de datos) se muestran en los campos.
                    </div>
                  )}

                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={12}>
                        <div className="mb-3">
                          <Input
                            type="text"
                            name="nombre"
                            label={
                              <>
                                Nombre del Activo
                                {esCampoModificado('nombre') && (
                                  <span 
                                    className="ms-2 badge" 
                                    style={{backgroundColor: "#ffc107", color: "#000", fontSize: "0.7rem"}}
                                    title={`Valor intentado: ${getValorIntentado('nombre')}`}
                                  >
                                    Campo modificado en solicitud rechazada
                                  </span>
                                )}
                              </>
                            }
                            placeholder="Digite nombre del activo"
                            value={formData.nombre}
                            onChange={handleChange}
                            error={errors.nombre}
                            required
                          />
                        </div>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <div className="mb-3">
                          <Select
                            name="categoria"
                            label={
                              <>
                                Categoría
                                {esCampoModificado('categoria') && (
                                  <span 
                                    className="ms-2 badge" 
                                    style={{backgroundColor: "#ffc107", color: "#000", fontSize: "0.7rem"}}
                                    title={`Valor intentado: ${getValorIntentado('categoria')}`}
                                  >
                                    Modificado
                                  </span>
                                )}
                              </>
                            }
                            placeholder="Seleccione una categoría"
                            options={categoriasOptions}
                            value={formData.categoria}
                            onChange={(e) => handleSelectChange("categoria", e.target.value)}
                            error={errors.categoria}
                            required
                          />
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-3">
                          <Select
                            name="estado"
                            label={
                              <>
                                Estado
                                {esCampoModificado('estado') && (
                                  <span 
                                    className="ms-2 badge" 
                                    style={{backgroundColor: "#ffc107", color: "#000", fontSize: "0.7rem"}}
                                    title={`Valor intentado: ${getValorIntentado('estado')}`}
                                  >
                                    Modificado
                                  </span>
                                )}
                              </>
                            }
                            placeholder="Seleccione un estado"
                            options={estadosOptions}
                            value={formData.estado}
                            onChange={(e) => handleSelectChange("estado", e.target.value)}
                            error={errors.estado}
                            required
                          />
                        </div>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <div className="mb-3">
                          <Input
                            type="text"
                            name="ubicacion"
                            label={
                              <>
                                Ubicación
                                {esCampoModificado('ubicacion') && (
                                  <span 
                                    className="ms-2 badge" 
                                    style={{backgroundColor: "#ffc107", color: "#000", fontSize: "0.7rem"}}
                                    title={`Valor intentado: ${getValorIntentado('ubicacion')}`}
                                  >
                                    Modificado
                                  </span>
                                )}
                              </>
                            }
                            placeholder="Digite ubicación del activo"
                            value={formData.ubicacion}
                            onChange={handleChange}
                            error={errors.ubicacion}
                            required
                          />
                        </div>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3 position-relative" ref={dropdownRef}>
                          <Form.Label className="fw-bold" style={{ color: "var(--color-navy)" }}>
                            Responsable <span style={{ color: "red" }}>*</span>
                            {esCampoModificado('responsableid') && (
                              <span 
                                className="ms-2 badge" 
                                style={{backgroundColor: "#ffc107", color: "#000", fontSize: "0.7rem"}}
                              >
                                Modificado
                              </span>
                            )}
                          </Form.Label>
                          
                          <div className="input-wrapper">
                            <div className="input-icon-left">
                              <FaSearch className="text-muted" />
                            </div>
                            <Form.Control
                              ref={inputRef}
                              type="text"
                              id="responsableNombre"
                              name="responsableNombre"
                              className="custom-input has-left-icon"
                              value={formData.responsableNombre}
                              onChange={handleChange}
                              placeholder="Buscar responsable..."
                              required
                              disabled={loadingUsuarios}
                              isInvalid={!!errors.responsableNombre}
                              style={{
                                padding: "8px 12px",
                                paddingLeft: "40px",
                                fontSize: "14px",
                                backgroundColor: "white",
                                color: "black",
                              }}
                            />
                            <div className="input-icon-right">
                              <button
                                type="button"
                                className="btn btn-link p-0 border-0 bg-transparent"
                                onClick={toggleResponsablesList}
                                disabled={loadingUsuarios}
                                style={{
                                  color: "#6c757d",
                                  cursor: loadingUsuarios ? "not-allowed" : "pointer"
                                }}
                              >
                                <FaChevronDown className={showResponsablesList ? "rotate-180" : ""} />
                              </button>
                            </div>
                          </div>
                          
                          {showResponsablesList && usuariosFiltrados.length > 0 && (
                            <div 
                              className="position-absolute w-100 mt-1 bg-white border rounded shadow-lg"
                              style={{ 
                                zIndex: 1000, 
                                maxHeight: "250px", 
                                overflowY: "auto",
                                top: "100%",
                                left: 0
                              }}
                            >
                              <div className="px-3 py-2 border-bottom bg-light">
                                <small className="text-muted">
                                  {usuariosFiltrados.length} de {usuariosOptions.length} responsables
                                </small>
                              </div>
                              
                              {usuariosFiltrados.map((usuario) => (
                                <div
                                  key={usuario.id}
                                  className="px-3 py-2 hover-bg-light cursor-pointer"
                                  onClick={() => handleSelectResponsable(usuario)}
                                  style={{
                                    borderBottom: "1px solid #f0f0f0",
                                    cursor: "pointer",
                                    transition: "background-color 0.2s"
                                  }}
                                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
                                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                                >
                                  <div className="fw-medium">{usuario.label}</div>
                                  {usuario.email && (
                                    <div className="text-muted small">{usuario.email}</div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {showResponsablesList && usuariosFiltrados.length === 0 && (
                            <div 
                              className="position-absolute w-100 mt-1 bg-white border rounded shadow-lg"
                              style={{ 
                                zIndex: 1000, 
                                top: "100%",
                                left: 0
                              }}
                            >
                              <div className="px-3 py-3 text-center text-muted">
                                <i className="bi bi-search me-2"></i>
                                No se encontraron responsables con &quot;{searchTerm}&quot;
                              </div>
                            </div>
                          )}
                          
                          {errors.responsableNombre && (
                            <Form.Control.Feedback type="invalid" className="d-block">
                              <i className="bi bi-exclamation-circle me-1"></i>
                              {errors.responsableNombre}
                            </Form.Control.Feedback>
                          )}
                          
                          {loadingUsuarios && (
                            <div className="text-info small mt-1">
                              <i className="bi bi-hourglass-split me-1"></i>
                              Cargando lista de responsables...
                            </div>
                          )}
                          
                          <input 
                            type="hidden" 
                            name="responsableId" 
                            value={formData.responsableId} 
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={12}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-bold" style={{ color: "var(--color-navy)" }}>
                            Descripción <span style={{ color: "red" }}>*</span>
                            {esCampoModificado('descripcion') && (
                              <span 
                                className="ms-2 badge" 
                                style={{backgroundColor: "#ffc107", color: "#000", fontSize: "0.7rem"}}
                              >
                                Modificado
                              </span>
                            )}
                          </Form.Label>
                          <Form.Control
                            as="textarea"
                            name="descripcion"
                            placeholder="Digite descripción del activo"
                            value={formData.descripcion}
                            onChange={handleChange}
                            rows={4}
                            required
                            isInvalid={!!errors.descripcion}
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
                            <Form.Control.Feedback type="invalid" className="d-block">
                              <i className="bi bi-exclamation-circle me-1"></i>
                              {errors.descripcion}
                            </Form.Control.Feedback>
                          )}
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={12}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-bold" style={{ color: "var(--color-navy)" }}>
                            Justificación del Cambio <span style={{ color: "red" }}>*</span>
                          </Form.Label>
                          <Form.Control
                            as="textarea"
                            name="justificacion"
                            placeholder="Digite la justificación para los cambios realizados en el activo"
                            value={formData.justificacion}
                            onChange={handleChange}
                            rows={3}
                            required
                            isInvalid={!!errors.justificacion}
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
                            <Form.Control.Feedback type="invalid" className="d-block">
                              <i className="bi bi-exclamation-circle me-1"></i>
                              {errors.justificacion}
                            </Form.Control.Feedback>
                          )}
                        </Form.Group>
                      </Col>
                    </Row>

                    <input type="hidden" name="codigo" value={formData.codigo} />

                    <Row>
                      <Col md={12}>
                        <div className="d-flex justify-content-center gap-3 mt-4">
                          <Button
                            type="button"
                            variant="outline"
                            size="lg"
                            onClick={handleReset}
                            disabled={loading || loadingUsuarios}
                          >
                            Restablecer Cambios
                          </Button>

                          <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            loading={loading}
                            disabled={loading || loadingUsuarios}
                          >
                            {loading ? 'Enviando...' : 'Actualizar Activo'}
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      
      <style jsx>{`
        .rotate-180 {
          transform: rotate(180deg);
          transition: transform 0.3s ease;
        }
        .hover-bg-light:hover {
          background-color: #f8f9fa !important;
        }
        .cursor-pointer {
          cursor: pointer;
        }
        .input-wrapper {
          position: relative;
        }
        .input-icon-left {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          color: #6c757d;
        }
        .input-icon-right {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
        }
        .custom-input.has-left-icon {
          padding-left: 40px !important;
        }
        .custom-input.has-right-icon {
          padding-right: 40px !important;
        }
      `}</style>
    </>
  );
};

export default ModificarActivo;