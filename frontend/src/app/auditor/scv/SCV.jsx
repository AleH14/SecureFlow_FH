import React, { useState } from "react";
import { FaArrowLeft, FaCommentAlt } from "react-icons/fa";
import { Table, Button } from "../../../components/ui";
import { createPortal } from "react-dom";

const SCV = ({ onNavigateBack, selectedActivo }) => {
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [comment, setComment] = useState("");

  // Datos de ejemplo del historial de cambios
  const historialCambios = [
    {
      Fecha: "2025-11-23",
      "Solicitud de Cambio": {
        Nombre: "Servidor Web Principal",
        Categoría: "Infraestructura",
        Estado: "Activo",
        Descripción:
          "Servidor web para aplicaciones corporativas con balanceador de carga.",
        Ubicación: "Sala 5 - Dep TI",
        Responsable: "Abigail Flores",
      },
      Comentario: "Comentario de solicitante",
      Revisión: {
        Rol: "Responsable de Seguridad",
        Nombre: "Valeria Enriquez",
        Fecha: "2025-11-23",
        Comentario: "Comentario de Responsable de Seguridad",
      },
      Auditoria: {
        Auditor: "Valeria Enriquez",
        Fecha: "2025-11-24",
        Comentario: "Comentario de Auditor",
      },
      Estado: "Aprobado",
    },
  ];

  const handleBack = () => {
    if (onNavigateBack) {
      onNavigateBack();
    }
  };

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

  // Función para obtener la clase del estado
  const getEstadoClass = (estado) => {
    switch (estado?.toLowerCase()) {
      case "aprobado":
        return "estado-aprobado";
      case "pendiente":
        return "estado-pendiente";
      case "rechazado":
        return "estado-rechazado";
      case "en revisión":
      case "en revision":
        return "estado-revision";
      default:
        return "estado-default";
    }
  };

  // Convertir datos para la tabla con el nuevo formato
  const historialData = historialCambios.map((item, index) => ({
    id: index + 1,
    fecha: item.Fecha,
    solicitud_de_cambio: (
      <div className="scv-cell-content">
        <span className="scv-label">Nombre:</span>{" "}
        <span className="scv-value">{item["Solicitud de Cambio"].Nombre}</span>
        <br />
        <span className="scv-label">Categoría:</span>{" "}
        <span className="scv-value">
          {item["Solicitud de Cambio"].Categoría}
        </span>
        <br />
        <span className="scv-label">Estado:</span>{" "}
        <span className="scv-value">{item["Solicitud de Cambio"].Estado}</span>
        <br />
        <span className="scv-label">Responsable:</span>{" "}
        <span className="scv-value">
          {item["Solicitud de Cambio"].Responsable}
        </span>
      </div>
    ),
    comentario: item.Comentario,
    revision: (
      <div className="scv-cell-content">
        <span className="scv-label">Rol:</span>{" "}
        <span className="scv-value">{item.Revisión.Rol}</span>
        <br />
        <span className="scv-label">Nombre:</span>{" "}
        <span className="scv-value">{item.Revisión.Nombre}</span>
        <br />
        <span className="scv-label">Fecha:</span>{" "}
        <span className="scv-value">{item.Revisión.Fecha}</span>
        <br />
        <span className="scv-label">Comentario:</span>{" "}
        <span className="scv-value">{item.Revisión.Comentario}</span>
      </div>
    ),
    auditoria: (
      <div className="scv-cell-content">
        <span className="scv-label">Auditor:</span>{" "}
        <span className="scv-value">{item.Auditoria.Auditor}</span>
        <br />
        <span className="scv-label">Fecha:</span>{" "}
        <span className="scv-value">{item.Auditoria.Fecha}</span>
        <br />
        <span className="scv-label">Comentario:</span>{" "}
        <span className="scv-value">{item.Auditoria.Comentario}</span>
      </div>
    ),
    estado: (
      <span className={`estado-badge ${getEstadoClass(item.Estado)}`}>
        {item.Estado}
      </span>
    ),
    accion: (
      <button
        className="comment-btn"
        onClick={() => handleComment(item)}
        title="Agregar comentario de auditoría"
        aria-label={`Agregar comentario a ${item["Solicitud de Cambio"].Nombre}`}
      >
        <FaCommentAlt className="comment-icon" />
        Comentar
      </button>
    ),
  }));

  // Definir columnas de la tabla
  const tableColumns = [
    { 
      key: "fecha", 
      label: "Fecha",
      cellStyle: { minWidth: "100px" }
    },
    { 
      key: "solicitud_de_cambio", 
      label: "Solicitud de cambio",
      cellStyle: { minWidth: "250px" }
    },
    { 
      key: "comentario", 
      label: "Comentario",
      cellStyle: { minWidth: "150px" }
    },
    { 
      key: "revision", 
      label: "Revisión",
      cellStyle: { minWidth: "250px" }
    },
    { 
      key: "auditoria", 
      label: "Auditoría",
      cellStyle: { minWidth: "250px" }
    },
    { 
      key: "estado", 
      label: "Estado",
      cellStyle: { 
        minWidth: "120px",
        textAlign: "center"
      }
    },
    { 
      key: "accion", 
      label: "Acción",
      cellStyle: { 
        minWidth: "120px",
        textAlign: "center"
      }
    },
  ];

  const activoInfo = selectedActivo || {
    nombre: historialCambios[0]["Solicitud de Cambio"].Nombre,
    codigo: "SWP-001",
    responsable: historialCambios[0]["Solicitud de Cambio"].Responsable,
  };

  return (
    <div className="scv-page">
      <div className="scv-header">
        <div className="d-flex align-items-center mb-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            className="me-3 d-flex align-items-center"
            style={{ color: "white" }}
          >
            <FaArrowLeft className="me-2" />
            Regresar
          </Button>
        </div>

        <h2>Historial de Cambios - {activoInfo.nombre}</h2>
        <h6>
          Código: {activoInfo.codigo} | Responsable: {activoInfo.responsable}
        </h6>
      </div>

      <Table 
        columns={tableColumns} 
        data={historialData}
        hoverEffect={true}
        bordered={true}
      />

      {/* MODAL — usando portal para sobreponer */}
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
                      ? `${selectedRecord["Solicitud de Cambio"]?.Nombre} - ${selectedRecord.Fecha}`
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

      {/* CSS de MODAL Y BOTON COMENTAR */}
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
        .comment-textarea:focus {
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

export default SCV;