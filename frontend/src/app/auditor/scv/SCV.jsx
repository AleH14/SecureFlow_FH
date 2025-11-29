import React, { useState } from "react";
import { FaArrowLeft, FaCommentAlt } from "react-icons/fa";
import { Table, Button, Modal } from "../../../components/ui";

const SCV = ({ onNavigateBack, selectedActivo }) => {
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [comment, setComment] = useState('');
  
  // Datos de ejemplo del historial de cambios
  const historialCambios = [
    {
      "Fecha": "2025-11-23",
      "Solicitud de Cambio": {
        "Nombre": "Servidor Web Principal",
        "Categoría": "Infraestructura",
        "Estado": "Activo",
        "Descripción": "Servidor web para aplicaciones corporativas con balanceador de carga.",
        "Ubicación": "Sala 5 - Dep TI",
        "Responsable": "Abigail Flores"
      },
      "Comentario": "Comentario de solicitante",
      "Revisión": {
        "Rol": "Responsable de Seguridad",
        "Nombre": "Valeria Enriquez",
        "Fecha": "2025-11-23",
        "Comentario": "Comentario de Responsable de Seguridad"
      },
      "Auditoria": {
        "Auditor": "Valeria Enriquez",
        "Fecha": "2025-11-24",
        "Comentario": "Comentario de Auditor"
      },
      "Estado": "Aprobado"
    }
  ];

  const handleBack = () => {
    if (onNavigateBack) {
      onNavigateBack();
    }
  };

  const handleComment = (record) => {
    setSelectedRecord(record);
    setComment('');
    setShowCommentModal(true);
  };

  const handleSubmitComment = () => {
    console.log('Comentario agregado:', {
      record: selectedRecord,
      comment: comment,
      auditor: 'Auditor',
      fecha: new Date().toISOString().split('T')[0]
    });
    
    // Aquí iría la lógica para guardar el comentario
    setShowCommentModal(false);
    setSelectedRecord(null);
    setComment('');
  };

  const handleCancelComment = () => {
    setShowCommentModal(false);
    setSelectedRecord(null);
    setComment('');
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

  // Convertir datos para la tabla con el nuevo formato
  const historialData = historialCambios.map((item, index) => ({
    id: index + 1,
    fecha: item.Fecha,
    solicitud_de_cambio: (
      <div className="scv-cell-content">
        <span className="scv-label">Nombre:</span> <span className="scv-value">{item["Solicitud de Cambio"].Nombre}</span><br/>
        <span className="scv-label">Categoría:</span> <span className="scv-value">{item["Solicitud de Cambio"].Categoría}</span><br/>
        <span className="scv-label">Estado:</span> <span className="scv-value">{item["Solicitud de Cambio"].Estado}</span><br/>
        <span className="scv-label">Responsable:</span> <span className="scv-value">{item["Solicitud de Cambio"].Responsable}</span>
      </div>
    ),
    comentario: item.Comentario,
    revision: (
      <div className="scv-cell-content">
        <span className="scv-label">Rol:</span> <span className="scv-value">{item.Revisión.Rol}</span><br/>
        <span className="scv-label">Nombre:</span> <span className="scv-value">{item.Revisión.Nombre}</span><br/>
        <span className="scv-label">Fecha:</span> <span className="scv-value">{item.Revisión.Fecha}</span><br/>
        <span className="scv-label">Comentario:</span> <span className="scv-value">{item.Revisión.Comentario}</span>
      </div>
    ),
    auditoria: (
      <div className="scv-cell-content">
        <span className="scv-label">Auditor:</span> <span className="scv-value">{item.Auditoria.Auditor}</span><br/>
        <span className="scv-label">Fecha:</span> <span className="scv-value">{item.Auditoria.Fecha}</span><br/>
        <span className="scv-label">Comentario:</span> <span className="scv-value">{item.Auditoria.Comentario}</span>
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
      >
        <FaCommentAlt className="comment-icon" />
        Comentar
      </button>
    )
  }));

  // Definir columnas de la tabla
  const tableColumns = [
    { key: "fecha", label: "Fecha" },
    { key: "solicitud_de_cambio", label: "Solicitud de cambio" },
    { key: "comentario", label: "Comentario" },
    { key: "revision", label: "Revisión" },
    { key: "auditoria", label: "Auditoría" },
    { key: "estado", label: "Estado" },
    { key: "accion", label: "Acción" }
  ];

  // Usar datos del activo seleccionado o valores por defecto
  const activoInfo = selectedActivo || {
    nombre: historialCambios[0]["Solicitud de Cambio"].Nombre,
    codigo: "SWP-001",
    responsable: historialCambios[0]["Solicitud de Cambio"].Responsable
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
              style={{ color: 'white' }}
            >
              <FaArrowLeft className="me-2" />
              Regresar
            </Button>
          </div>
          
          <h2>Historial de Cambios - {activoInfo.nombre}</h2>
          <h6>Código: {activoInfo.codigo} | Responsable: {activoInfo.responsable}</h6>
        </div>
        
        <Table 
          columns={tableColumns}
          data={historialData}
        />
        
        {/* Modal para agregar comentarios */}
        {showCommentModal && (
          <div className="modalOverlay" onClick={handleCancelComment}>
            <div className="modalContainer" onClick={(e) => e.stopPropagation()}>
              <div className="modalHeader" style={{ backgroundColor: '#17a2b8' }}>
                <h3 className="modalTitle">Agregar Comentario de Auditoría</h3>
                <button className="modalCloseBtn" onClick={handleCancelComment}>×</button>
              </div>
              
              <div className="modalBody">
                <p className="modalQuestion">¿Deseas agregar un comentario a este registro?</p>
                
                <div className="modalValueBox">
                  <div className="valueBoxTitle">Registro seleccionado:</div>
                  <div className="valueBoxSubtitle">
                    {selectedRecord ? `${selectedRecord["Solicitud de Cambio"]?.Nombre || 'N/A'} - ${selectedRecord.Fecha}` : ""}
                  </div>
                </div>
                
                <div className="comment-input-section">
                  <label className="comment-label">Comentario de Auditoría:</label>
                  <textarea
                    className="comment-textarea"
                    placeholder="Escribe tu comentario aquí..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows="4"
                  />
                </div>
                
                <p className="modalInformativeText">
                  El comentario será agregado como parte del proceso de auditoría y quedará registrado en el historial.
                </p>
              </div>
              
              <div className="modalFooter">
                <button className="modalBtn modalCancelBtn" onClick={handleCancelComment}>
                  Cancelar
                </button>
                <button 
                  className="modalBtn modalAcceptBtn" 
                  onClick={handleSubmitComment}
                  style={{ backgroundColor: '#17a2b8' }}
                  disabled={!comment.trim()}
                >
                  Agregar Comentario
                </button>
              </div>
            </div>
          </div>
        )}
        
        <style jsx global>{`
          .scv-cell-content {
            line-height: 1.5;
          }
          .scv-label {
            font-weight: bold !important;
            color: var(--color-navy) !important;
          }
          .scv-value {
            color: var(--color-navy) !important;
            font-weight: normal !important;
          }
          .estado-badge {
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
            text-align: center;
            display: inline-block;
            min-width: 80px;
          }
          .estado-aprobado {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
          }
          .estado-pendiente {
            background-color: #fff3cd;
            color: #856404;
            border: 1px solid #ffeaa7;
          }
          .estado-rechazado {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
          }
          .estado-revision {
            background-color: #d1ecf1;
            color: #0c5460;
            border: 1px solid #bee5eb;
          }
          .estado-default {
            background-color: #e2e3e5;
            color: #383d41;
            border: 1px solid #d6d8db;
          }
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
            transition: background-color 0.2s;
          }
          .comment-btn:hover {
            background-color: #138496;
          }
          .comment-icon {
            font-size: 11px;
          }
          .comment-input-section {
            margin: 16px 0;
          }
          .comment-label {
            display: block;
            font-weight: bold;
            color: black !important;
            font-size: 14px;
            margin-bottom: 8px;
          }
          .comment-textarea {
            width: 100%;
            padding: 12px;
            border: 1px solid #e0e0e0;
            border-radius: 6px;
            font-size: 14px;
            font-family: inherit;
            color: black;
            background-color: white;
            resize: vertical;
            min-height: 80px;
          }
          .comment-textarea:focus {
            outline: none;
            border-color: #17a2b8;
            box-shadow: 0 0 0 2px rgba(23, 162, 184, 0.2);
          }
          .comment-textarea::placeholder {
            color: #888;
          }
        `}</style>
    </div>
  );
}

export default SCV;