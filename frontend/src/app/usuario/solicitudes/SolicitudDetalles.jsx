"use client";
import React from "react";
import { Button, Card, Table } from "../../../components/ui";
import { FaArrowLeft, FaShieldAlt, FaInfoCircle, FaEdit } from "react-icons/fa";

const SolicitudDetalles = ({ solicitud, onNavigateBack, onNavigateToModificarActivo }) => {
  if (!solicitud) {
    return (
      <div className="solicitud-detalles-container p-2 p-lg-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onNavigateBack}
          className="mb-3 text-white border-white"
        >
          <FaArrowLeft className="me-2" />
          Volver a mis solicitudes
        </Button>
        <div className="alert alert-warning">
          No se encontró la información de la solicitud
        </div>
      </div>
    );
  }

  // Función para formatear fecha
  const formatFecha = (fechaISO) => {
    if (!fechaISO) return "Pendiente";
    return new Date(fechaISO).toLocaleDateString("es-ES");
  };

  // Función para navegar a Modificar Activo
  const handleCorregirSolicitud = () => {
    console.log("🔄 CLICK en Corregir Solicitud");
    console.log("📋 Solicitud:", solicitud);
    console.log("🔧 onNavigateToModificarActivo existe:", !!onNavigateToModificarActivo);
    console.log("🆔 Activo ID:", solicitud.activoId);
    
    if (onNavigateToModificarActivo && solicitud.activoId) {
   
      const activoParaModificar = {
        id: solicitud.activoId,
        nombre: solicitud.nombreActivo || "Activo por modificar",
      
      };
      console.log("🎯 Llamando a onNavigateToModificarActivo con:", activoParaModificar);
      onNavigateToModificarActivo(activoParaModificar);
    } else {
      console.log("❌ No se puede navegar - falta función o activoId");
    }
  };

  // Datos para la tabla de cambios
  const cambiosTableData =
    solicitud.cambios?.map((cambio, index) => ({
      id: index,
      campo: cambio.campo,
      valorAnterior: cambio.valorAnterior,
      valorModificado: cambio.valorNuevo,
    })) || [];

  // Columnas para la tabla de cambios
  const cambiosTableColumns = [
    {
      key: "campo",
      label: "Campo",
      render: (row) => <strong className="text-dark">{row.campo}</strong>,
    },
    {
      key: "valorAnterior",
      label: "Valor anterior",
      render: (row) => <span className="text-dark">{row.valorAnterior}</span>,
    },
    {
      key: "valorModificado",
      label: "Valor modificado",
      render: (row) => <span className="text-dark">{row.valorModificado}</span>,
    },
  ];

  return (
    <div className="solicitud-detalles-container p-2 p-lg-3">
      {/* Botón volver con texto blanco */}
      <Button
        variant="outline"
        size="sm"
        onClick={onNavigateBack}
        className="mb-3 text-white border-white"
      >
        <FaArrowLeft className="me-2" />
        Volver a mis solicitudes
      </Button>

      {/* Título y código debajo del botón CON BOTÓN CORREGIR SI ES RECHAZADO */}
      <div className="d-flex justify-content-between align-items-start mb-3 mb-lg-4">
        <div className="text-white">
          <h4 className="fw-bold mb-1 h4-responsive">Detalles de Solicitud de Cambio</h4>
          <h6 className="text-white-50 h6-responsive">Código: {solicitud.codigoSolicitud}</h6>
        </div>
        
        {/* BOTÓN CORREGIR SOLICITUD - SOLO SI ESTÁ RECHAZADO */}
        {solicitud.estadoGeneral === "Rechazado" && (
          <Button
            variant="warning"
            size="md"
            onClick={handleCorregirSolicitud}
            className="text-dark fw-bold d-flex align-items-center"
            style={{ 
              backgroundColor: '#ffc107', 
              borderColor: '#ffc107',
              whiteSpace: 'nowrap',
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              fontWeight: '600'
            }}
          >
            <FaEdit className="me-2" size={18} />
            Corregir Solicitud
          </Button>
        )}
      </div>

      <div className="row">
        {/* Columna izquierda - Revisión de Seguridad */}
        <div className="col-12 col-lg-4 mb-3 mb-lg-0">
          <Card className="h-auto" style={{ backgroundColor: '#FFEEEE' }}>
            <div className="card-body p-2 p-lg-3">
              <div className="bg-white p-2 p-lg-3 rounded mb-2 mb-lg-3">
                <h5 className="card-title fw-bold mb-0 text-primary d-flex align-items-center h5-responsive">
                  <FaShieldAlt className="me-2 text-primary" />
                  Revisión de Seguridad
                </h5>
              </div>
              <div className="mb-2 mb-lg-3">
                <label className="form-label fw-semibold small text-dark">
                  Responsable
                </label>
                <p className="mb-1 mb-lg-2 small text-dark">
                  {solicitud.aprobaciones?.seguridad?.responsableId ||
                    "No asignado"}
                </p>
              </div>

              <div className="mb-2 mb-lg-3">
                <label className="form-label fw-semibold small text-dark">
                  Fecha Revisión
                </label>
                <p className="mb-1 mb-lg-2 small text-dark">
                  {formatFecha(solicitud.aprobaciones?.seguridad?.fecha)}
                </p>
              </div>

              <div>
                <label className="form-label fw-semibold small text-dark">
                  Comentario
                </label>
                <p className="small text-dark" style={{ minHeight: "50px" }}>
                  {solicitud.aprobaciones?.seguridad?.comentario ||
                    "Sin comentarios"}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Columna derecha - Tabla de cambios y información */}
        <div className="col-12 col-lg-8 mt-3 mt-lg-0">
          <Card style={{ backgroundColor: '#FFEEEE' }}>
            <div className="card-body p-2 p-lg-3">
              <div className="bg-white p-2 p-lg-3 rounded mb-2 mb-lg-3">
                <h5 className="card-title fw-bold mb-0 text-primary d-flex align-items-center h5-responsive">
                  <FaInfoCircle className="me-2 text-primary" />
                  Información de la Solicitud
                </h5>
              </div>

              {/* Estado general de la solicitud */}
              <div className="mb-3 mb-lg-4 p-2 p-lg-3 rounded" style={{ backgroundColor: '#FFEEEE' }}>
                <div className="row">
                  <div className="col-12 col-md-6 mb-2 mb-md-0">
                    <strong className="text-dark">Estado General:</strong>
                    <span
                      className={`badge ms-2 ${
                        solicitud.estadoGeneral === "Aprobado"
                          ? "bg-success"
                          : solicitud.estadoGeneral === "Rechazado"
                          ? "bg-danger"
                          : "bg-warning"
                      }`}
                    >
                      {solicitud.estadoGeneral}
                    </span>
                  </div>
                  <div className="col-12 col-md-6">
                    <strong className="text-dark">Fecha de Solicitud:</strong>
                    <span className="ms-2 text-dark d-block d-md-inline">
                      {formatFecha(solicitud.fechaCreacion)}
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

              {/* Tabla de cambios realizados */}
              <div className="mb-3 mb-lg-4">
                <h6 className="fw-bold mb-2 mb-lg-3 text-dark h6-responsive">Cambios Realizados</h6>
                <div className="table-responsive">
                  <Table
                    columns={cambiosTableColumns}
                    data={cambiosTableData}
                    className="cambios-table"
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <style jsx>{`
        // Estilos para la tabla de cambios
        :global(.cambios-table table) {
          margin-bottom: 0;
          min-width: 600px;
        }

        :global(.cambios-table th) {
          background-color: #f8f9fa;
          border-bottom: 2px solid #dee2e6;
          color: #000;
          white-space: nowrap;
        }

        :global(.cambios-table td) {
          color: #000;
          word-break: break-word;
        }

        // Estilos responsivos para textos
        @media (max-width: 992px) {
          :global(.h4-responsive) {
            font-size: 1.25rem;
          }
          :global(.h5-responsive) {
            font-size: 1.1rem;
          }
          :global(.h6-responsive) {
            font-size: 0.9rem;
          }
        }

        @media (max-width: 768px) {
          :global(.h4-responsive) {
            font-size: 1.1rem;
          }
          :global(.h5-responsive) {
            font-size: 1rem;
          }
          :global(.h6-responsive) {
            font-size: 0.85rem;
          }
          
          // Ajuste para el botón en móvil
          :global(.solicitud-detalles-container .d-flex) {
            flex-direction: column;
            align-items: flex-start !important;
          }
          
          :global(.solicitud-detalles-container .d-flex .btn) {
            margin-top: 1rem;
            align-self: flex-start;
            width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 576px) {
          :global(.solicitud-detalles-container .d-flex .btn) {
            padding: '0.625rem 1.25rem';
            font-size: '0.9rem';
          }
        }
      `}</style>
    </div>
  );
};

export default SolicitudDetalles;