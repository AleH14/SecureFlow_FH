"use client";
import React, { useState, useCallback, useEffect, useRef } from "react";
import { SearchBar, Table, Button } from "../../../components/ui";
import { FaCheck, FaTimes, FaClock, FaUser } from "react-icons/fa";

const Solicitudes = ({ onNavigateToDetalles }) => {
  const [filteredSolicitudes, setFilteredSolicitudes] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const tableRef = useRef(null);

  // Datos 
  const solicitudes = [
    {
      _id: "SOL-2025-001",
      codigoSolicitud: "AAA-0001",
      fechaCreacion: "2025-11-23T09:30:00Z",
      estadoGeneral: "Aprobado",
      activoId: "ACT-100",
      solicitanteId: "USR-005",
      solicitante: "Abigail Flores",
      categoria: "Infraestructura",
      nombreActivo: "Servidor Web Principal",
      justificacion:
        "El servidor requiere mantenimiento preventivo urgente debido a sobrecalentamiento detectado en los sensores de temperatura durante la última revisión rutinaria del sistema.",
      cambios: [
        {
          campo: "estado",
          valorAnterior: "Activo",
          valorNuevo: "En Mantenimiento",
        },
        {
          campo: "descripcion",
          valorAnterior: "Servidor de la empresa",
          valorNuevo: "Servidor en reparación por fallas térmicas",
        },
      ],
      aprobaciones: {
        seguridad: {
          responsableId: "USR-008",
          fecha: "2025-11-23T14:00:00Z",
          estado: "Aprobado",
          comentario:
            "Se valida que el mantenimiento no afecta la seguridad perimetral.",
        },
        auditoria: {
          responsableId: "USR-009",
          fecha: "2025-11-24T09:00:00Z",
          estado: "Aprobado",
          comentario: "Proceso conforme a la normativa ISO.",
        },
      },
    },
    {
      _id: "SOL-2025-002",
      codigoSolicitud: "BBB-0002",
      fechaCreacion: "2025-11-22T10:15:00Z",
      estadoGeneral: "Pendiente",
      activoId: "ACT-101",
      solicitanteId: "USR-006",
      solicitante: "Javier Orellana",
      categoria: "Base de Datos",
      nombreActivo: "Base de Datos MySQL",
      justificacion:
        "Actualización de configuración de seguridad requerida para compliance con nuevas regulaciones de protección de datos implementadas este trimestre, incluyendo encriptación avanzada y políticas de retención.",
      cambios: [
        {
          campo: "configuracion",
          valorAnterior: "Configuración estándar",
          valorNuevo: "Configuración extendida con encriptación",
        },
      ],
      aprobaciones: {
        seguridad: {
          responsableId: "USR-008",
          fecha: "2025-11-22T16:30:00Z",
          estado: "Aprobado",
          comentario: "Configuración cumple con políticas de seguridad.",
        },
        auditoria: {
          responsableId: "USR-009",
          fecha: null,
          estado: "Pendiente",
          comentario: "",
        },
      },
    },
    {
      _id: "SOL-2025-003",
      codigoSolicitud: "CCC-0003",
      fechaCreacion: "2025-11-21T08:45:00Z",
      estadoGeneral: "Rechazado",
      activoId: "ACT-102",
      solicitanteId: "USR-007",
      solicitante: "Andrés Aguilar",
      categoria: "Seguridad",
      nombreActivo: "Firewall Corporativo",
      justificacion:
        "Cambio en reglas de firewall para nuevo departamento de desarrollo que requiere acceso a puertos específicos para herramientas de integración continua y despliegue automático.",
      cambios: [
        {
          campo: "reglas_firewall",
          valorAnterior: "Reglas básicas",
          valorNuevo: "Reglas extendidas para departamento nuevo",
        },
      ],
      aprobaciones: {
        seguridad: {
          responsableId: "USR-008",
          fecha: "2025-11-21T15:20:00Z",
          estado: "Rechazado",
          comentario:
            "Las reglas propuestas presentan vulnerabilidades de seguridad.",
        },
        auditoria: {
          responsableId: null,
          fecha: null,
          estado: "No Aplica",
          comentario: "",
        },
      },
    },
    {
      _id: "SOL-2025-004",
      codigoSolicitud: "DDD-0004",
      fechaCreacion: "2025-11-25T11:00:00Z",
      estadoGeneral: "Pendiente",
      activoId: "ACT-103",
      solicitanteId: "USR-010",
      solicitante: "Valeria Enriquez",
      categoria: "Infraestructura",
      nombreActivo: "Servidor de Aplicaciones",
      justificacion:
        "Migración a nueva versión del sistema operativo para mantener soporte técnico y recibir actualizaciones de seguridad críticas que ya no están disponibles en la versión actual.",
      cambios: [
        {
          campo: "version_so",
          valorAnterior: "Windows Server 2019",
          valorNuevo: "Windows Server 2022",
        },
        {
          campo: "estado",
          valorAnterior: "Activo",
          valorNuevo: "En Migración",
        },
      ],
      aprobaciones: {
        seguridad: {
          responsableId: null,
          fecha: null,
          estado: "Pendiente",
          comentario: "",
        },
        auditoria: {
          responsableId: null,
          fecha: null,
          estado: "Pendiente",
          comentario: "",
        },
      },
    },
  ];

  const solicitudesToShow = isFiltered ? filteredSolicitudes : solicitudes;

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

    const filtered = solicitudes.filter((solicitud) => {
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
  }, []);

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

  return (
    <div className="solicitudes-page">
      <div className="user-header">
        <div className="user-header-text">
          <h2>Panel de Revisión</h2>
          <h6>Gestión de solicitudes de cambio de activos</h6>
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