import React, { useState, useEffect, useCallback } from "react";
import { FaArrowLeft, FaCommentAlt } from "react-icons/fa";
import { createPortal } from "react-dom";
import { Table, Button } from "../ui";
import { ActivoService } from "@/services";
import { getCurrentUser } from "@/services/userService";

const SCVBase = ({ 
  onNavigateBack, 
  selectedActivo,
  userRole = 'admin', // 'admin', 'auditor', 'security', 'user'
  showActions = false,
  customColumns = null,
  customDataTransform = null
}) => {
  const [historialData, setHistorialData] = useState([]);
  const [activoInfo, setActivoInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Estados para modal de comentarios (auditor)
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [comment, setComment] = useState("");

  // Cargar historial de cambios
  const loadHistorialCambios = useCallback(async () => {
    if (!selectedActivo?.id) {
      setError('No se ha seleccionado un activo válido');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await ActivoService.historyCompleteRequestByActivoId(selectedActivo.id);
      console.log('Historial de cambios:', response);
      
      if (response && response.data) {
        setActivoInfo(response.data.activo);
        setHistorialData(response.data.historial || []);
      } else {
        setHistorialData([]);
      }
    } catch (error) {
      console.error('Error cargando historial:', error);
      
      // Manejar diferentes tipos de errores
      if (error.response?.status === 403) {
        setError('No tienes permisos para ver el historial de este activo');
      } else if (error.response?.status === 404) {
        setError('Activo no encontrado');
      } else {
        setError('Error al cargar el historial de cambios');
      }
      
      setHistorialData([]);
    } finally {
      setLoading(false);
    }
  }, [selectedActivo?.id]);

  // Cargar información del usuario actual
  const loadCurrentUser = useCallback(async () => {
    try {
      const userResponse = await getCurrentUser();
      if (userResponse && userResponse.data) {
        setCurrentUser(userResponse.data);
      }
    } catch (error) {
      console.error('Error cargando usuario actual:', error);
    }
  }, []);

  // Cargar datos al montar el componente o cambiar el activo
  useEffect(() => {
    loadCurrentUser();
  }, [loadCurrentUser]);

  useEffect(() => {
    loadHistorialCambios();
  }, [loadHistorialCambios]);

  const handleBack = () => {
    if (onNavigateBack) {
      onNavigateBack();
    }
  };

  // Función para obtener la clase del estado
  const getEstadoClass = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'aprobado':
        return 'estado-aprobado';
      case 'pendiente':
        return 'estado-pendiente';
      case 'rechazado':
        return 'estado-rechazado';
      case 'en revisión':
      case 'en revision':
        return 'estado-revision';
      default:
        return 'estado-default';
    }
  };

  // Función para formatear fecha
  const formatFecha = (fecha) => {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // Funciones para modal de comentarios (auditor)
  const handleComment = (record) => {
    setSelectedRecord(record);
    setComment("");
    setShowCommentModal(true);
    document.body.classList.add("modal-open");
  };

  const handleSubmitComment = () => {
    console.log("Comentario agregado:", {
      record: selectedRecord,
      comment: comment,
      auditor: "Auditor",
      fecha: new Date().toISOString().split("T")[0],
    });

    setShowCommentModal(false);
    setSelectedRecord(null);
    setComment("");
    document.body.classList.remove("modal-open");
  };

  const handleCancelComment = () => {
    setShowCommentModal(false);
    setSelectedRecord(null);
    setComment("");
    document.body.classList.remove("modal-open");
  };

  // Transformación de datos base
  const defaultDataTransform = (item, index) => {
    const baseData = {
      fecha: formatFecha(item.fecha),
      solicitud_de_cambio: (
        <div className="scv-cell-content">
          <span className="scv-label">Código:</span> <span className="scv-value">{item.solicitudCambio?.codigoSolicitud || 'N/A'}</span><br/>
          <span className="scv-label">Tipo:</span> <span className="scv-value">{item.solicitudCambio?.tipoOperacion || 'N/A'}</span><br/>
          <span className="scv-label">Nombre:</span> <span className="scv-value">{item.solicitudCambio?.nombreActivo || 'N/A'}</span><br/>
          <span className="scv-label">Responsable:</span> <span className="scv-value">{item.solicitudCambio?.responsable?.nombreCompleto || 'N/A'}</span>
        </div>
      ),
      comentario: item.comentarioSolicitante || 'Sin comentarios',
      revision: item.revision ? (
        <div className="scv-cell-content">
          <span className="scv-label">Responsable:</span> <span className="scv-value">{item.revision.responsableSeguridad?.nombreCompleto || 'N/A'}</span><br/>
          <span className="scv-label">Fecha:</span> <span className="scv-value">{formatFecha(item.revision.fechaRevision)}</span><br/>
          <span className="scv-label">Comentario:</span> <span className="scv-value">{item.revision.comentario || 'Sin comentarios'}</span>
        </div>
      ) : (
        <span className="text-muted">Pendiente de revisión</span>
      ),
      auditoria: item.auditoria ? (
        <div className="scv-cell-content">
          <span className="scv-label">Auditor:</span> <span className="scv-value">{item.auditoria.auditor?.nombreCompleto || 'N/A'}</span><br/>
          <span className="scv-label">Fecha:</span> <span className="scv-value">{formatFecha(item.auditoria.fecha)}</span><br/>
          <span className="scv-label">Comentario:</span> <span className="scv-value">{item.auditoria.comentario || 'Sin comentarios'}</span>
        </div>
      ) : (
        <span className="text-muted">Pendiente de auditoría</span>
      ),
      estado: (
        <span className={`estado-badge ${getEstadoClass(item.estado)}`}>
          {item.estado}
        </span>
      )
    };

    // Agregar campos específicos según el rol
    switch (userRole) {
      case 'user':
        baseData.version = (
          <span className="version-badge">
            v1.0.{index}
          </span>
        );
        break;
      case 'auditor':
        if (showActions) {
          baseData.accion = (
            <button
              className="comment-btn"
              onClick={() => handleComment(item)}
              title="Agregar comentario de auditoría"
              aria-label={`Agregar comentario a ${item.solicitudCambio?.nombreActivo || 'registro'}`}
            >
              <FaCommentAlt className="comment-icon" />
              Comentar
            </button>
          );
        }
        break;
    }

    return baseData;
  };

  // Usar transformación personalizada o la por defecto
  const historialTableData = historialData.map((item, index) => {
    if (customDataTransform) {
      return customDataTransform(item, index, { formatFecha, getEstadoClass, handleComment });
    }
    return defaultDataTransform(item, index);
  });

  // Columnas base
  const getDefaultColumns = () => {
    const baseColumns = [
      { key: "fecha", label: "Fecha", cellStyle: { minWidth: "100px" } },
      { key: "solicitud_de_cambio", label: "Solicitud de cambio", cellStyle: { minWidth: "250px" } },
      { key: "comentario", label: "Comentario", cellStyle: { minWidth: "150px" } },
      { key: "revision", label: "Revisión", cellStyle: { minWidth: "250px" } },
      { key: "auditoria", label: "Auditoría", cellStyle: { minWidth: "250px" } },
    ];

    // Agregar columnas específicas según el rol
    if (userRole === 'user') {
      baseColumns.unshift({ 
        key: "version", 
        label: "Versión",
        cellStyle: { minWidth: "100px", textAlign: "center" }
      });
    } else {
      baseColumns.push({ 
        key: "estado", 
        label: "Estado",
        cellStyle: { minWidth: "120px", textAlign: "center" }
      });
    }

    if (userRole === 'auditor' && showActions) {
      baseColumns.push({ 
        key: "accion", 
        label: "Acción",
        cellStyle: { minWidth: "120px", textAlign: "center" }
      });
    }

    return baseColumns;
  };

  const tableColumns = customColumns || getDefaultColumns();

  // Información del activo para mostrar en el header
  const displayActivoInfo = activoInfo || selectedActivo || {
    nombre: 'Activo no encontrado',
    codigo: 'N/A',
    responsable: 'N/A'
  };

  if (loading) {
    return (
      <div className="scv-page">
        <div className="scv-header">
          <div className="d-flex align-items-center mb-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="me-3 d-flex align-items-center"
              style={{ color: 'white' }}
            >
              <FaArrowLeft className="me-2" />
              Regresar
            </Button>
          </div>
          <h2>Historial de Cambios</h2>
        </div>
        <div className="text-center p-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2">Cargando historial de cambios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="scv-page">
        <div className="scv-header">
          <div className="d-flex align-items-center mb-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="me-3 d-flex align-items-center"
              style={{ color: 'white' }}
            >
              <FaArrowLeft className="me-2" />
              Regresar
            </Button>
          </div>
          <h2>Historial de Cambios</h2>
        </div>
        <div className="alert alert-danger text-center">
          <h5>Error al cargar el historial</h5>
          <p>{error}</p>
          <Button 
            variant="primary" 
            onClick={loadHistorialCambios}
            className="mt-2"
          >
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="scv-page">  
      <div className="scv-header">
        <div className="d-flex align-items-center mb-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            className="me-3 d-flex align-items-center"
            style={{ color: 'white' }}
          >
            <FaArrowLeft className="me-2" />
            Regresar
          </Button>
        </div>
        
        <h2>Historial de Cambios - {displayActivoInfo.nombre}</h2>
        <h6>Código: {displayActivoInfo.codigo}</h6>
        {historialData.length > 0 && (
          <p className="text-muted">Total de cambios registrados: {historialData.length}</p>
        )}
      </div>
      
      {historialData.length === 0 ? (
        <div className="alert alert-info text-center">
          <h5>Sin historial de cambios</h5>
          {currentUser?.rol === 'usuario' ? (
            <p>No se encontraron solicitudes de cambio para tus activos asignados.</p>
          ) : (
            <p>No se encontraron solicitudes de cambio para este activo.</p>
          )}
        </div>
      ) : (
        <Table 
          columns={tableColumns}
          data={historialTableData}
          hoverEffect={true}
          bordered={true}
        />
      )}

      {/* Modal para comentarios (auditor) */}
      {showCommentModal &&
        createPortal(
          <div className="modalOverlay" onClick={handleCancelComment}>
            <div
              className="modalContainer"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="modalHeader"
                style={{ backgroundColor: "#17a2b8" }}
              >
                <h3 className="modalTitle">Agregar Comentario de Auditoría</h3>
                <button className="modalCloseBtn" onClick={handleCancelComment}>
                  ×
                </button>
              </div>

              <div className="modalBody">
                <p className="modalQuestion">
                  ¿Deseas agregar un comentario a este registro?
                </p>

                <div className="modalValueBox">
                  <div className="valueBoxTitle">Registro seleccionado:</div>
                  <div className="valueBoxSubtitle">
                    {selectedRecord
                      ? `${selectedRecord.solicitudCambio?.nombreActivo || 'Registro'} - ${formatFecha(selectedRecord.fecha)}`
                      : ""}
                  </div>
                </div>

                <div className="comment-input-section">
                  <label className="comment-label">
                    Comentario de Auditoría:
                  </label>
                  <textarea
                    className="comment-textarea"
                    placeholder="Escribe tu comentario aquí..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows="4"
                  />
                </div>

                <p className="modalInformativeText">
                  El comentario será agregado como parte del proceso de
                  auditoría y quedará registrado en el historial.
                </p>
              </div>

              <div className="modalFooter">
                <button
                  className="modalBtn modalCancelBtn"
                  onClick={handleCancelComment}
                >
                  Cancelar
                </button>
                <button
                  className="modalBtn modalAcceptBtn"
                  onClick={handleSubmitComment}
                  style={{ backgroundColor: "#17a2b8" }}
                  disabled={!comment.trim()}
                >
                  Agregar Comentario
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Estilos para el modal y botones */}
      <style jsx global>{`
        /* Evitar scroll del fondo cuando modal está abierto */
        body.modal-open {
          overflow: hidden !important;
        }

        /* ==== MODAL SOBRE TODO === */
        .modalOverlay {
          position: fixed !important;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.55);
          display: flex;
          justify-content: center;
          align-items: flex-start;
          overflow: hidden;
          z-index: 50000 !important;
          padding-top: 80px;
        }

        .modalContainer {
          background: white;
          border-radius: 10px;
          width: 480px;
          max-width: 90%;
          max-height: calc(85vh - 80px);
          overflow-y: auto;
          position: relative;
          padding-bottom: 20px;
          z-index: 50001 !important;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          margin-top: 0;
        }

        /* Botón de comentar */
        .comment-btn {
          background-color: #17a2b8;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 8px 12px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .comment-btn:hover {
          background-color: #138496;
        }
        .comment-icon {
          font-size: 11px;
        }

        /* Badge de versión */
        .version-badge {
          background-color: #6f42c1;
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        /* Estilos adicionales del modal */
        .modalHeader {
          padding: 16px 20px;
          border-radius: 10px 10px 0 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .modalTitle {
          margin: 0;
          color: white;
          font-size: 18px;
          font-weight: 600;
        }
        .modalCloseBtn {
          background: none;
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: background-color 0.2s;
        }
        .modalCloseBtn:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }
        .modalBody {
          padding: 20px;
        }
        .modalQuestion {
          font-weight: 600;
          margin-bottom: 16px;
          color: #333;
        }
        .modalValueBox {
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 6px;
          padding: 12px;
          margin-bottom: 16px;
        }
        .valueBoxTitle {
          font-weight: 600;
          font-size: 14px;
          color: #495057;
          margin-bottom: 4px;
        }
        .valueBoxSubtitle {
          font-size: 14px;
          color: #6c757d;
        }
        .comment-input-section {
          margin: 16px 0;
        }
        .comment-label {
          font-weight: bold;
          color: black !important;
          margin-bottom: 8px;
          display: block;
        }
        .comment-textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          font-size: 14px;
          font-family: inherit;
          resize: vertical;
          min-height: 80px;
          box-sizing: border-box;
          background-color: #f8f9fa; 
          color: #000000ff
        }
          color: #000000ff;
          outline: none;
          border-color: #17a2b8;
          box-shadow: 0 0 0 2px rgba(23, 162, 184, 0.2);
        }
        .modalInformativeText {
          font-size: 13px;
          color: #6c757d;
          margin-top: 16px;
          line-height: 1.4;
        }
        .modalFooter {
          padding: 16px 20px;
          border-top: 1px solid #e9ecef;
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }
        .modalBtn {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          min-width: 120px;
        }
        .modalCancelBtn {
          background-color: #6c757d;
          color: white;
        }
        .modalCancelBtn:hover {
          background-color: #5a6268;
        }
        .modalAcceptBtn {
          background-color: #17a2b8;
          color: white;
        }
        .modalAcceptBtn:hover:not(:disabled) {
          background-color: #138496;
        }
        .modalAcceptBtn:disabled {
          background-color: #b8d8de;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default SCVBase;