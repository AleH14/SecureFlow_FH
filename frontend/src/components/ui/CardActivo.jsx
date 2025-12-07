import React from "react";
import { FaHistory, FaEdit } from "react-icons/fa";

const CardActivo = ({ 
    activo,
    onHistorialClick = () => {},
    onModificarClick = () => {},
    showModificarButton = false,
    className = "",
    ...props 
}) => {
    if (!activo) {
        return <div className="card-activo-error">No hay información del activo</div>;
    }

    const getEstadoClass = (estado) => {
        if (!estado) return 'estado-default';
        
        switch (estado.toLowerCase().trim()) {
            case 'activo':
                return 'estado-activo';
            case 'mantenimiento':
            case 'en mantenimiento':
                return 'estado-mantenimiento';
            case 'inactivo':
                return 'estado-inactivo';
            case 'en revision':
            case 'en revisión':
            case 'revision':
                return 'estado-revision';
            case 'dado de baja':
            case 'baja':
                return 'estado-baja';
            case 'obsoleto':
                return 'estado-obsoleto';
            default:
                console.log('Estado no reconocido:', estado); // Para debug
                return 'estado-default';
        }
    };

    const handleHistorialClick = () => {
        console.log('Mostrando historial para:', activo.nombre);
        onHistorialClick(activo);
    };

    const handleModificarClick = () => {
        console.log('Modificando activo:', activo.nombre);
        onModificarClick(activo);
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
                {showModificarButton && (
                    <button 
                        className="modificar-btn"
                        onClick={handleModificarClick}
                        title="Solicitar modificación"
                    >
                        <FaEdit className="modificar-icon" />
                        Modificar
                    </button>
                )}
                <button 
                    className={`historial-btn ${showModificarButton ? 'with-modificar' : 'full-width'}`}
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