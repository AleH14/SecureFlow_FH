import React from "react";
import { createPortal } from "react-dom";
import "../../styles/modal.css";

const Modal = ({ 
  isOpen,
  onClose,
  title = "Título del Modal",
  question = "¿Estás seguro?",
  informativeText = "",
  valueBoxTitle = "",
  valueBoxSubtitle = "",
  showValueBox = false,
  cancelText = "Cancelar",
  acceptText = "Aceptar",
  onCancel,
  onAccept,
  headerBgColor = "var(--color-navy)",
  buttonColor = "var(--color-navy)",
  children, // <-- AGREGAR PARA CONTENIDO EXTRA
  modalClassName = "", // <-- AGREGAR PARA CLASES PERSONALIZADAS
  maxHeight = "auto" // <-- AGREGAR PARA CONTROLAR ALTURA
}) => {

  if (!isOpen) return null;

  const handleCancel = () => {
    if (onCancel) onCancel();
    else if (onClose) onClose();
  };

  const handleAccept = () => {
    if (onAccept) onAccept();
    else if (onClose) onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  const modalContent = (
    <div
      className={`modalOverlay ${modalClassName}`}
      onClick={handleBackdropClick}
      style={{ 
        zIndex: 99999,
        // Fuerza alinear desde arriba cuando hay mucho contenido
        alignItems: modalClassName.includes('top-aligned') ? 'flex-start' : 'center',
        paddingTop: modalClassName.includes('top-aligned') ? '40px' : '0',
        overflowY: 'auto' // Permite scroll en toda la pantalla si es necesario
      }}
    >
      <div 
        className="modalContainer" 
        onClick={(e) => e.stopPropagation()}
        style={{
          maxHeight: maxHeight !== "auto" ? maxHeight : '85vh',
          margin: modalClassName.includes('top-aligned') ? '20px auto' : 'auto',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div 
          className="modalHeader"
          style={{ 
            backgroundColor: headerBgColor,
            flexShrink: 0 // No se encoge
          }}
        >
          <h3 className="modalTitle">{title}</h3>
          <button 
            className="modalCloseBtn"
            onClick={handleCancel}
          >
            ×
          </button>
        </div>

        {/* Body - HACER SCROLLABLE */}
        <div 
          className="modalBody"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            maxHeight: maxHeight !== "auto" 
              ? `calc(${maxHeight} - 120px)` 
              : 'calc(85vh - 120px)'
          }}
        >
          <p className="modalQuestion">{question}</p>

          {showValueBox && (
            <div className="modalValueBox">
              {valueBoxTitle && <div className="valueBoxTitle">{valueBoxTitle}</div>}
              {valueBoxSubtitle && <div className="valueBoxSubtitle">{valueBoxSubtitle}</div>}
            </div>
          )}

          {informativeText && (
            <p className="modalInformativeText">{informativeText}</p>
          )}

          {/* CONTENIDO ADICIONAL */}
          {children && (
            <div className="modal-children">
              {children}
            </div>
          )}
        </div>

        {/* Footer - FIJO EN LA PARTE INFERIOR */}
        <div 
          className="modalFooter"
          style={{
            flexShrink: 0, // No se encoge
            marginTop: 'auto' // Se queda abajo
          }}
        >
          <button 
            className="modalBtn modalCancelBtn"
            onClick={handleCancel}
          >
            {cancelText}
          </button>
          <button 
            className="modalBtn modalAcceptBtn"
            onClick={handleAccept}
            style={{ backgroundColor: buttonColor }}
          >
            {acceptText}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default Modal;