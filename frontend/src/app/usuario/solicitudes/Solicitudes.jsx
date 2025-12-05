"use client";
import React, { useState, useCallback } from "react";
import { SearchBar, Table, Button } from "../../../components/ui";
import { FaCheck, FaTimes, FaClock } from "react-icons/fa";
import { RequestService } from "@/services";

const Solicitudes = ({ onNavigateToDetalles, onRefreshCount }) => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredSolicitudes, setFilteredSolicitudes] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);

  // Función para cargar solicitudes desde la API
  const loadSolicitudes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await RequestService.getRequests();
      
      if (response && response.success && response.data) {
        setSolicitudes(response.data.solicitudes || []);
        console.log(`Cargadas ${response.data.solicitudes?.length || 0} solicitudes`);
          // Actualizar el contador cuando se cargan las solicitudes
        if (onRefreshCount) {
          onRefreshCount();
        }
      } else {
        throw new Error('Formato de respuesta inesperado');
      }
    } catch (err) {
      console.error('Error cargando solicitudes:', err);
      if (err.response?.status === 403) {
        setError('No tienes permisos para ver estas solicitudes.');
      } else {
        setError('Error al cargar las solicitudes. Por favor intenta de nuevo.');
      }
      setSolicitudes([]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar solicitudes al montar el componente
  React.useEffect(() => {
    loadSolicitudes();
  }, []);

  // Datos de ejemplo (se mantendrán como fallback)
  const solicitudesEjemplo = React.useMemo(() => [
    {
      "_id": "SOL-2025-001",
      "codigoSolicitud": "AAA-0001",
      "fechaCreacion": "2025-11-23T09:30:00Z",
      "estadoGeneral": "Aprobado", 
      "activoId": "ACT-100",        
      "solicitanteId": "USR-005",   
      "nombreActivo": "Servidor Web Principal",
      "justificacion": "El servidor requiere mantenimiento preventivo urgente debido a sobrecalentamiento detectado en los sensores de temperatura durante la última revisión rutinaria del sistema.",
      "cambios": [
        {
          "campo": "estado",
          "valorAnterior": "Activo",
          "valorNuevo": "En Mantenimiento"
        },
        {
          "campo": "descripcion",
          "valorAnterior": "Servidor de la empresa",
          "valorNuevo": "Servidor en reparación por fallas térmicas"
        }
      ],
      "aprobaciones": {
        "seguridad": {
          "responsableId": "USR-008", 
          "fecha": "2025-11-23T14:00:00Z",
          "estado": "Aprobado",
          "comentario": "Se valida que el mantenimiento no afecta la seguridad perimetral."
        },
        "auditoria": {
          "responsableId": "USR-009",
          "fecha": "2025-11-24T09:00:00Z",
          "estado": "Aprobado",
          "comentario": "Proceso conforme a la normativa ISO."
        }
      }
    },
    {
      "_id": "SOL-2025-002",
      "codigoSolicitud": "BBB-0002",
      "fechaCreacion": "2025-11-22T10:15:00Z",
      "estadoGeneral": "Pendiente",
      "activoId": "ACT-101",        
      "solicitanteId": "USR-006",   
      "nombreActivo": "Base de Datos MySQL",
      "justificacion": "Actualización de configuración de seguridad requerida para compliance con nuevas regulaciones de protección de datos implementadas este trimestre, incluyendo encriptación avanzada y políticas de retención.",
      "cambios": [
        {
          "campo": "configuracion",
          "valorAnterior": "Configuración estándar",
          "valorNuevo": "Configuración extendida con encriptación"
        }
      ],
      "aprobaciones": {
        "seguridad": {
          "responsableId": "USR-008", 
          "fecha": "2025-11-22T16:30:00Z",
          "estado": "Aprobado",
          "comentario": "Configuración cumple con políticas de seguridad."
        },
        "auditoria": {
          "responsableId": "USR-009",
          "fecha": null,
          "estado": "Pendiente",
          "comentario": ""
        }
      }
    },
    {
      "_id": "SOL-2025-003",
      "codigoSolicitud": "CCC-0003",
      "fechaCreacion": "2025-11-21T08:45:00Z",
      "estadoGeneral": "Rechazado", 
      "activoId": "ACT-102",        
      "solicitanteId": "USR-007",   
      "nombreActivo": "Firewall Corporativo",
      "justificacion": "Cambio en reglas de firewall para nuevo departamento de desarrollo que requiere acceso a puertos específicos para herramientas de integración continua y despliegue automático.",
      "cambios": [
        {
          "campo": "reglas_firewall",
          "valorAnterior": "Reglas básicas",
          "valorNuevo": "Reglas extendidas para departamento nuevo"
        }
      ],
      "aprobaciones": {
        "seguridad": {
          "responsableId": "USR-008", 
          "fecha": "2025-11-21T15:20:00Z",
          "estado": "Rechazado",
          "comentario": "Las reglas propuestas presentan vulnerabilidades de seguridad."
        },
        "auditoria": {
          "responsableId": null,
          "fecha": null,
          "estado": "No Aplica",
          "comentario": ""
        }
      }
    },
    {
      "_id": "SOL-2025-004",
      "codigoSolicitud": "DDD-0004",
      "fechaCreacion": "2025-11-25T11:00:00Z",
      "estadoGeneral": "Pendiente", 
      "activoId": "ACT-103",        
      "solicitanteId": "USR-010",   
      "nombreActivo": "Servidor de Aplicaciones",
      "justificacion": "Migración a nueva versión del sistema operativo para mantener soporte técnico y recibir actualizaciones de seguridad críticas que ya no están disponibles en la versión actual.",
      "cambios": [
        {
          "campo": "version_so",
          "valorAnterior": "Windows Server 2019",
          "valorNuevo": "Windows Server 2022"
        },
        {
          "campo": "estado",
          "valorAnterior": "Activo",
          "valorNuevo": "En Migración"
        }
      ],
      "aprobaciones": {
        "seguridad": {
          "responsableId": null,
          "fecha": null,
          "estado": "Pendiente",
          "comentario": ""
        },
        "auditoria": {
          "responsableId": null,
          "fecha": null,
          "estado": "Pendiente",
          "comentario": ""
        }
      }
    }
  ], []);

  // Función para transformar solicitudes del backend al formato esperado por el frontend
  const transformSolicitud = (solicitud) => {
    return {
      _id: solicitud.id,
      codigoSolicitud: solicitud.codigoSolicitud,
      fechaCreacion: solicitud.fechaSolicitud,
      estadoGeneral: solicitud.estado,
      activoId: solicitud.codigoActivo,
      solicitanteId: solicitud.solicitante?.id,
      nombreActivo: solicitud.nombreActivo,
      justificacion: solicitud.justificacion || 'Sin justificación',
      // Simular estructura de cambios si no existe
      cambios: [
        {
          campo: 'solicitud',
          valorAnterior: 'Estado anterior',
          valorNuevo: `Operación: ${solicitud.tipoOperacion}`
        }
      ],
      // Simular estructura de aprobaciones basada en los datos del backend
      aprobaciones: {
        seguridad: {
          responsableId: solicitud.responsableSeguridad?.id,
          fecha: solicitud.fechaRevision,
          estado: solicitud.estado === 'Pendiente' ? 'Pendiente' : (solicitud.estado === 'Aprobado' ? 'Aprobado' : 'Rechazado'),
          comentario: solicitud.comentarioSeguridad || ''
        },
        auditoria: {
          responsableId: null,
          fecha: null,
          estado: 'Pendiente',
          comentario: ''
        }
      }
    };
  };

  // Función para formatear fecha
  const formatFecha = (fechaISO) => {
    if (!fechaISO) return "No asignada";
    return new Date(fechaISO).toLocaleDateString('es-ES');
  };

  // Transformar datos del backend si están disponibles, sino usar los de ejemplo
  const solicitudesTransformadas = React.useMemo(() => {
    return solicitudes.length > 0 
      ? solicitudes.map(transformSolicitud) 
      : (loading ? [] : solicitudesEjemplo);
  }, [solicitudes, loading, solicitudesEjemplo]);

  const handleFilter = useCallback((filters) => {
    if (!filters.name && !filters.estado) {
      setFilteredSolicitudes([]);
      setIsFiltered(false);
      return;
    }

    const filtered = solicitudesTransformadas.filter((solicitud) => {
      if (filters.name) {
        const searchTerm = filters.name.toLowerCase();
        const matchesNombre = solicitud.nombreActivo
          .toLowerCase()
          .includes(searchTerm);
        const matchesCodigo = solicitud.codigoSolicitud
          .toLowerCase()
          .includes(searchTerm);
        if (!matchesNombre && !matchesCodigo) {
          return false;
        }
      }

      if (filters.estado && solicitud.estadoGeneral !== filters.estado) {
        return false;
      }

      return true;
    });

    setFilteredSolicitudes(filtered);
    setIsFiltered(true);
  }, [solicitudesTransformadas]);

  const handleVerDetalles = (solicitud) => {
    console.log("CLICK en Ver Detalles:", solicitud);
    if (onNavigateToDetalles) {
      onNavigateToDetalles(solicitud);
    }
  };

  const searchFields = [
    {
      name: "name",
      label: "Nombre",
      type: "text",
      placeholder: "Busque por nombre o código del activo",
    },
    {
      name: "estado",
      label: "Estado",
      type: "select",
      options: [
        { value: "Aprobado", label: "Aprobado" },
        { value: "Rechazado", label: "Rechazado" },
        { value: "Pendiente", label: "Pendiente" }, 
      ],
    },
  ];

  const solicitudesToShow = isFiltered ? filteredSolicitudes : solicitudesTransformadas;

  const getEstadoClass = (estado) => {
    switch (estado) {
      case "Aprobado":
        return "estado-badge estado-aprobado";
      case "Rechazado":
        return "estado-badge estado-rechazado";
      case "Pendiente":
        return "estado-badge estado-pendiente";
      default:
        return "estado-badge estado-default";
    }
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case "Aprobado":
        return <FaCheck className="me-1" />;
      case "Rechazado":
        return <FaTimes className="me-1" />;
      case "Pendiente":
        return <FaClock className="me-1" />;
      default:
        return <FaClock className="me-1" />;
    }
  };

  const tableColumns = [
    {
      key: "activo",
      label: "Activo",
      render: (row) => (
        <div>
          <div className="fw-bold">{row.nombreActivo}</div>
          <div className="text-muted small">Código: {row.codigoSolicitud}</div>
        </div>
      ),
      cellStyle: { 
        minWidth: "200px",
        maxWidth: "250px"
      }
    },
    {
      key: "fechaCreacion",
      label: "Fecha de Solicitud",
      render: (row) => formatFecha(row.fechaCreacion),
      cellStyle: { 
        minWidth: "150px",
        maxWidth: "180px"
      }
    },
    {
      key: "estadoGeneral",
      label: "Estado",
      render: (row) => (
        <span className={getEstadoClass(row.estadoGeneral)}>
          {getEstadoIcon(row.estadoGeneral)}
          {row.estadoGeneral}
        </span>
      ),
      cellStyle: { 
        minWidth: "150px",
        maxWidth: "180px",
        textAlign: "center"
      }
    },
    {
      key: "justificacion",
      label: "Justificación",
      render: (row) => (
        <div className="justificacion-cell">
          {row.justificacion}
        </div>
      ),
      cellStyle: { 
        minWidth: "300px",
        maxWidth: "400px"
      }
    },
    {
      key: "acciones",
      label: "Acciones",
      render: (row) => (
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleVerDetalles(row);
          }}
          type="button"
          className="btn-ver-detalles"
        >
          Ver Detalles
        </Button>
      ),
      cellStyle: { 
        minWidth: "120px",
        maxWidth: "150px",
        textAlign: "center"
      }
    },
  ];

  // Estado de carga
  if (loading) {
    return (
      <div className="solicitudes-page">
        <div className="user-header">
          <div className="user-header-text">
            <h2>Control de Cambios - Mis Solicitudes</h2>
            <h6>Seguimiento de solicitudes de cambio según ISO 27001</h6>
          </div>
        </div>
        <div className="text-center p-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2">Cargando solicitudes...</p>
        </div>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="solicitudes-page">
        <div className="user-header">
          <div className="user-header-text">
            <h2>Control de Cambios - Mis Solicitudes</h2>
            <h6>Seguimiento de solicitudes de cambio según ISO 27001</h6>
          </div>
        </div>
        <div className="alert alert-danger text-center">
          <h5>Error al cargar solicitudes</h5>
          <p>{error}</p>
          <button 
            className="btn btn-primary mt-2" 
            onClick={loadSolicitudes}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="solicitudes-page">
      <div className="user-header">
        <div className="user-header-text">
          <h2>Control de Cambios - Mis Solicitudes</h2>
          <h6>Seguimiento de solicitudes de cambio según ISO 27001 ({solicitudesTransformadas.length} solicitudes)</h6>
        </div>
      </div>

      <SearchBar fields={searchFields} onFilter={handleFilter} />

      <div className="mt-4">
        <Table 
          columns={tableColumns} 
          data={solicitudesToShow}
          hoverEffect={true}
          bordered={true}
        />
      </div>
    </div>
  );
};

export default Solicitudes;