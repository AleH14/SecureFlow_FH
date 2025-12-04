"use client";
import React, { useState, useCallback, useEffect, useRef } from "react";
import { SearchBar, Table, Button } from "../../../components/ui";
import { FaCheck, FaTimes, FaClock, FaUser } from "react-icons/fa";
import { RequestService } from "../../../services";

const Solicitudes = ({ onNavigateToDetalles, onSolicitudesLoaded }) => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredSolicitudes, setFilteredSolicitudes] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const tableRef = useRef(null);

  // Función para cargar solicitudes desde la API
  const loadSolicitudes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await RequestService.getRequests();
      
      if (response && response.success && response.data) {
        setSolicitudes(response.data.solicitudes || []);
        console.log(`Cargadas ${response.data.solicitudes?.length || 0} solicitudes de seguridad`);
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
  useEffect(() => {
    loadSolicitudes();
  }, []);

  // Función para transformar solicitudes del backend al formato esperado por el frontend
  const transformSolicitud = (solicitud) => {
    // Inferir categoría basada en el nombre del activo para mantener compatibilidad
    let categoria = "General";
    const nombre = solicitud.nombreActivo.toLowerCase();
    if (nombre.includes("servidor") || nombre.includes("infraestructura")) {
      categoria = "Infraestructura";
    } else if (nombre.includes("base") && nombre.includes("datos")) {
      categoria = "Base de Datos";
    } else if (nombre.includes("firewall") || nombre.includes("seguridad")) {
      categoria = "Seguridad";
    }

    return {
      _id: solicitud.id,
      codigoSolicitud: solicitud.codigoSolicitud,
      fechaCreacion: solicitud.fechaSolicitud,
      estadoGeneral: solicitud.estado,
      activoId: solicitud.codigoActivo,
      solicitanteId: solicitud.solicitante?.id,
      solicitante: solicitud.solicitante?.nombreCompleto || 'Usuario desconocido',
      categoria: categoria,
      nombreActivo: solicitud.nombreActivo,
      tipoOperacion: solicitud.tipoOperacion, // Agregar el tipo de operación
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

  // Transformar datos del backend si están disponibles, sino mostrar array vacío
  const solicitudesTransformadas = React.useMemo(() => {
    const transformed = solicitudes.length > 0 
      ? solicitudes.map(transformSolicitud) 
      : [];
    
    // Notificar al componente padre sobre las solicitudes cargadas
    if (onSolicitudesLoaded && transformed.length > 0) {
      onSolicitudesLoaded(transformed);
    }
    
    return transformed;
  }, [solicitudes, onSolicitudesLoaded]);

  const solicitudesToShow = isFiltered ? filteredSolicitudes : solicitudesTransformadas;

  // Función para aplicar estilos a filas pendientes
  useEffect(() => {
    const colorPendingRows = () => {
      if (tableRef.current) {
        const rows = tableRef.current.querySelectorAll("tbody tr");

        rows.forEach((row, index) => {
          const solicitud = solicitudesToShow[index];

          // Aplicar fondo amarillo solo a filas pendientes
          if (solicitud && solicitud.estadoGeneral === "Pendiente") {
            row.style.backgroundColor = "#fff9db";
            row.style.transition = "background-color 0.2s ease";
          } else {
            // Restaurar estilos por defecto
            row.style.backgroundColor = "";
            row.style.transition = "";
          }
        });
      }
    };

    const timeoutId = setTimeout(colorPendingRows, 100);
    return () => clearTimeout(timeoutId);
  }, [solicitudesToShow]);

  // Función para formatear fecha
  const formatFecha = (fechaISO) => {
    if (!fechaISO) return "No asignada";
    return new Date(fechaISO).toLocaleDateString("es-ES");
  };

  const handleFilter = useCallback((filters) => {
    if (!filters.name && !filters.estado && !filters.categoria) {
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
        const matchesSolicitante = solicitud.solicitante
          .toLowerCase()
          .includes(searchTerm);
        if (!matchesNombre && !matchesCodigo && !matchesSolicitante) {
          return false;
        }
      }

      if (filters.estado && solicitud.estadoGeneral !== filters.estado) {
        return false;
      }

      if (filters.categoria && solicitud.categoria !== filters.categoria) {
        return false;
      }

      return true;
    });

    setFilteredSolicitudes(filtered);
    setIsFiltered(true);
  }, [solicitudesTransformadas]);

  const handleRevisar = (solicitud) => {
    console.log("CLICK en Revisar:", solicitud);
    if (onNavigateToDetalles) {
      onNavigateToDetalles(solicitud);
    }
  };

  const handleVerDetalles = (solicitud) => {
    console.log("CLICK en Ver Detalles:", solicitud);
    if (onNavigateToDetalles) {
      onNavigateToDetalles(solicitud);
    }
  };

  const searchFields = [
    {
      name: "name",
      label: "Buscar",
      type: "text",
      placeholder: "Buscar por activo (nombre/código) o responsable",
    },
    {
      name: "categoria",
      label: "Categoría",
      type: "select",
      options: [
        { value: "Infraestructura", label: "Infraestructura" },
        { value: "Base de Datos", label: "Base de Datos" },
        { value: "Seguridad", label: "Seguridad" },
      ],
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

  // Usar las clases CSS definidas en tus estilos
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
    },
    {
      key: "fechaCreacion",
      label: "Fecha",
      render: (row) => formatFecha(row.fechaCreacion),
    },
    {
      key: "solicitante",
      label: "Solicitante",
      render: (row) => (
        <div className="d-flex align-items-center">
          <FaUser className="me-2 text-muted" />
          {row.solicitante}
        </div>
      ),
    },
    {
      key: "categoria",
      label: "Categoría",
      // Usando la clase version-badge 
      render: (row) => <span className="version-badge">{row.categoria}</span>,
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
            if (row.estadoGeneral === "Pendiente") {
              handleRevisar(row);
            } else {
              handleVerDetalles(row);
            }
          }}
          type="button"
          className="btn-accion-solicitud"
        >
          {row.estadoGeneral === "Pendiente" ? "Revisar" : "Ver Detalles"}
        </Button>
      ),
    },
  ];

  // Estado de carga
  if (loading) {
    return (
      <div className="solicitudes-page">
        <div className="user-header">
          <div className="user-header-text">
            <h2>Panel de Revisión</h2>
            <h6>Gestión de solicitudes de cambio de activos</h6>
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
            <h2>Panel de Revisión</h2>
            <h6>Gestión de solicitudes de cambio de activos</h6>
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
          <h2>Panel de Revisión</h2>
          <h6>Gestión de solicitudes de cambio de activos ({solicitudesTransformadas.length} solicitudes)</h6>
        </div>
      </div>

      <SearchBar fields={searchFields} onFilter={handleFilter} />

      {/* Pasar una prop personalizada para el efecto hover */}
      <div className="mt-4" ref={tableRef}>
        <Table 
          columns={tableColumns} 
          data={solicitudesToShow} 
          hoverEffect={true}
        />
      </div>

      <style jsx global>{`
      //BOTON VER DETALLER Y REVISAR MISMO TAMAÑO
        .btn-accion-solicitud {
          min-width: 120px !important;
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          text-align: center !important;
        }
      `}</style>
    </div>
  );
};

export default Solicitudes;