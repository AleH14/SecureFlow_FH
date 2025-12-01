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

  const modalContent = (
    <div
      className="modalOverlay"
      onClick={handleBackdropClick}
      style={{ zIndex: 99999 }} // Muy alto para sobreponerse a header/sidebar
    >
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
        </div>

        {/* Footer */}
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

  return createPortal(modalContent, document.body);
};

export default Modal;
