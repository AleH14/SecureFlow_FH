"use client";
import React, { useState, useEffect } from "react";
import { Button, Card, Table, Modal } from "../../../components/ui";
import Toast from "../../../components/ui/Toast";
import { FaArrowLeft, FaShieldAlt, FaInfoCircle, FaEdit } from "react-icons/fa";

const Revision = ({
  solicitud,
  onNavigateBack,
  onNavigateToModificarActivo,
  onApprove,
  onReject,
  revisionComment: externalComment,
  setRevisionComment: externalSetComment,
  checklist: externalChecklist,
  onChecklistChange: externalChecklistChange,
}) => {
  const [revisionComment, setRevisionComment] = useState(externalComment || "");
  const [checklist, setChecklist] = useState(
    externalChecklist || {
      informacionCompleta: false,
      justificacionClara: false,
      impactoDocumentado: false,
      categoriaAdecuada: false,
    }
  );
  
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("info");

  // Sincronizar con props externos
  useEffect(() => {
    if (externalComment !== undefined) setRevisionComment(externalComment);
  }, [externalComment]);

  useEffect(() => {
    if (externalChecklist) setChecklist(externalChecklist);
  }, [externalChecklist]);

  //Función para manejar cambios en el checklist
  const handleChecklistChange = (key) => {
    const updatedChecklist = { ...checklist, [key]: !checklist[key] };
    setChecklist(updatedChecklist);
    if (externalChecklistChange) externalChecklistChange(key, !checklist[key]);
  };

  // Función para formatear fecha
  const formatFecha = (fechaISO) => {
    if (!fechaISO) return "Pendiente";
    return new Date(fechaISO).toLocaleDateString("es-ES");
  };

  // Generar comentario basado en checklist
  const generateCommentFromChecklist = () => {
    const comments = [];
    
    if (checklist.informacionCompleta) {
      comments.push("✓ Información completa y clara");
    } else {
      comments.push("✗ Información imcompleta o confusa del cambio");
    }
    
    if (checklist.justificacionClara) {
      comments.push("✓ Justificación del cambio adecuada");
    } else {
      comments.push("✗ Justificación no adecauada del cambio");
    }
    
    if (checklist.impactoDocumentado) {
      comments.push("✓ Impacto del cambio documentado");
    } else {
      comments.push("✗ Impacto del cambio no especificado");
    }
    
    if (checklist.categoriaAdecuada) {
      comments.push("✓ Categorización apropiada");
    } else {
      comments.push("✗ Categoría asignada inapropiada");
    }
    
    return comments.join('\n');
  };

  // Manejar limpiar comentario
  const handleClearComment = () => {
    setRevisionComment('');
    if (externalSetComment) externalSetComment('');
  };

  // Manejar usar comentario del checklist
  const handleUseChecklistComment = () => {
    const comment = generateCommentFromChecklist();
    setRevisionComment(comment);
    if (externalSetComment) externalSetComment(comment);
  };

  // Manejar cambio en textarea
  const handleCommentChange = (e) => {
    setRevisionComment(e.target.value);
    if (externalSetComment) externalSetComment(e.target.value);
  };

  // Manejar aprobación con modal
  const handleApproveClick = () => {
    setShowApproveModal(true);
  };

  // Manejar rechazo con modal
  const handleRejectClick = () => {
    setShowRejectModal(true);
  };

  // Mostrar toast y navegar atrás
  const showSuccessToastAndNavigate = (message, variant) => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
    
    // Esperar un momento antes de navegar para que se vea el toast
    setTimeout(() => {
      if (onNavigateBack) onNavigateBack();
    }, 2000);
  };

  // Confirmar aprobación
  const confirmApprove = () => {
    setShowApproveModal(false);
    if (onApprove) {
      onApprove();
    }
    showSuccessToastAndNavigate(
      "Solicitud aprobada exitosamente",
      "success"
    );
  };

  // Confirmar rechazo
  const confirmReject = () => {
    setShowRejectModal(false);
    if (onReject) {
      onReject();
    }
    showSuccessToastAndNavigate(
      "Solicitud rechazada exitosamente",
      "success"
    );
  };

  // Cancelar acción
  const cancelAction = () => {
    setShowApproveModal(false);
    setShowRejectModal(false);
  };

  // Cerrar toast
  const handleCloseToast = () => {
    setShowToast(false);
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

  if (!solicitud) {
    return (
      <div className="revision-container p-2 p-lg-3">
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
          No se encontró la información de la solicitud
        </div>
      </div>
    );
  }

  return (
    <div className="revision-container p-2 p-lg-3">
      {/* Toast de confirmación */}
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
          <h2 className="fw-bold mb-1 h4-responsive">Revisión de Solicitud de Cambio</h2>
          <h6 className="text-white-50 h6-responsive">Código: {solicitud.codigoSolicitud}</h6>
        </div>
        
        {/* Botones de acción para el responsable de seguridad */}
        {solicitud.estadoGeneral === "Pendiente" && (
          <div className="d-flex gap-2">
            <Button
              variant="success"
              size="md"
              onClick={handleApproveClick}
              className="text-white fw-bold"
            >
              Aprobar
            </Button>
            <Button
              variant="danger"
              size="md"
              onClick={handleRejectClick}
              className="text-white fw-bold"
            >
              Rechazar
            </Button>
          </div>
        )}
      </div>

      <div className="row">
        {/* Columna izquierda - CHECKLIST Y COMENTARIOS */}
        <div className="col-12 col-lg-5 mb-3 mb-lg-0">
          {/* Checklist de Evaluación */}
          {solicitud.estadoGeneral === "Pendiente" && (
            <>
              <Card style={{ backgroundColor: '#FFEEEE' }}>
                <div className="card-body p-2 p-lg-3">
                  {/* Encabezado del Checklist */}
                  <div className="bg-warning p-2 p-lg-3 rounded mb-2 mb-lg-3">
                    <h5 className="card-title fw-bold mb-0 text-white d-flex align-items-center h5-responsive">
                      <FaShieldAlt className="me-2" />
                      Checklist de Evaluación
                    </h5>
                  </div>
                  
                  {/* Items del Checklist */}
                  <div className="checklist-items">
                    <div className="checklist-item mb-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={checklist.informacionCompleta}
                          onChange={() => handleChecklistChange('informacionCompleta')}
                          id="check1"
                        />
                        <label className="form-check-label text-dark" htmlFor="check1">
                          <strong>Información completa y clara</strong>
                          <small className="text-muted d-block mt-1">
                            Todos los campos están completos y la descripción permite entender el alcance
                          </small>
                        </label>
                      </div>
                    </div>

                    <div className="checklist-item mb-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={checklist.justificacionClara}
                          onChange={() => handleChecklistChange('justificacionClara')}
                          id="check2"
                        />
                        <label className="form-check-label text-dark" htmlFor="check2">
                          <strong>Justificación adecuada del cambio</strong>
                          <small className="text-muted d-block mt-1">
                            La razón del cambio está bien explicada y es apropiada
                          </small>
                        </label>
                      </div>
                    </div>

                    <div className="checklist-item mb-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={checklist.impactoDocumentado}
                          onChange={() => handleChecklistChange('impactoDocumentado')}
                          id="check3"
                        />
                        <label className="form-check-label text-dark" htmlFor="check3">
                          <strong>Impacto del cambio documentado</strong>
                          <small className="text-muted d-block mt-1">
                            Se especifica cómo afectará la modificación al activo y sus dependencias
                          </small>
                        </label>
                      </div>
                    </div>

                    <div className="checklist-item mb-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={checklist.categoriaAdecuada}
                          onChange={() => handleChecklistChange('categoriaAdecuada')}
                          id="check4"
                        />
                        <label className="form-check-label text-dark" htmlFor="check4">
                          <strong>Categorización apropiada</strong>
                          <small className="text-muted d-block mt-1">
                            La categoría asignada corresponde con la naturaleza del activo
                          </small>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Panel de Comentarios */}
              <Card style={{ backgroundColor: '#FFEEEE' }} className="mt-3">
                <div className="card-body p-2 p-lg-3">
                  <div className="bg-info p-2 p-lg-3 rounded mb-2 mb-lg-3">
                    <h5 className="card-title fw-bold mb-0 text-white d-flex align-items-center h5-responsive">
                      <FaInfoCircle className="me-2" />
                      Comentarios de Revisión
                    </h5>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label fw-semibold small text-dark">
                      <strong>Comentario Final de Revisión</strong>
                    </label>
                    <textarea
                      className="form-control"
                      rows="4"
                      placeholder="Puede usar el comentario generado automáticamente o escribir uno personalizado..."
                      value={revisionComment}
                      onChange={handleCommentChange}
                    />
                    <div className="form-text text-dark">
                      Este comentario será visible para el solicitante y formará parte del registro.
                    </div>
                  </div>

                  <div className="d-flex gap-2 flex-wrap">
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={handleUseChecklistComment}
                    >
                      <FaEdit className="me-1" />
                      Usar Comentario del Checklist
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={handleClearComment}
                    >
                      Limpiar
                    </Button>
                  </div>
                </div>
              </Card>
            </>
          )}
        </div>

        {/* Columna derecha - INFORMACIÓN DE LA SOLICITUD */}
        <div className="col-12 col-lg-7">
          <Card style={{ backgroundColor: '#FFEEEE' }}>
            <div className="card-body p-2 p-lg-3">
              <div className="bg-primary p-2 p-lg-3 rounded mb-2 mb-lg-3">
                <h5 className="card-title fw-bold mb-0 text-white d-flex align-items-center h5-responsive">
                  <FaInfoCircle className="me-2" />
                  Información de la Solicitud y Cambios
                </h5>
              </div>

              {/* Información básica de la solicitud */}
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
                      {solicitud.nombreSolicitante || "No especificado"}
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
                <h6 className="fw-bold mb-2 mb-lg-3 text-dark h6-responsive">Cambios Solicitados</h6>
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

      {/* Modal de confirmación para Aprobar */}
      <Modal
        isOpen={showApproveModal}
        onClose={cancelAction}
        title="Aprobar Solicitud"
        question="¿Estás seguro de que deseas aprobar esta solicitud?"
        showValueBox={true}
        valueBoxTitle="Solicitud a aprobar:"
        valueBoxSubtitle={solicitud ? `${solicitud.codigoSolicitud} - ${solicitud.nombreActivo || "Activo"}` : ""}
        informativeText="Esta acción cambiará el estado de la solicitud a 'Aprobado' y permitirá que continúe el flujo de aprobación."
        cancelText="Cancelar"
        acceptText="Aprobar"
        onCancel={cancelAction}
        onAccept={confirmApprove}
        headerBgColor="#28a745"
        buttonColor="#28a745"
      />

      {/* Modal de confirmación para Rechazar */}
      <Modal
        isOpen={showRejectModal}
        onClose={cancelAction}
        title="Rechazar Solicitud"
        question="¿Estás seguro de que deseas rechazar esta solicitud?"
        showValueBox={true}
        valueBoxTitle="Solicitud a rechazar:"
        valueBoxSubtitle={solicitud ? `${solicitud.codigoSolicitud} - ${solicitud.nombreActivo || "Activo"}` : ""}
        informativeText="Esta acción cambiará el estado de la solicitud a 'Rechazado' y notificará al solicitante. El comentario de revisión será visible para el solicitante."
        cancelText="Cancelar"
        acceptText="Rechazar"
        onCancel={cancelAction}
        onAccept={confirmReject}
        headerBgColor="#dc3545"
        buttonColor="#dc3545"
      />

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

        // Estilos para los checkboxes
        :global(.form-check-input:checked) {
          background-color: #198754;
          border-color: #198754;
        }

        :global(.form-check-input:focus) {
          border-color: #86b7fe;
          outline: 0;
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
        }

        // Estilos responsivos
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
          
          :global(.revision-container .d-flex) {
            flex-direction: column;
            align-items: flex-start !important;
          }
          
          :global(.revision-container .d-flex .btn) {
            margin-top: 1rem;
            align-self: flex-start;
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default Revision;