import React from "react";
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
  buttonColor = "var(--color-navy)"
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

  return (
    <div className="modalOverlay" onClick={handleBackdropClick}>
      <div className="modalContainer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div 
          className="modalHeader"
          style={{ backgroundColor: headerBgColor }}
        >
          <h3 className="modalTitle">{title}</h3>
          <button 
            className="modalCloseBtn"
            onClick={handleCancel}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="modalBody">
          {/* Pregunta principal */}
          <p className="modalQuestion">{question}</p>

          {/* Recuadro de valores (opcional) */}
          {showValueBox && (
            <div className="modalValueBox">
              {valueBoxTitle && <div className="valueBoxTitle">{valueBoxTitle}</div>}
              {valueBoxSubtitle && <div className="valueBoxSubtitle">{valueBoxSubtitle}</div>}
            </div>
          )}

          {/* Texto informativo (opcional) */}
          {informativeText && (
            <p className="modalInformativeText">{informativeText}</p>
          )}
        </div>

        {/* Footer con botones */}
        <div className="modalFooter">
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
};

export default Modal;



