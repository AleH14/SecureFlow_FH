"use client";
import React, { useState, useCallback } from "react";
import { SearchBar, Table, Button } from "../../../components/ui";
import { FaCheck, FaTimes, FaClock } from "react-icons/fa";
import { RequestService } from "@/services";

const Solicitudes = ({ onNavigateToDetalles }) => {
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

  // Transformar datos del backend si están disponibles
  const solicitudesTransformadas = React.useMemo(() => {
    return solicitudes.length > 0 
      ? solicitudes.map(transformSolicitud) 
      : [];
  }, [solicitudes]);

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
        {solicitudesToShow.length === 0 ? (
          <div className="alert alert-info text-center py-4">
            <h5>No se encontraron solicitudes</h5>
            {isFiltered ? (
              <p>No hay solicitudes que coincidan con los filtros aplicados.</p>
            ) : (
              <p>Aún no has creado ninguna solicitud de cambio. Las solicitudes aparecerán aquí una vez que crees tu primer activo o modifiques uno existente.</p>
            )}
            {isFiltered && (
              <button 
                className="btn btn-outline-primary mt-2" 
                onClick={() => {
                  setFilteredSolicitudes([]);
                  setIsFiltered(false);
                }}
              >
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          <Table 
            columns={tableColumns} 
            data={solicitudesToShow}
            hoverEffect={true}
            bordered={true}
          />
        )}
      </div>
    </div>
  );
};

export default Solicitudes;