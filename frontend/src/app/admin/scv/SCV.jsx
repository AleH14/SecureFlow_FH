import React, { useState, useEffect, useCallback } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Table, Button } from "../../../components/ui";
import { ActivoService } from "@/services";

const SCV = ({ onNavigateBack, selectedActivo }) => {
  const [historialData, setHistorialData] = useState([]);
  const [activoInfo, setActivoInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      setError('Error al cargar el historial de cambios');
      setHistorialData([]);
    } finally {
      setLoading(false);
    }
  }, [selectedActivo?.id]);

  // Cargar datos al montar el componente o cambiar el activo
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

  // Convertir datos de la API para la tabla
  const historialTableData = historialData.map(item => ({
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
  }));

  // Definir columnas de la tabla
  const tableColumns = [
    { key: "fecha", label: "Fecha" },
    { key: "solicitud_de_cambio", label: "Solicitud de cambio" },
    { key: "comentario", label: "Comentario" },
    { key: "revision", label: "Revisión" },
    { key: "auditoria", label: "Auditoría" },
    { key: "estado", label: "Estado" }
  ];

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
            <p>No se encontraron solicitudes de cambio para este activo.</p>
          </div>
        ) : (
          <Table 
            columns={tableColumns}
            data={historialTableData}
          />
        )}
    </div>
  );
}

export default SCV;