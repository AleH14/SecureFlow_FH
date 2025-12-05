"use client";

import React, { useState, useEffect } from "react";
import { Table, Card, Button } from "../../../components/ui";
import Toast from "../../../components/ui/Toast";
import { FaInfoCircle, FaShieldAlt, FaArrowLeft } from "react-icons/fa";
import { RequestService } from "@/services";

const RevisionVista = ({ 
  solicitud: initialSolicitud, 
  onNavigateBack 
}) => {
  const [solicitud, setSolicitud] = useState(initialSolicitud);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("info");

  // Cargar datos detallados de la solicitud (misma lógica que en Revision)
  useEffect(() => {
    const loadSolicitudDetails = async () => {
      if (initialSolicitud && initialSolicitud._id) {
        try {
          setLoading(true);
          setError(null);
          const response = await RequestService.getRequestById(initialSolicitud._id);
          
          if (response && response.success && response.data) {
            // Transformar datos del backend al formato del frontend
            const detailedSolicitud = {
              ...initialSolicitud,
              // Datos adicionales del backend
              activo: response.data.activo,
              cambios: response.data.cambios || [],
              solicitante: response.data.solicitante?.nombreCompleto || initialSolicitud.solicitante,
              nombreSolicitante: response.data.solicitante?.nombreCompleto || initialSolicitud.solicitante,
              responsableSeguridad: response.data.responsableSeguridad,
              comentarioSeguridad: response.data.comentarioSeguridad,
              fechaRevision: response.data.fechaRevision,
              tipoOperacion: response.data.tipoOperacion || initialSolicitud.tipoOperacion,
              // Aprobaciones del backend
              aprobaciones: response.data.aprobaciones || initialSolicitud.aprobaciones
            };
            setSolicitud(detailedSolicitud);
          }
        } catch (err) {
          console.error('Error cargando detalles de solicitud (vista):', err);
          setError('Error al cargar los detalles de la solicitud');
          // Mantener la solicitud inicial si falla la carga de detalles
          setSolicitud(initialSolicitud);
        } finally {
          setLoading(false);
        }
      } else {
        setSolicitud(initialSolicitud);
      }
    };

    loadSolicitudDetails();
  }, [initialSolicitud]);

  // Función para formatear fecha
  const formatFecha = (fechaISO) => {
    if (!fechaISO) return "Pendiente";
    return new Date(fechaISO).toLocaleDateString("es-ES");
  };

  // Datos para la tabla de cambios - MODIFICADO PARA CREACIONES
  const cambiosTableData = solicitud?.cambios?.map((cambio, index) => {
    let valorAnterior = cambio.valorAnterior;
    
    // Si es creación, mostrar "Sin valor anterior"
    if (solicitud.tipoOperacion === 'creacion') {
      valorAnterior = "Sin valor anterior";
    }
    // Si no es creación pero el valor anterior está vacío
    else if (!valorAnterior || valorAnterior.trim() === "") {
      valorAnterior = "Vacío";
    }
    
    return {
      id: index,
      campo: cambio.campo,
      valorAnterior: valorAnterior,
      valorModificado: cambio.valorNuevo,
    };
  }) || [];

  // Columnas para la tabla de cambios
  const cambiosTableColumns = [
    {
      key: "campo",
      label: "Campo",
      render: (row) => <strong className="text-dark">{row.campo}</strong>,
      cellStyle: {
        minWidth: "150px",
        maxWidth: "200px"
      }
    },
    {
      key: "valorAnterior",
      label: "Valor anterior",
      render: (row) => {
        // Si es "Sin valor anterior", mostrarlo en gris y cursiva
        if (row.valorAnterior === "Sin valor anterior" || row.valorAnterior === "Vacío") {
          return <span className="text-muted">{row.valorAnterior}</span>;
        }
        return <span className="text-dark">{row.valorAnterior}</span>;
      },
      cellStyle: {
        minWidth: "200px",
        maxWidth: "250px"
      }
    },
    {
      key: "valorModificado",
      label: "Valor modificado",
      render: (row) => <span className="text-dark">{row.valorModificado}</span>,
      cellStyle: {
        minWidth: "200px",
        maxWidth: "250px"
      }
    },
  ];

  // Resto del código se mantiene igual...
  // Cerrar toast
  const handleCloseToast = () => {
    setShowToast(false);
  };

  // Estado de carga
  if (loading) {
    return (
      <div className="revision-vista-container p-2 p-lg-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onNavigateBack}
          className="mb-3 text-white border-white"
        >
          <FaArrowLeft className="me-2" />
          Volver al panel de revisión
        </Button>
        <div className="text-center p-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2 text-white">Cargando detalles de la solicitud...</p>
        </div>
      </div>
    );
  }

  // Estado de error o solicitud no encontrada
  if (error || !solicitud) {
    return (
      <div className="revision-vista-container p-2 p-lg-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onNavigateBack}
          className="mb-3 text-white border-white"
        >
          <FaArrowLeft className="me-2" />
          Volver al panel de revisión
        </Button>
        <div className="alert alert-warning">
          <h5>Error al cargar la solicitud</h5>
          <p>{error || 'No se encontró la información de la solicitud'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="revision-vista-container p-2 p-lg-3">
      {/* Toast de mensajes */}
      {showToast && (
        <Toast
          message={toastMessage}
          variant={toastVariant}
          show={showToast}
          autohide={true}
          delay={3000}
          onClose={handleCloseToast}
        />
      )}

      {/* Botón volver */}
      <Button
        variant="outline"
        size="sm"
        onClick={onNavigateBack}
        className="mb-3 text-white border-white"
      >
        <FaArrowLeft className="me-2" />
        Volver al panel de revisión
      </Button>

      {/* Título y código */}
      <div className="d-flex justify-content-between align-items-start mb-3 mb-lg-4">
        <div className="text-white">
          <h2 className="fw-bold mb-1 h4-responsive">Vista de Revisión de Solicitud</h2>
          <h6 className="text-white-50 h6-responsive">Código: {solicitud.codigoSolicitud}</h6>
        </div>
      </div>

      <div className="row">
        {/* Columna izquierda - Información de revisión */}
        <div className="col-12 col-lg-5 mb-3 mb-lg-0">
          {/* Información de revisión realizada */}
          <Card style={{ backgroundColor: '#FFEEEE' }}>
            <div className="card-body p-2 p-lg-3">
              <div className="bg-info p-2 p-lg-3 rounded mb-2 mb-lg-3">
                <h5 className="card-title fw-bold mb-0 text-white d-flex align-items-center h5-responsive">
                  <FaShieldAlt className="me-2" />
                  Información de Revisión
                </h5>
              </div>

              {/* Responsable de seguridad */}
              {solicitud.responsableSeguridad && (
                <div className="mb-2 mb-lg-3">
                  <label className="form-label fw-semibold small text-dark">Responsable de Seguridad</label>
                  <p className="mb-1 mb-lg-2 small text-dark">
                    {solicitud.responsableSeguridad.nombreCompleto || "No especificado"}
                  </p>
                </div>
              )}

              {/* Fecha de revisión */}
              <div className="mb-2 mb-lg-3">
                <label className="form-label fw-semibold small text-dark">Fecha de Revisión</label>
                <p className="mb-1 mb-lg-2 small text-dark">
                  {formatFecha(solicitud.fechaRevision || solicitud.aprobaciones?.seguridad?.fecha)}
                </p>
              </div>

              {/* Estado */}
              <div className="mb-2 mb-lg-3">
                <label className="form-label fw-semibold small text-dark">Estado Final</label>
                <div>
                  <span className={`badge ${
                    solicitud.estadoGeneral === "Aprobado" ? "bg-success" :
                    solicitud.estadoGeneral === "Rechazado" ? "bg-danger" : "bg-warning"
                  }`}>
                    {solicitud.estadoGeneral}
                  </span>
                </div>
              </div>

              {/* Comentario de revisión */}
              <div>
                <label className="form-label fw-semibold small text-dark">Comentario de Revisión</label>
                <div className="p-2 bg-light rounded">
                  <p className="small text-dark mb-0" style={{ minHeight: "50px" }}>
                    {solicitud.comentarioSeguridad || 
                     solicitud.aprobaciones?.seguridad?.comentario || 
                     "Sin comentarios"}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Columna derecha - Información de la solicitud */}
        <div className="col-12 col-lg-7">
          <Card style={{ backgroundColor: '#FFEEEE' }}>
            <div className="card-body p-2 p-lg-3">
              <div className="bg-primary p-2 p-lg-3 rounded mb-2 mb-lg-3">
                <h5 className="card-title fw-bold mb-0 text-white d-flex align-items-center h5-responsive">
                  <FaInfoCircle className="me-2" />
                  Información de la Solicitud
                </h5>
              </div>

              {/* Información básica */}
              <div className="mb-3 mb-lg-4">
                <div className="row">
                  <div className="col-12 col-md-6 mb-2 mb-md-0">
                    <strong className="text-dark">Fecha de Solicitud:</strong>
                    <span className="ms-2 text-dark d-block d-md-inline">
                      {formatFecha(solicitud.fechaCreacion)}
                    </span>
                  </div>
                  <div className="col-12 col-md-6">
                    <strong className="text-dark">Solicitante:</strong>
                    <span className="ms-2 text-dark d-block d-md-inline">
                      {solicitud.nombreSolicitante || solicitud.solicitante || "No especificado"}
                    </span>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-12 col-md-6 mb-2 mb-md-0">
                    <strong className="text-dark">Tipo de Operación:</strong>
                    <span className="ms-2 text-dark d-block d-md-inline">
                      <span className="badge bg-info ms-1">
                        {solicitud.tipoOperacion === 'creacion' ? 'Creación' :
                         solicitud.tipoOperacion === 'modificacion' ? 'Modificación' :
                         solicitud.tipoOperacion || 'No especificado'}
                      </span>
                    </span>
                  </div>
                  <div className="col-12 col-md-6">
                    <strong className="text-dark">Activo:</strong>
                    <span className="ms-2 text-dark d-block d-md-inline">
                      {solicitud.nombreActivo}
                      {solicitud.activo && (
                        <small className="text-muted d-block">
                          Código: {solicitud.activo.codigo}
                        </small>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Justificación del cambio */}
              <div className="mb-3 mb-lg-4">
                <h6 className="fw-bold mb-2 mb-lg-3 text-dark h6-responsive">
                  Justificación del Cambio
                </h6>
                <Card style={{ backgroundColor: '#FFEEEE' }}>
                  <div className="card-body p-2 p-lg-3">
                    <p className="mb-0 text-dark">{solicitud.justificacion}</p>
                  </div>
                </Card>
              </div>

              {/* Tabla de cambios */}
              <div className="mb-3 mb-lg-4">
                <h6 className="fw-bold mb-2 mb-lg-3 text-dark h6-responsive">Cambios Solicitados</h6>
                {cambiosTableData.length > 0 ? (
                  <div className="table-responsive">
                    <Table
                      columns={cambiosTableColumns}
                      data={cambiosTableData}
                      hoverEffect={true}
                      bordered={true}
                      compact={false}
                    />
                  </div>
                ) : (
                  <div className="alert alert-info">
                    <FaInfoCircle className="me-2" />
                    No hay cambios específicos documentados para esta solicitud.
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RevisionVista;