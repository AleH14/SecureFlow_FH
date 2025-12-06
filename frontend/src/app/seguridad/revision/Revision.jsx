"use client";
import React, { useState, useEffect } from "react";
import { Button, Card, Modal } from "../../../components/ui";
import Table from "../../../components/ui/Table";
import Toast from "../../../components/ui/Toast";
import { FaArrowLeft, FaShieldAlt, FaInfoCircle, FaEdit } from "react-icons/fa";
import { RequestService } from "@/services";
const Revision = ({
  solicitud: initialSolicitud,
  onNavigateBack,
  onNavigateToModificarActivo,
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

  // Cargar datos detallados de la solicitud
  useEffect(() => {
    const loadSolicitudDetails = async () => {
      if (initialSolicitud && initialSolicitud._id) {
        try {
          setLoading(true);
          setError(null);
          const response = await RequestService.getRequestById(
            initialSolicitud._id
          );

          if (response && response.success && response.data) {
            // Transformar datos del backend al formato del frontend
            const detailedSolicitud = {
              ...initialSolicitud,
              // Datos adicionales del backend
              activo: response.data.activo,
              cambios: response.data.cambios || [],
              solicitante:
                response.data.solicitante?.nombreCompleto ||
                initialSolicitud.solicitante,
              nombreSolicitante:
                response.data.solicitante?.nombreCompleto ||
                initialSolicitud.solicitante,
              responsableSeguridad: response.data.responsableSeguridad,
              comentarioSeguridad: response.data.comentarioSeguridad,
              fechaRevision: response.data.fechaRevision,
              tipoOperacion:
                response.data.tipoOperacion || initialSolicitud.tipoOperacion, // Preservar tipo de operación
            };
            setSolicitud(detailedSolicitud);
          }
        } catch (err) {
          console.error("Error cargando detalles de solicitud:", err);
          setError("Error al cargar los detalles de la solicitud");
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
      comments.push("✗ Información incompleta o confusa del cambio");
    }

    if (checklist.justificacionClara) {
      comments.push("✓ Justificación del cambio adecuada");
    } else {
      comments.push("✗ Justificación no adecuada del cambio");
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

    return comments.join("\n");
  };

  // Manejar limpiar comentario
  const handleClearComment = () => {
    setRevisionComment("");
    if (externalSetComment) externalSetComment("");
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
  const confirmApprove = async () => {
    if (!revisionComment.trim()) {
      setToastMessage(
        "El comentario de revisión es requerido para aprobar la solicitud"
      );
      setToastVariant("warning");
      setShowToast(true);
      setShowApproveModal(false);
      return;
    }

    try {
      setSubmittingReview(true);
      setShowApproveModal(false);

      console.log("Enviando aprobación:", {
        id: solicitud._id,
        estado: "Aprobado",
        comentario: revisionComment,
      });

      const response = await RequestService.reviewRequest(
        solicitud._id,
        "Aprobado",
        revisionComment
      );

      console.log("Respuesta de aprobación:", response);

      // Actualizar el estado local de la solicitud
      setSolicitud((prevSolicitud) => ({
        ...prevSolicitud,
        estadoGeneral: "Aprobado",
        comentarioSeguridad: revisionComment,
        fechaRevision: new Date().toISOString(),
        responsableSeguridad: {
          nombreCompleto: "Responsable de Seguridad", // Se actualizará con datos reales del backend
        },
      }));

      if (onApprove) {
        onApprove();
      }

      showSuccessToastAndNavigate(
        "Solicitud aprobada exitosamente. Los cambios se han guardado en la base de datos.",
        "success"
      );
    } catch (error) {
      console.error("Error aprobando solicitud:", error);
      let errorMessage =
        "Error al aprobar la solicitud. Por favor intenta de nuevo.";

      if (error.response) {
        console.error("Error response:", error.response.data);
        errorMessage = error.response.data.message || errorMessage;
      }

      setToastMessage(errorMessage);
      setToastVariant("error");
      setShowToast(true);
    } finally {
      setSubmittingReview(false);
    }
  };

  // Confirmar rechazo
  const confirmReject = async () => {
    if (!revisionComment.trim()) {
      setToastMessage(
        "El comentario de revisión es requerido para rechazar la solicitud"
      );
      setToastVariant("warning");
      setShowToast(true);
      setShowRejectModal(false);
      return;
    }

    try {
      setSubmittingReview(true);
      setShowRejectModal(false);

      console.log("Enviando rechazo:", {
        id: solicitud._id,
        estado: "Rechazado",
        comentario: revisionComment,
      });

      const response = await RequestService.reviewRequest(
        solicitud._id,
        "Rechazado",
        revisionComment
      );

      console.log("Respuesta de rechazo:", response);

      // Actualizar el estado local de la solicitud
      setSolicitud((prevSolicitud) => ({
        ...prevSolicitud,
        estadoGeneral: "Rechazado",
        comentarioSeguridad: revisionComment,
        fechaRevision: new Date().toISOString(),
        responsableSeguridad: {
          nombreCompleto: "Responsable de Seguridad", // Se actualizará con datos reales del backend
        },
      }));

      if (onReject) {
        onReject();
      }

      showSuccessToastAndNavigate(
        "Solicitud rechazada exitosamente. Los cambios se han guardado en la base de datos.",
        "success"
      );
    } catch (error) {
      console.error("Error rechazando solicitud:", error);
      let errorMessage =
        "Error al rechazar la solicitud. Por favor intenta de nuevo.";

      if (error.response) {
        console.error("Error response:", error.response.data);
        errorMessage = error.response.data.message || errorMessage;
      }

      setToastMessage(errorMessage);
      setToastVariant("error");
      setShowToast(true);
    } finally {
      setSubmittingReview(false);
    }
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
  // Datos para la tabla de cambios - MODIFICA ESTE BLOCO
  const cambiosTableData =
    solicitud.cambios?.map((cambio, index) => {
      let valorAnterior = cambio.valorAnterior;

      // Si es creación, mostrar "Sin valor anterior"
      if (solicitud.tipoOperacion === "creacion") {
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
      render: (row) => <span className="text-dark fw-bold">{row.campo}</span>,
      cellStyle: {
        minWidth: "150px",
        maxWidth: "200px",
      },
    },
    {
      key: "valorAnterior",
      label: "Valor anterior",
      render: (row) => {
        // Si es "Sin valor anterior" o "Vacío", mostrarlo en gris 
        if (
          row.valorAnterior === "Sin valor anterior" ||
          row.valorAnterior === "Vacío"
        ) {
          return (
            <span className="text-muted">{row.valorAnterior}</span>
          );
        }
        return <span className="text-dark">{row.valorAnterior}</span>;
      },
      cellStyle: {
        minWidth: "200px",
        maxWidth: "250px",
      },
    },
    {
      key: "valorModificado",
      label: "Valor modificado",
      render: (row) => <span className="text-dark">{row.valorModificado}</span>,
      cellStyle: {
        minWidth: "200px",
        maxWidth: "250px",
      },
    },
  ];

  // Estado de carga
  if (loading) {
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
        <div className="text-center p-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2 text-white">
            Cargando detalles de la solicitud...
          </p>
        </div>
      </div>
    );
  }

  // Estado de error o solicitud no encontrada
  if (error || !solicitud) {
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
          <h5>Error al cargar la solicitud</h5>
          <p>{error || "No se encontró la información de la solicitud"}</p>
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
          <h2 className="fw-bold mb-1 h4-responsive">
            Revisión de Solicitud de Cambio
          </h2>
          <h6 className="text-white-50 h6-responsive">
            Código: {solicitud.codigoSolicitud}
          </h6>
        </div>

        {/* Botones de acción para el responsable de seguridad */}
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
        {/* Columna izquierda - CHECKLIST Y COMENTARIOS */}
        <div className="col-12 col-lg-5 mb-3 mb-lg-0">
          {/* Checklist de Evaluación */}
          {solicitud.estadoGeneral === "Pendiente" && (
            <>
              <Card style={{ backgroundColor: "#FFEEEE" }}>
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
                          onChange={() =>
                            handleChecklistChange("informacionCompleta")
                          }
                          id="check1"
                        />
                        <label
                          className="form-check-label text-dark"
                          htmlFor="check1"
                        >
                          <strong>Información completa y clara</strong>
                          <small className="text-muted d-block mt-1">
                            Todos los campos están completos y la descripción
                            permite entender el alcance
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
                          onChange={() =>
                            handleChecklistChange("justificacionClara")
                          }
                          id="check2"
                        />
                        <label
                          className="form-check-label text-dark"
                          htmlFor="check2"
                        >
                          <strong>Justificación adecuada del cambio</strong>
                          <small className="text-muted d-block mt-1">
                            La razón del cambio está bien explicada y es
                            apropiada
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
                          onChange={() =>
                            handleChecklistChange("impactoDocumentado")
                          }
                          id="check3"
                        />
                        <label
                          className="form-check-label text-dark"
                          htmlFor="check3"
                        >
                          <strong>Impacto del cambio documentado</strong>
                          <small className="text-muted d-block mt-1">
                            Se especifica cómo afectará la modificación al
                            activo y sus dependencias
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
                          onChange={() =>
                            handleChecklistChange("categoriaAdecuada")
                          }
                          id="check4"
                        />
                        <label
                          className="form-check-label text-dark"
                          htmlFor="check4"
                        >
                          <strong>Categorización apropiada</strong>
                          <small className="text-muted d-block mt-1">
                            La categoría asignada corresponde con la naturaleza
                            del activo
                          </small>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Panel de Comentarios */}
              <Card style={{ backgroundColor: "#FFEEEE" }} className="mt-3">
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

          {/* Sección de revisión completada (si ya fue revisada) */}
          {solicitud.estadoGeneral !== "Pendiente" &&
            solicitud.responsableSeguridad && (
              <Card style={{ backgroundColor: "#FFEEEE" }} className="mt-3">
                <div className="card-body p-2 p-lg-3">
                  <div className="bg-secondary p-2 p-lg-3 rounded mb-2 mb-lg-3">
                    <h5 className="card-title fw-bold mb-0 text-white d-flex align-items-center h5-responsive">
                      <FaShieldAlt className="me-2" />
                      Revisión Completada
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

        {/* Columna derecha - INFORMACIÓN DE LA SOLICITUD */}
        <div className="col-12 col-lg-7">
          <Card style={{ backgroundColor: "#FFEEEE" }}>
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
                          Código: {solicitud.activo.codigo} | Categoría:{" "}
                          {solicitud.activo.categoria}
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
                <Card style={{ backgroundColor: "#FFEEEE" }}>
                  <div className="card-body p-2 p-lg-3">
                    <p className="mb-0 text-dark">{solicitud.justificacion}</p>
                  </div>
                </Card>
              </div>

              {/* Tabla de cambios realizados */}
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

      {/* Modal de confirmación para Aprobar */}
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

      {/* Modal de confirmación para Rechazar */}
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
