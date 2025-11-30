"use client";
import React, { useState, useCallback } from "react";
import { SearchBar, Table, Button } from "../../../components/ui";
import { FaCheck, FaTimes, FaClock } from "react-icons/fa";

const Solicitudes = ({ onNavigateToDetalles }) => {
  const [filteredSolicitudes, setFilteredSolicitudes] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);

  // Datos actualizados con la nueva estructura
  const solicitudes = [
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
      "estadoGeneral": "En Revisión", 
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
      "estadoGeneral": "En Revisión", 
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
  ];

  // Función para formatear fecha
  const formatFecha = (fechaISO) => {
    if (!fechaISO) return "No asignada";
    return new Date(fechaISO).toLocaleDateString('es-ES');
  };

  const handleFilter = useCallback((filters) => {
    if (!filters.name && !filters.estado) {
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
  }, []);

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
        { value: "En Revisión", label: "En Revisión" },
      ],
    },
  ];

  const solicitudesToShow = isFiltered ? filteredSolicitudes : solicitudes;

  const getEstadoStyle = (estado) => {
    const baseStyle = {
      display: "inline-flex",
      alignItems: "center",
      padding: "0.5rem 1rem",
      borderRadius: "20px",
      fontSize: "0.75rem",
      fontWeight: "600",
      textTransform: "uppercase",
      whiteSpace: "nowrap",
      color: "white",
    };

    switch (estado) {
      case "Aprobado":
        return { ...baseStyle, backgroundColor: "#26AC17" };
      case "Rechazado":
        return { ...baseStyle, backgroundColor: "#EB1008" };
      case "En Revisión":
        return { ...baseStyle, backgroundColor: "#f59e0b" };
      default:
        return { ...baseStyle, backgroundColor: "#6b7280" };
    }
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case "Aprobado":
        return <FaCheck className="me-1" />;
      case "Rechazado":
        return <FaTimes className="me-1" />;
      case "En Revisión":
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
      label: "Fecha de Solicitud",
      render: (row) => formatFecha(row.fechaCreacion),
    },
    {
      key: "estadoGeneral",
      label: "Estado",
      render: (row) => (
        <span style={getEstadoStyle(row.estadoGeneral)}>
          {getEstadoIcon(row.estadoGeneral)}
          {row.estadoGeneral}
        </span>
      ),
    },
    {
      key: "justificacion",
      label: "Justificación",
      render: (row) => (
        <div 
          className="justificacion-cell"
          style={{ 
            maxWidth: "400px",
            minWidth: "300px",
            wordWrap: "break-word",
            whiteSpace: "normal",
            lineHeight: "1.5",
            padding: "1rem 1.25rem"
          }}
        >
          {row.justificacion}
        </div>
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
            handleVerDetalles(row);
          }}
          type="button"
        >
          Ver Detalles
        </Button>
      ),
    },
  ];

  return (
    <div className="solicitudes-page">
      <div className="user-header">
        <div className="user-header-text">
          <h2>Control de Cambios - Mis Solicitudes</h2>
          <h6>Seguimiento de solicitudes de cambio según ISO 27001</h6>
        </div>
      </div>

      <SearchBar fields={searchFields} onFilter={handleFilter} />

      <div className="mt-4" style={{ fontSize: "1rem" }}>
        <div className="table-responsive" style={{ width: "100%" }}>
          <Table 
            columns={tableColumns} 
            data={solicitudesToShow}
            className="solicitudes-table"
          />
        </div>
      </div>

      <style jsx>{`
        // Estilos para la tabla de solicitudes
        :global(.solicitudes-table table) {
          table-layout: fixed;
          width: 100%;
        }
        
        :global(.solicitudes-table th:nth-child(1)),
        :global(.solicitudes-table td:nth-child(1)) {
          width: 20%;
        }
        
        :global(.solicitudes-table th:nth-child(2)),
        :global(.solicitudes-table td:nth-child(2)) {
          width: 15%;
        }
        
        :global(.solicitudes-table th:nth-child(3)),
        :global(.solicitudes-table td:nth-child(3)) {
          width: 15%;
        }
        
        :global(.solicitudes-table th:nth-child(4)),
        :global(.solicitudes-table td:nth-child(4)) {
          width: 35%;
        }
        
        :global(.solicitudes-table th:nth-child(5)),
        :global(.solicitudes-table td:nth-child(5)) {
          width: 15%;
        }
        
        // MEJOR ESPACIADO PARA JUSTIFICACIÓN
        :global(.justificacion-cell) {
          min-height: 70px;
          display: flex;
          align-items: center;
          word-wrap: break-word;
          white-space: normal;
          line-height: 1.5;
        }

        // PADDING DE 20px PARA TODAS LAS COLUMNAS
        :global(.solicitudes-table th) {
          padding: 1rem 1.25rem;
          background-color: #f8f9fa;
          border-bottom: 2px solid #dee2e6;
        }
        
        :global(.solicitudes-table td) {
          padding: 1rem 1.25rem;
          vertical-align: top;
        }

        // RESPONSIVIDAD DESDE ANCHO MAYOR (1200px)
        @media (max-width: 1200px) {
          :global(.solicitudes-table table) {
            min-width: 900px;
          }
          
          :global(.solicitudes-table th),
          :global(.solicitudes-table td) {
            padding: 0.875rem 1rem;
          }
          
          :global(.justificacion-cell) {
            min-height: 65px;
            font-size: 0.9rem;
            padding: 0.875rem 1rem !important;
          }
        }

        @media (max-width: 992px) {
          :global(.solicitudes-table table) {
            min-width: 850px;
          }
          
          :global(.solicitudes-table th),
          :global(.solicitudes-table td) {
            padding: 0.75rem 0.875rem;
          }
          
          :global(.justificacion-cell) {
            min-height: 60px;
            font-size: 0.875rem;
            padding: 0.75rem 0.875rem !important;
          }
          
          :global(.user-header h2) {
            font-size: 1.5rem;
          }
          
          :global(.user-header h6) {
            font-size: 0.9rem;
          }
        }

        @media (max-width: 768px) {
          :global(.solicitudes-page) {
            padding: 1rem;
          }
          
          :global(.solicitudes-table th),
          :global(.solicitudes-table td) {
            padding: 0.625rem 0.75rem;
          }
          
          :global(.justificacion-cell) {
            min-height: 55px;
            padding: 0.625rem 0.75rem !important;
          }
          
          :global(.user-header h2) {
            font-size: 1.35rem;
          }
        }

        @media (max-width: 576px) {
          :global(.solicitudes-page) {
            padding: 0.75rem;
          }
          
          :global(.solicitudes-table th),
          :global(.solicitudes-table td) {
            padding: 0.5rem 0.625rem;
          }
          
          :global(.justificacion-cell) {
            min-height: 50px;
            padding: 0.5rem 0.625rem !important;
          }
          
          :global(.user-header h2) {
            font-size: 1.25rem;
          }
          
          :global(.user-header h6) {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Solicitudes;