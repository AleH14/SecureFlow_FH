"use client";

import React from "react";
import { Table, Card, Button } from "../../../components/ui"; 
import { FaInfoCircle, FaShieldAlt, FaArrowLeft } from "react-icons/fa"; 

const RevisionVista = ({ solicitud, onNavigateBack }) => { 
  // Función para formatear fecha
  const formatFecha = (fechaISO) => {
    if (!fechaISO) return "Pendiente";
    return new Date(fechaISO).toLocaleDateString("es-ES");
  };

  // Datos para la tabla de cambios
  const cambiosTableData =
    solicitud.cambios?.map((cambio, index) => ({
      id: index,
      campo: cambio.campo,
      valorAnterior: cambio.valorAnterior,
      valorModificado: cambio.valorNuevo,
    })) || [];

  // Columnas para la tabla de cambios - usando cellStyle para anchos
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
      render: (row) => <span className="text-dark">{row.valorAnterior}</span>,
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

  if (!solicitud) {
    return (
      <div className="revision-vista-container p-2 p-lg-3">
        <div className="alert alert-warning">
          No se encontró la información de la solicitud
        </div>
      </div>
    );
  }

  return (
    <div className="revision-vista-container p-2 p-lg-3">
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

      {/* Título y código*/}
      <div className="d-flex justify-content-between align-items-start mb-3 mb-lg-4">
        <div className="text-white">
          <h2 className="fw-bold mb-1 h4-responsive">Revisión de Solicitud de Cambio</h2>
          <h6 className="text-white-50 h6-responsive">Código: {solicitud.codigoSolicitud}</h6>
        </div>
      </div>

      <div className="row">
        {/* Columna izquierda */}
        <div className="col-12 col-lg-5 mb-3 mb-lg-0">
          {solicitud.aprobaciones?.seguridad && (
            <Card style={{ backgroundColor: '#FFEEEE' }}>
              <div className="card-body p-2 p-lg-3">
                {/* Revision realizada */}
                <div className="bg-info p-2 p-lg-3 rounded mb-2 mb-lg-3">
                  <h5 className="card-title fw-bold mb-0 text-white d-flex align-items-center h5-responsive">
                    <FaShieldAlt className="me-2" />
                    Revisión Realizada
                  </h5>
                </div>

                <div className="mb-2 mb-lg-3">
                  <label className="form-label fw-semibold small text-dark">Fecha Revisión</label>
                  <p className="mb-1 mb-lg-2 small text-dark">
                    {formatFecha(solicitud.aprobaciones.seguridad.fecha)}
                  </p>
                </div>

                <div className="mb-2 mb-lg-3">
                  <label className="form-label fw-semibold small text-dark">Estado Final</label>
                  <div>
                    {/* Usando badges de Bootstrap */}
                    <span className={`badge ms-2 ${
                      solicitud.estadoGeneral === "Aprobado"
                        ? "bg-success"
                        : solicitud.estadoGeneral === "Rechazado"
                        ? "bg-danger"
                        : "bg-warning"
                    }`}>
                      {solicitud.estadoGeneral}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="form-label fw-semibold small text-dark">Comentario</label>
                  <p className="small text-dark" style={{ minHeight: "50px" }}>
                    {solicitud.aprobaciones.seguridad.comentario || "Sin comentarios"}
                  </p>
                </div>
              </div>
            </Card>
          )}
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
                      {solicitud.solicitante || "No especificado"}
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

              {/* Tabla  */}
              <div className="mb-3 mb-lg-4">
                <h6 className="fw-bold mb-2 mb-lg-3 text-dark h6-responsive">Cambios Solicitados</h6>
                <div className="table-responsive">
                  <Table
                    columns={cambiosTableColumns}
                    data={cambiosTableData}
                    hoverEffect={true}
                    bordered={true}
                    compact={false}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RevisionVista;