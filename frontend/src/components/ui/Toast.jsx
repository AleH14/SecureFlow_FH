import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

const Toast = ({
  message = '',
  variant = 'info',    // 'success' | 'danger' | 'info'
  show = true,
  autohide = true,
  delay = 5000,
  onClose = () => {},
}) => {
  useEffect(() => {
    if (autohide && show) {
      const timer = setTimeout(() => {
        onClose();
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [show, autohide, delay, onClose]);

  if (!show) return null;

  const backgroundColor =
    variant === 'success' ? '#28a745' :
    variant === 'danger' ? '#dc3545' : '#17a2b8';

  const toastContent = (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 99999,       // ¡muy alto para sobreponerse a header/sidebar!
        minWidth: '250px',
        maxWidth: '350px',
        padding: '12px 18px',
        backgroundColor,
        color: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '14px',
        fontWeight: '500',
        animation: 'slideIn 0.3s ease-out',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>{variant === 'success' ? '✓' : variant === 'danger' ? '✗' : 'ℹ'}</span>
        <span>{message}</span>
      </div>
      <button
        onClick={onClose}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#fff',
          fontSize: '16px',
          cursor: 'pointer',
        }}
      >
        ✕
      </button>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );

  return createPortal(toastContent, document.body);
};

export default Toast;
