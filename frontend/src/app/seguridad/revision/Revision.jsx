"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Button, Card, Modal } from "../../../components/ui";
import Table from "../../../components/ui/Table";
import Toast from "../../../components/ui/Toast";
import { FaArrowLeft, FaShieldAlt, FaInfoCircle, FaEdit } from "react-icons/fa";
import { RequestService } from "@/services";

const Revision = ({
  solicitud: initialSolicitud,
  onNavigateBack,
  onApprove,
  onReject,
  revisionComment: externalComment,
  setRevisionComment: externalSetComment,
  checklist: externalChecklist,
  onChecklistChange: externalChecklistChange,
}) => {
  const [solicitud, setSolicitud] = useState(initialSolicitud);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submittingReview, setSubmittingReview] = useState(false);
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

  // Función para obtener nombre del responsable
 const getNombreResponsable = useCallback(
  (responsableData) => {
    if (!responsableData) return "No asignado";

    // Si ya es un objeto con nombre completo
    if (typeof responsableData === "object") {
      if (responsableData.nombreCompleto) {
        return responsableData.nombreCompleto;
      }
      if (responsableData.nombre && responsableData.apellido) {
        return `${responsableData.nombre} ${responsableData.apellido}`;
      }
      // Si es un objeto pero no tiene nombre, podría ser el ID
      if (responsableData._id) {
        return responsableData._id;
      }
    }

    // Si es un string (ID), intentar buscar en los datos disponibles
    if (typeof responsableData === "string") {
      // Buscar en el responsable actual del activo
      if (solicitud.activo?.responsableId) {
        const responsable = solicitud.activo.responsableId;
        if (responsable._id === responsableData || responsable.id === responsableData) {
          return (
            responsable.nombreCompleto ||
            `${responsable.nombre} ${responsable.apellido}`
          );
        }
      }

      // Buscar en los cambios para ver si hay información del nuevo responsable
      if (solicitud.cambios) {
        for (const cambio of solicitud.cambios) {
          if (cambio.campo === "responsableId") {
            // Si este cambio contiene información de responsable
            if (cambio.responsableInfo) {
              return (
                cambio.responsableInfo.nombreCompleto ||
                `${cambio.responsableInfo.nombre} ${cambio.responsableInfo.apellido}`
              );
            }
          }
        }
      }

      // Si no se encuentra, mostrar ID truncado
      return responsableData;
    }

    return "No asignado";
  },
  [solicitud]
);

  // Cargar datos detallados de la solicitud
  useEffect(() => {
    const loadData = async () => {
      if (initialSolicitud && initialSolicitud._id) {
        try {
          setLoading(true);
          setError(null);

          // Cargar detalles de la solicitud
          const solicitudResponse = await RequestService.getRequestById(
            initialSolicitud._id
          );

          if (solicitudResponse?.success && solicitudResponse.data) {
            const detailedSolicitud = {
              ...initialSolicitud,
              activo: solicitudResponse.data.activo,
              cambios: solicitudResponse.data.cambios || [],
              solicitante:
                solicitudResponse.data.solicitante?.nombreCompleto ||
                initialSolicitud.solicitante,
              nombreSolicitante:
                solicitudResponse.data.solicitante?.nombreCompleto ||
                initialSolicitud.solicitante,
              responsableSeguridad: solicitudResponse.data.responsableSeguridad,
              comentarioSeguridad: solicitudResponse.data.comentarioSeguridad,
              fechaRevision: solicitudResponse.data.fechaRevision,
              tipoOperacion:
                solicitudResponse.data.tipoOperacion ||
                initialSolicitud.tipoOperacion,
            };
            setSolicitud(detailedSolicitud);
          }
        } catch (err) {
          console.error("Error cargando datos:", err);
          setError("Error al cargar los detalles de la solicitud");
          setSolicitud(initialSolicitud);
        } finally {
          setLoading(false);
        }
      } else {
        setSolicitud(initialSolicitud);
      }
    };

    loadData();
  }, [initialSolicitud]);

  // Sincronizar con props externos
  useEffect(() => {
    if (externalComment !== undefined) setRevisionComment(externalComment);
    if (externalChecklist) setChecklist(externalChecklist);
  }, [externalComment, externalChecklist]);

  // Funciones del checklist
  const handleChecklistChange = useCallback(
    (key) => {
      const updatedChecklist = { ...checklist, [key]: !checklist[key] };
      setChecklist(updatedChecklist);
      if (externalChecklistChange)
        externalChecklistChange(key, !checklist[key]);
    },
    [checklist, externalChecklistChange]
  );

  const generateCommentFromChecklist = useCallback(() => {
    const comments = [];
    const items = {
      informacionCompleta: "Información completa y clara",
      justificacionClara: "Justificación del cambio adecuada",
      impactoDocumentado: "Impacto del cambio documentado",
      categoriaAdecuada: "Categorización apropiada",
    };

    Object.entries(items).forEach(([key, text]) => {
      comments.push(checklist[key] ? `✓ ${text}` : `✗ ${text}`);
    });

    return comments.join("\n");
  }, [checklist]);

  const handleClearComment = useCallback(() => {
    setRevisionComment("");
    if (externalSetComment) externalSetComment("");
  }, [externalSetComment]);

  const handleUseChecklistComment = useCallback(() => {
    const comment = generateCommentFromChecklist();
    setRevisionComment(comment);
    if (externalSetComment) externalSetComment(comment);
  }, [generateCommentFromChecklist, externalSetComment]);

  const handleCommentChange = useCallback(
    (e) => {
      setRevisionComment(e.target.value);
      if (externalSetComment) externalSetComment(e.target.value);
    },
    [externalSetComment]
  );

  // Funciones de revisión
  const handleApproveClick = () => setShowApproveModal(true);
  const handleRejectClick = () => setShowRejectModal(true);

  const showSuccessToastAndNavigate = useCallback(
    (message, variant) => {
      setToastMessage(message);
      setToastVariant(variant);
      setShowToast(true);
      setTimeout(() => {
        if (onNavigateBack) onNavigateBack();
      }, 2000);
    },
    [onNavigateBack]
  );

  const processReview = async (estado) => {
    if (!revisionComment.trim()) {
      setToastMessage("El comentario de revisión es requerido");
      setToastVariant("warning");
      setShowToast(true);
      return false;
    }

    try {
      setSubmittingReview(true);
      const response = await RequestService.reviewRequest(
        solicitud._id,
        estado,
        revisionComment
      );

      setSolicitud((prev) => ({
        ...prev,
        estadoGeneral: estado,
        comentarioSeguridad: revisionComment,
        fechaRevision: new Date().toISOString(),
        responsableSeguridad: { nombreCompleto: "Responsable de Seguridad" },
      }));

      estado === "Aprobado" && onApprove?.();
      estado === "Rechazado" && onReject?.();

      showSuccessToastAndNavigate(
        `Solicitud ${estado.toLowerCase()} exitosamente`,
        "success"
      );
      return true;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        `Error al ${estado.toLowerCase()} la solicitud`;
      setToastMessage(errorMessage);
      setToastVariant("error");
      setShowToast(true);
      return false;
    } finally {
      setSubmittingReview(false);
    }
  };

  const confirmApprove = () => {
    setShowApproveModal(false);
    processReview("Aprobado");
  };

  const confirmReject = () => {
    setShowRejectModal(false);
    processReview("Rechazado");
  };

  const cancelAction = () => {
    setShowApproveModal(false);
    setShowRejectModal(false);
  };

  const handleCloseToast = () => setShowToast(false);
  const formatFecha = (fechaISO) =>
    fechaISO ? new Date(fechaISO).toLocaleDateString("es-ES") : "Pendiente";

