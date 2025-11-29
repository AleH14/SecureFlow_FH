import React from "react";
import { FaHistory } from "react-icons/fa";

const CardActivo = ({ 
    activo,
    onHistorialClick = () => {},
    className = "",
    ...props 
}) => {
    if (!activo) {
        return <div className="card-activo-error">No hay información del activo</div>;
    }

    const getEstadoClass = (estado) => {
        switch (estado?.toLowerCase()) {
            case 'activo':
                return 'estado-activo';
            case 'mantenimiento':
                return 'estado-mantenimiento';
            case 'inactivo':
                return 'estado-inactivo';
            case 'en revision':
                return 'estado-revision';
            default:
                return 'estado-default';
        }
    };

    const handleHistorialClick = () => {
        console.log('Mostrando historial para:', activo.nombre);
        onHistorialClick(activo);
    };

    return (
        <div className={`card-activo ${className}`} {...props}>
            {/* Header */}
            <div className="card-activo-header">
                <div className="card-activo-title-section">
                    <h3 className="card-activo-title">{activo.nombre}</h3>
                    <p className="card-activo-subtitle">{activo.codigo}</p>
                </div>
                <div className={`card-activo-estado ${getEstadoClass(activo.estado)}`}>
                    {activo.estado}
                </div>
            </div>

            {/* Content */}
            <div className="card-activo-content">
                {activo.categoria && (
                    <div className="card-activo-field">
                        <span className="field-label">Categoría:</span>
                        <span className="field-value">{activo.categoria}</span>
                    </div>
                )}
                
                {activo.descripcion && (
                    <div className="card-activo-field">
                        <span className="field-label">Descripción:</span>
                        <span className="field-value">{activo.descripcion}</span>
                    </div>
                )}

                {activo.responsable && (
                    <div className="card-activo-field">
                        <span className="field-label">Responsable:</span>
                        <span className="field-value">{activo.responsable}</span>
                    </div>
                )}

                {activo.version && (
                    <div className="card-activo-field">
                        <span className="field-label">Versión:</span>
                        <span className="field-value">{activo.version}</span>
                    </div>
                )}

                {activo.ubicacion && (
                    <div className="card-activo-field">
                        <span className="field-label">Ubicación:</span>
                        <span className="field-value">{activo.ubicacion}</span>
                    </div>
                )}

                {activo.fecha_creacion && (
                    <div className="card-activo-field">
                        <span className="field-label">Fecha Creación:</span>
                        <span className="field-value">{activo.fecha_creacion}</span>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="card-activo-footer">
                <button 
                    className="historial-btn"
                    onClick={handleHistorialClick}
                    title="Ver historial de versiones"
                >
                    <FaHistory className="historial-icon" />
                    Historial de Versiones
                </button>
            </div>
        </div>
    );
};

export default CardActivo;