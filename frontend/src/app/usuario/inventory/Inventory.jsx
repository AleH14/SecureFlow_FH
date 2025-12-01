import React, { useState, useCallback } from "react";
import { useRouter } from 'next/navigation';
import { SearchBar, CardActivo } from "../../../components/ui";
import { FaPlusSquare } from "react-icons/fa";

const Inventory = ({ 
  className = "", 
  onNavigateToSCV, 
  onNavigateToNuevoActivo,
  onNavigateToModificarActivo,
  ...props 
}) => {
  const router = useRouter();
  const [filteredActivos, setFilteredActivos] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);

  const handleCreateNewActivo = () => {
    if (onNavigateToNuevoActivo) {
      onNavigateToNuevoActivo();
    } else {
      router.push("/usuario/activos/nuevo");
    }
  };

  const handleFilter = useCallback((filters) => {


    if (!filters.name && !filters.category && !filters.estado) {
      setFilteredActivos([]);
      setIsFiltered(false);
      return;
    }

    const filtered = activos.filter((activo) => {
      if (filters.name) {
        const searchTerm = filters.name.toLowerCase();
        const matchesName = activo.nombre.toLowerCase().includes(searchTerm);
        const matchesCode = activo.codigo.toLowerCase().includes(searchTerm);
        const matchesResponsible = activo.responsable
          .toLowerCase()
          .includes(searchTerm);

        if (!matchesName && !matchesCode && !matchesResponsible) {
          return false;
        }
      }

      if (filters.category && activo.categoria !== filters.category) {
        return false;
      }

      if (filters.estado && activo.estado !== filters.estado) {
        return false;
      }

      return true;
    });

    setFilteredActivos(filtered);
    setIsFiltered(true);
  }, []);

  const handleHistorialClick = (activo) => {

    if (onNavigateToSCV) {
      onNavigateToSCV(activo);
    }
  };

  const handleModificarClick = (activo) => {


    
    if (onNavigateToModificarActivo) {

      onNavigateToModificarActivo(activo, "inventory");
    } else {

    }
  };

  // Función para obtener el estilo del badge según el estado
  const getEstadoBadgeStyle = (estado) => {
    switch (estado) {
      case 'activo':
        return {
          backgroundColor: '#28a745',
          color: 'white'
        };
      case 'en mantenimiento':
        return {
          backgroundColor: '#ffc107', // AMARILLO
          color: 'black'
        };
      case 'inactivo':
        return {
          backgroundColor: '#dc3545',
          color: 'white'
        };
      case 'en evaluación':
        return {
          backgroundColor: '#17a2b8', // CELESTE
          color: 'white'
        };
      case 'dado de baja':
        return {
          backgroundColor: '#495057', // GRIS OSCURO
          color: 'white'
        };
      case 'obsoleto':
        return {
          backgroundColor: '#6c757d', // GRIS CLARO
          color: 'white'
        };
      default:
        return {
          backgroundColor: '#6c757d',
          color: 'white'
        };
    }
  };

  // Datos de ejemplo ACTUALIZADOS para coincidir con estadosOptions
  const activos = [
    {
      nombre: "Servidor Web Principal",
      codigo: "SWP-001",
      estado: "activo",
      categoria: "Infraestructura",
      descripcion: "Servidor web para aplicaciones corporativas con balanceador de carga",
      responsable: "Abigail Flores",
      version: "v1.0.0",
      ubicacion: "Sala 5 - Dep TI",
      fecha_creacion: "2025-11-23",
      acciones_disponibles: ["Historial de Versiones"],
    },
    {
      nombre: "Base de Datos MySQL",
      codigo: "BDM-002",
      estado: "en mantenimiento",
      categoria: "Base de Datos",
      descripcion: "Base de datos principal para almacenamiento de información corporativa",
      responsable: "Javier Orellana",
      version: "v2.1.3",
      ubicacion: "Sala 3 - Dep TI",
      fecha_creacion: "2025-11-20",
      acciones_disponibles: ["Historial de Versiones"],
    },
    {
      nombre: "Sistema de Backup",
      codigo: "SBK-003",
      estado: "inactivo",
      categoria: "Respaldo",
      descripcion: "Sistema automatizado de respaldos nocturnos",
      responsable: "Valeria Enriquez",
      version: "v1.5.2",
      ubicacion: "Sala 7 - Dep TI",
      fecha_creacion: "2025-11-18",
      acciones_disponibles: ["Historial de Versiones"],
    },
    {
      nombre: "Firewall Corporativo",
      codigo: "FWC-004",
      estado: "en evaluación",
      categoria: "Seguridad",
      descripcion: "Firewall de nueva generación para protección perimetral",
      responsable: "Andrés Aguilar",
      version: "v3.0.1",
      ubicacion: "Sala 1 - Seguridad",
      fecha_creacion: "2025-11-25",
      acciones_disponibles: ["Historial de Versiones"],
    },
    {
      nombre: "Servidor de Aplicaciones Legacy",
      codigo: "SAL-005",
      estado: "obsoleto",
      categoria: "Infraestructura",
      descripcion: "Servidor de aplicaciones legacy para sistemas heredados",
      responsable: "Carlos Mendoza",
      version: "v1.2.0",
      ubicacion: "Sala 2 - Dep TI",
      fecha_creacion: "2025-11-15",
      acciones_disponibles: ["Historial de Versiones"],
    },
    {
      nombre: "Equipo de Desarrollo Descontinuado",
      codigo: "EDD-006",
      estado: "dado de baja",
      categoria: "Infraestructura",
      descripcion: "Equipo de desarrollo dado de baja por obsolescencia",
      responsable: "Laura González",
      version: "v2.0.0",
      ubicacion: "Almacén - Dep TI",
      fecha_creacion: "2025-11-10",
      acciones_disponibles: ["Historial de Versiones"],
    }
  ];

  const activosToShow = isFiltered ? filteredActivos : activos;

  // Campos de búsqueda ACTUALIZADOS para coincidir con estadosOptions
  const searchFields = [
    {
      name: "name",
      label: "Nombre",
      type: "text",
      placeholder: "Busque activo por nombre, código o responsable",
    },
    {
      name: "category",
      label: "Categoría",
      type: "select",
      options: [
        { value: "Infraestructura", label: "Infraestructura" },
        { value: "Base de Datos", label: "Base de Datos" },
        { value: "Respaldo", label: "Respaldo" },
        { value: "Seguridad", label: "Seguridad" },
      ],
    },
    {
      name: "estado",
      label: "Estado",
      type: "select",
      options: [
        { value: "activo", label: "Activo" },
        { value: "inactivo", label: "Inactivo" },
        { value: "en mantenimiento", label: "En mantenimiento" },
        { value: "dado de baja", label: "Dado de baja" },
        { value: "obsoleto", label: "Obsoleto" },
        { value: "en evaluación", label: "En evaluación" }
      ],
    },
  ];

  return (
    <div className={`inventory-page ${className}`} {...props}>
      <div className="user-header">
        <div className="user-header-text">
          <h2>Inventario de Activos</h2>
          <h6>{activosToShow.length} activos a mi cargo</h6>
        </div>
        <button className="add-user-btn" onClick={handleCreateNewActivo}>
          <FaPlusSquare className="add-user-icon" />
          Crear Nuevo Activo
        </button>
      </div>

      <SearchBar fields={searchFields} onFilter={handleFilter} />

      <div className="activos-grid">
        {activosToShow.map((activo, index) => (
          <CardActivo
            key={index}
            activo={{
              ...activo,
              estadoBadgeStyle: getEstadoBadgeStyle(activo.estado)
            }}
            onHistorialClick={handleHistorialClick}
            onModificarClick={handleModificarClick}
            showModificarButton={true}
          />
        ))}
      </div>
    </div>
  );
};

export default Inventory;