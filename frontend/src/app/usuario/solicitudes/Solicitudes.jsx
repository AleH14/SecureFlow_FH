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
  const [loadingDetalles, setLoadingDetalles] = useState(false);

  // Función para cargar solicitudes desde la API
  const loadSolicitudes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await RequestService.getRequests();
      
      if (response && response.success && response.data) {
        setSolicitudes(response.data.solicitudes || []);
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

  // Función para cargar los detalles completos de una solicitud
  const loadSolicitudDetalles = async (solicitudId) => {
    try {
      setLoadingDetalles(true);
      
      const response = await RequestService.getRequestById(solicitudId);
      
      if (response && response.success && response.data) {
        return response.data;
      } else {
        throw new Error('Formato de respuesta inesperado');
      }
    } catch (err) {
      console.error('Error cargando detalles de solicitud:', err);
      throw err;
    } finally {
      setLoadingDetalles(false);
    }
  };

  // Función para manejar el clic en "Ver Detalles"
  const handleVerDetalles = async (solicitud) => {
    try {
      // Cargar los detalles completos de la solicitud
      const detallesCompletos = await loadSolicitudDetalles(solicitud.id);
      
      if (onNavigateToDetalles) {
        onNavigateToDetalles(detallesCompletos);
      }
    } catch (error) {
      console.error('Error al cargar detalles:', error);
      // Si hay error, mostrar alerta
      alert('Error al cargar los detalles de la solicitud. Por favor intenta de nuevo.');
    }
  };

  // Función para formatear fecha
  const formatFecha = (fechaISO) => {
    if (!fechaISO) return "No asignada";
    return new Date(fechaISO).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Función para filtrar solicitudes
  const handleFilter = useCallback((filters) => {
    if (!filters.name && !filters.estado) {
      setFilteredSolicitudes([]);
      setIsFiltered(false);
      return;
    }

    const filtered = solicitudes.filter((solicitud) => {
      if (filters.name) {
        const searchTerm = filters.name.toLowerCase();
        const matchesNombre = solicitud.nombreActivo?.toLowerCase().includes(searchTerm) || false;
        const matchesCodigo = solicitud.codigoSolicitud?.toLowerCase().includes(searchTerm) || false;
        if (!matchesNombre && !matchesCodigo) {
          return false;
        }
      }

      if (filters.estado && solicitud.estado !== filters.estado) {
        return false;
      }

      return true;
    });

    setFilteredSolicitudes(filtered);
    setIsFiltered(true);
  }, [solicitudes]);

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

  const solicitudesToShow = isFiltered ? filteredSolicitudes : solicitudes;

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
          <div className="text-muted small">Código activo: {row.codigoActivo}</div>
        </div>
      ),
      cellStyle: { 
        minWidth: "200px",
        maxWidth: "250px"
      }
    },
    {
      key: "fechaSolicitud",
      label: "Fecha de Solicitud",
      render: (row) => formatFecha(row.fechaSolicitud),
      cellStyle: { 
        minWidth: "180px",
        maxWidth: "220px"
      }
    },
    {
      key: "estado",
      label: "Estado",
      render: (row) => (
        <span className={getEstadoClass(row.estado)}>
          {getEstadoIcon(row.estado)}
          {row.estado}
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
          {row.justificacion || "Sin justificación"}
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
          disabled={loadingDetalles}
        >
          {loadingDetalles ? "Cargando..." : "Ver Detalles"}
        </Button>
      ),
      cellStyle: { 
        minWidth: "120px",
        maxWidth: "140px",
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
          <h6>Seguimiento de solicitudes de cambio según ISO 27001 ({solicitudes.length} solicitudes)</h6>
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