// Datos para la tabla de cambios
const cambiosTableData =
  solicitud.cambios?.map((cambio, index) => {
    let valorAnterior = cambio.valorAnterior;
    let valorModificado = cambio.valorNuevo;

    // Si es responsableId, intentar mostrar nombre
    if (cambio.campo === "responsableId") {
      // Buscar información del responsable en los datos disponibles
      let responsableAnteriorInfo = null;
      let responsableNuevoInfo = null;
      
      // Buscar en los datos del activo si está disponible
      if (solicitud.activo?.responsableId) {
        if (typeof solicitud.activo.responsableId === 'object') {
          // Si es un objeto poblado
          if (solicitud.activo.responsableId._id === valorAnterior ||
              solicitud.activo.responsableId.id === valorAnterior) {
            responsableAnteriorInfo = solicitud.activo.responsableId;
          }
        }
      }
      
      // Buscar información del nuevo responsable si está disponible
      // Esto dependería de cómo obtienes los datos
      
      valorAnterior = getNombreResponsable(valorAnterior);
      valorModificado = getNombreResponsable(valorModificado);
    }

    // Formatear valores especiales
    if (solicitud.tipoOperacion === "creacion") {
      valorAnterior = "Sin valor anterior";
    } else if (!valorAnterior || valorAnterior.trim() === "") {
      valorAnterior = "Vacío";
    }

    return {
      id: index,
      campo: cambio.campo,
      valorAnterior,
      valorModificado,
    };
  }) || [];

  // Columnas para la tabla de cambios
  const cambiosTableColumns = [
    {
      key: "campo",
      label: "Campo",
      render: (row) => <span className="text-dark fw-bold">{row.campo}</span>,
      cellStyle: { minWidth: "150px", maxWidth: "200px" },
    },
    {
      key: "valorAnterior",
      label: "Valor anterior",
      render: (row) => {
        const isSpecial =
          row.valorAnterior === "Sin valor anterior" ||
          row.valorAnterior === "Vacío";
        return (
          <span className={isSpecial ? "text-muted" : "text-dark"}>
            {row.valorAnterior}
          </span>
        );
      },
      cellStyle: { minWidth: "200px", maxWidth: "250px" },
    },
    {
      key: "valorModificado",
      label: "Valor modificado",
      render: (row) => {
        // Si es responsable y tiene nombre, mostrarlo diferente
        if (
          row.campo === "Responsable"
        ) {
          return (
            <span className="text-success fw-semibold">
              {row.valorModificado}
            </span>
          );
        }
        return <span className="text-dark">{row.valorModificado}</span>;
      },
      cellStyle: { minWidth: "200px", maxWidth: "250px" },
    },
  ];

  // Render de carga
  if (loading) {
    return (
      <div className="revision-container p-2 p-lg-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onNavigateBack}
          className="mb-3 text-white border-white"
        >
          <FaArrowLeft className="me-2" /> Volver al panel de revisión
        </Button>
        <div className="text-center p-4">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-2 text-white">
            Cargando detalles de la solicitud...
          </p>
        </div>
      </div>
    );
  }

  // Render de error
  if (error || !solicitud) {
    return (
      <div className="revision-container p-2 p-lg-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onNavigateBack}
          className="mb-3 text-white border-white"
        >
          <FaArrowLeft className="me-2" /> Volver al panel de revisión
        </Button>
        <div className="alert alert-warning">
          <h5>Error al cargar la solicitud</h5>
          <p>{error || "No se encontró la información de la solicitud"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="revision-container p-2 p-lg-3">
      <Toast
        message={toastMessage}
        variant={toastVariant}
        show={showToast}
        autohide={true}
        delay={3000}
        onClose={handleCloseToast}
      />

      <Button
        variant="outline"
        size="sm"
        onClick={onNavigateBack}
        className="mb-3 text-white border-white"
      >
        <FaArrowLeft className="me-2" /> Volver al panel de revisión
      </Button>

      <div className="d-flex justify-content-between align-items-start mb-3 mb-lg-4">
        <div className="text-white">
          <h2 className="fw-bold mb-1 h4-responsive">
            Revisión de Solicitud de Cambio
          </h2>
          <h6 className="text-white-50 h6-responsive">
            Código: {solicitud.codigoSolicitud}
          </h6>
        </div>

        {solicitud.estadoGeneral === "Pendiente" && (
          <div className="d-flex gap-2">
            <Button
              variant="success"
              size="md"
              onClick={handleApproveClick}
              disabled={submittingReview}
              className="text-white fw-bold"
            >
              {submittingReview ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Procesando...
                </>
              ) : (
                "Aprobar"
              )}
            </Button>
            <Button
              variant="danger"
              size="md"
              onClick={handleRejectClick}
              disabled={submittingReview}
              className="text-white fw-bold"
            >
              {submittingReview ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Procesando...
                </>
              ) : (
                "Rechazar"
              )}
            </Button>
          </div>
        )}
      </div>

      <div className="row">
        {/* Columna izquierda - Checklist y comentarios */}
        <div className="col-12 col-lg-5 mb-3 mb-lg-0">
          {solicitud.estadoGeneral === "Pendiente" && (
            <>
              <Card style={{ backgroundColor: "#FFEEEE" }}>
                <div className="card-body p-2 p-lg-3">
                  <div className="bg-warning p-2 p-lg-3 rounded mb-2 mb-lg-3">
                    <h5 className="card-title fw-bold mb-0 text-white d-flex align-items-center h5-responsive">
                      <FaShieldAlt className="me-2" /> Checklist de Evaluación
                    </h5>
                  </div>
                  {Object.entries({
                    informacionCompleta: {
                      label: "Información completa y clara",
                      desc: "Todos los campos están completos y la descripción permite entender el alcance",
                    },
                    justificacionClara: {
                      label: "Justificación adecuada del cambio",
                      desc: "La razón del cambio está bien explicada y es apropiada",
                    },
                    impactoDocumentado: {
                      label: "Impacto del cambio documentado",
                      desc: "Se especifica cómo afectará la modificación al activo y sus dependencias",
                    },
                    categoriaAdecuada: {
                      label: "Categorización apropiada",
                      desc: "La categoría asignada corresponde con la naturaleza del activo",
                    },
                  }).map(([key, { label, desc }], index) => (
                    <div key={key} className="checklist-item mb-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={checklist[key]}
                          onChange={() => handleChecklistChange(key)}
                          id={`check${index + 1}`}
                        />
                        <label
                          className="form-check-label text-dark"
                          htmlFor={`check${index + 1}`}
                        >
                          <strong>{label}</strong>
                          <small className="text-muted d-block mt-1">
                            {desc}
                          </small>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card style={{ backgroundColor: "#FFEEEE" }} className="mt-3">
                <div className="card-body p-2 p-lg-3">
                  <div className="bg-info p-2 p-lg-3 rounded mb-2 mb-lg-3">
                    <h5 className="card-title fw-bold mb-0 text-white d-flex align-items-center h5-responsive">
                      <FaInfoCircle className="me-2" /> Comentarios de Revisión
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
                      Este comentario será visible para el solicitante y formará
                      parte del registro.
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

          {solicitud.estadoGeneral !== "Pendiente" &&
            solicitud.responsableSeguridad && (
              <Card style={{ backgroundColor: "#FFEEEE" }} className="mt-3">
                <div className="card-body p-2 p-lg-3">
                  <div className="bg-secondary p-2 p-lg-3 rounded mb-2 mb-lg-3">
                    <h5 className="card-title fw-bold mb-0 text-white d-flex align-items-center h5-responsive">
                      <FaShieldAlt className="me-2" /> Revisión Completada
                    </h5>
                  </div>
                  <div className="mb-2">
                    <strong className="text-dark">Estado Final:</strong>
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
                  <div className="mb-2">
                    <strong className="text-dark">Fecha de Revisión:</strong>
                    <span className="ms-2 text-dark">
                      {formatFecha(solicitud.fechaRevision)}
                    </span>
                  </div>
                  <div className="mb-2">
                    <strong className="text-dark">
                      Responsable de Seguridad:
                    </strong>
                    <span className="ms-2 text-dark">
                      {solicitud.responsableSeguridad.nombreCompleto}
                    </span>
                  </div>
                  <div>
                    <strong className="text-dark">
                      Comentario de Revisión:
                    </strong>
                    <div className="mt-2 p-2 bg-light rounded">
                      <small className="text-dark">
                        {solicitud.comentarioSeguridad || "Sin comentarios"}
                      </small>
                    </div>
                  </div>
                </div>
              </Card>
            )}
        </div>

        {/* Columna derecha - Información de la solicitud */}
        <div className="col-12 col-lg-7">
          <Card style={{ backgroundColor: "#FFEEEE" }}>
            <div className="card-body p-2 p-lg-3">
              <div className="bg-primary p-2 p-lg-3 rounded mb-2 mb-lg-3">
                <h5 className="card-title fw-bold mb-0 text-white d-flex align-items-center h5-responsive">
                  <FaInfoCircle className="me-2" /> Información de la Solicitud
                  y Cambios
                </h5>
              </div>

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
                      {solicitud.nombreSolicitante ||
                        solicitud.solicitante ||
                        "No especificado"}
                    </span>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-12 col-md-6 mb-2 mb-md-0">
                    <strong className="text-dark">Tipo de Operación:</strong>
                    <span className="ms-2 text-dark d-block d-md-inline">
                      <span className="badge bg-info ms-1">
                        {solicitud.tipoOperacion === "creacion"
                          ? "Creación"
                          : solicitud.tipoOperacion === "modificacion"
                          ? "Modificación"
                          : solicitud.tipoOperacion || "No especificado"}
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

              <div className="mb-3 mb-lg-4">
                <h6 className="fw-bold mb-2 mb-lg-3 text-dark h6-responsive">
                  Justificación del Cambio
                </h6>
                <Card style={{ backgroundColor: "#FFEEEE" }}>
                  <div className="card-body p-2 p-lg-3">
                    <p className="mb-0 text-dark">{solicitud.justificacion}</p>
                  </div>
                </Card>
              </div>

              <div className="mb-3 mb-lg-4">
                <h6 className="fw-bold mb-2 mb-lg-3 text-dark h6-responsive">
                  Cambios Solicitados
                </h6>
                {cambiosTableData.length > 0 ? (
                  <div className="table-responsive">
                    <Table
                      columns={cambiosTableColumns}
                      data={cambiosTableData}
                      hoverEffect={true}
                      bordered={true}
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

      <Modal
        isOpen={showApproveModal}
        onClose={cancelAction}
        title="Aprobar Solicitud"
        question="¿Estás seguro de que deseas aprobar esta solicitud?"
        showValueBox={true}
        valueBoxTitle="Solicitud a aprobar:"
        valueBoxSubtitle={
          solicitud
            ? `${solicitud.codigoSolicitud} - ${
                solicitud.nombreActivo || "Activo"
              }`
            : ""
        }
        informativeText="Esta acción cambiará el estado de la solicitud a 'Aprobado' en la base de datos y permitirá que continúe el flujo de aprobación. Los cambios serán permanentes."
        cancelText="Cancelar"
        acceptText="Aprobar"
        onCancel={cancelAction}
        onAccept={confirmApprove}
        headerBgColor="#28a745"
        buttonColor="#28a745"
      />

      <Modal
        isOpen={showRejectModal}
        onClose={cancelAction}
        title="Rechazar Solicitud"
        question="¿Estás seguro de que deseas rechazar esta solicitud?"
        showValueBox={true}
        valueBoxTitle="Solicitud a rechazar:"
        valueBoxSubtitle={
          solicitud
            ? `${solicitud.codigoSolicitud} - ${
                solicitud.nombreActivo || "Activo"
              }`
            : ""
        }
        informativeText="Esta acción cambiará el estado de la solicitud a 'Rechazado' en la base de datos y notificará al solicitante. El comentario de revisión será visible para el solicitante y los cambios serán permanentes."
        cancelText="Cancelar"
        acceptText="Rechazar"
        onCancel={cancelAction}
        onAccept={confirmReject}
        headerBgColor="#dc3545"
        buttonColor="#dc3545"
      />
    </div>
  );
};

export default Revision;
