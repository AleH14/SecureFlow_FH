import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SearchBar, CardActivo } from "../ui";
import { FaPlusSquare } from "react-icons/fa";
import { ActivoService } from "@/services";
import { HiOutlineSearch } from "react-icons/hi";

const InventoryBase = ({
  role = "usuario",
  className = "",
  onNavigateToSCV,
  onNavigateToNuevoActivo,
  onNavigateToModificarActivo,
  showCreateButton = false,
  customTitle,
  customSubtitle,
  ...props
}) => {
  const router = useRouter();
  const [activos, setActivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredActivos, setFilteredActivos] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);

  // Función para cargar activos desde la API
  const loadActivos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ActivoService.getActivos();

      if (response && response.success && response.data) {
        setActivos(response.data.activos || []);
      } else {
        throw new Error("Formato de respuesta inesperado");
      }
    } catch (err) {
      console.error(`Error cargando activos para ${role}:`, err);
      if (err.response?.status === 403) {
        setError(getErrorMessage(role));
      } else {
        setError("Error al cargar los activos. Por favor intenta de nuevo.");
      }
      setActivos([]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar activos al montar el componente
  useEffect(() => {
    loadActivos();
  }, [role]);

  // Mensajes de error específicos por rol
  const getErrorMessage = (userRole) => {
    switch (userRole) {
      case "usuario":
        return "No tienes activos asignados o no tienes permisos para verlos.";
      case "admin":
      case "auditor":
      case "responsable_seguridad":
      default:
        return "No tienes permisos para ver estos activos.";
    }
  };

  // Títulos específicos por rol
  const getRoleTitle = () => {
    if (customTitle) return customTitle;

    switch (role) {
      case "admin":
        return "Inventario de Activos";
      case "auditor":
        return "Inventario de Activos";
      case "responsable_seguridad":
        return "Inventario de Activos - Responsable de Seguridad";
      case "usuario":
      default:
        return "Inventario de Activos";
    }
  };

  // Subtítulos específicos por rol
  const getRoleSubtitle = (activosCount) => {
    if (customSubtitle) return customSubtitle;

    switch (role) {
      case "admin":
        return `${activosCount} activos en total`;
      case "auditor":
        return `${activosCount} activos en total`;
      case "responsable_seguridad":
        return `${activosCount} activos disponibles`;
      case "usuario":
      default:
        return `${activosCount} activos a mi cargo`;
    }
  };

  const handleCreateNewActivo = () => {
    if (onNavigateToNuevoActivo) {
      onNavigateToNuevoActivo();
    } else {
      router.push("/usuario/activos/nuevo");
    }
  };

  const handleFilter = useCallback(
    (filters) => {
      // Si no hay filtros, mostrar todos los activos
      if (!filters.name && !filters.category && !filters.estado) {
        setFilteredActivos([]);
        setIsFiltered(false);
        return;
      }

      // Aplicar filtros
      const filtered = activos.filter((activo) => {
        // Filtro por nombre, código o responsable
        if (filters.name) {
          const searchTerm = filters.name.toLowerCase();
          const matchesName = activo.nombre.toLowerCase().includes(searchTerm);
          const matchesCode = activo.codigo.toLowerCase().includes(searchTerm);

          // Manejo seguro del responsable según el formato del backend
          let matchesResponsible = false;
          if (activo.responsable) {
            if (typeof activo.responsable === "string") {
              matchesResponsible = activo.responsable
                .toLowerCase()
                .includes(searchTerm);
            } else if (activo.responsable.nombreCompleto) {
              matchesResponsible = activo.responsable.nombreCompleto
                .toLowerCase()
                .includes(searchTerm);
            }
          }

          if (!matchesName && !matchesCode && !matchesResponsible) {
            return false;
          }
        }

        // Filtro por categoría
        if (filters.category && activo.categoria !== filters.category) {
          return false;
        }

        // Filtro por estado
        if (filters.estado && activo.estado !== filters.estado) {
          return false;
        }

        return true;
      });

      setFilteredActivos(filtered);
      setIsFiltered(true);
    },
    [activos]
  );

  const handleHistorialClick = (activo) => {
    console.log("Navegando al historial de:", activo.nombre);
    if (onNavigateToSCV) {
      onNavigateToSCV(activo);
    }
  };

  const handleModificarClick = (activo) => {
    console.log("Modificando activo:", activo.nombre);
    if (onNavigateToModificarActivo) {
      onNavigateToModificarActivo(activo, "inventory");
    }
  };

  // Función para transformar activos del backend al formato esperado por CardActivo
  const transformActivo = (activo) => {
    return {
      ...activo,
      responsable:
        activo.responsable?.nombreCompleto ||
        activo.responsable ||
        "Sin asignar",
      fecha_creacion: activo.fechaCreacion
        ? new Date(activo.fechaCreacion).toLocaleDateString("es-ES")
        : "N/A",
      version: activo.version || "v1.0.0",
      acciones_disponibles: ["Historial de Versiones"],
    };
  };

  // Función para obtener el estilo del badge según el estado (solo para usuarios)
  const getEstadoBadgeStyle = (estado) => {
    if (role !== "usuario") return undefined;

    switch (estado) {
      case "activo":
        return { backgroundColor: "#28a745", color: "white" };
      case "en mantenimiento":
        return { backgroundColor: "#ffc107", color: "black" };
      case "inactivo":
        return { backgroundColor: "#dc3545", color: "white" };
      case "en evaluación":
        return { backgroundColor: "#17a2b8", color: "white" };
      case "dado de baja":
        return { backgroundColor: "#495057", color: "white" };
      case "obsoleto":
        return { backgroundColor: "#6c757d", color: "white" };
      default:
        return { backgroundColor: "#6c757d", color: "white" };
    }
  };

  // Campos de búsqueda por rol
  const getSearchFields = () => {
    const baseFields = [
      {
        name: "name",
        label: "Nombre",
        type: "text",
        placeholder: "Busque activo por nombre, código o responsable",
      },
    ];

    // Categorías específicas por rol
    let categoryOptions = [];
    switch (role) {
      case "admin":
        categoryOptions = [
          { value: "Sistemas", label: "Sistemas" },
          { value: "Hardware", label: "Hardware" },
          { value: "Software", label: "Software" },
          { value: "Redes", label: "Redes" },
          { value: "Seguridad", label: "Seguridad" },
        ];
        break;
      case "auditor":
      case "responsable_seguridad":
        categoryOptions = [
          { value: "Infraestructura", label: "Infraestructura" },
          { value: "Base de Datos", label: "Base de Datos" },
          { value: "Respaldo", label: "Respaldo" },
          { value: "Seguridad", label: "Seguridad" },
        ];
        break;
      case "usuario":
      default:
        categoryOptions = [
          { value: "Infraestructura", label: "Infraestructura" },
          { value: "Base de Datos", label: "Base de Datos" },
          { value: "Respaldo", label: "Respaldo" },
          { value: "Seguridad", label: "Seguridad" },
        ];
        break;
    }

    // Estados específicos por rol
    let estadoOptions = [];
    if (role === "usuario") {
      estadoOptions = [
        { value: "activo", label: "Activo" },
        { value: "inactivo", label: "Inactivo" },
        { value: "en mantenimiento", label: "En mantenimiento" },
        { value: "dado de baja", label: "Dado de baja" },
        { value: "obsoleto", label: "Obsoleto" },
        { value: "en evaluación", label: "En evaluación" },
      ];
    } else {
      estadoOptions = [
        { value: "Activo", label: "Activo" },
        { value: "Mantenimiento", label: "Mantenimiento" },
        { value: "Inactivo", label: "Inactivo" },
        { value: "En Revision", label: "En Revisión" },
      ];
    }

    return [
      ...baseFields,
      {
        name: "category",
        label: "Categoría",
        type: "select",
        options: categoryOptions,
      },
      {
        name: "estado",
        label: "Estado",
        type: "select",
        options: estadoOptions,
      },
    ];
  };

  // Usar activos filtrados o todos los activos
  const activosToShow = isFiltered ? filteredActivos : activos;

  // Estado de carga
  if (loading) {
    return (
      <div className={`inventory-page ${className}`} {...props}>
        <div className="user-header">
          <div className="user-header-text">
            <h2>{getRoleTitle()}</h2>
            <h6>
              {role === "usuario" ? "Mis activos asignados" : "Cargando..."}
            </h6>
          </div>
        </div>
        <div className="text-center p-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2">Cargando activos...</p>
        </div>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className={`inventory-page ${className}`} {...props}>
        <div className="user-header">
          <div className="user-header-text">
            <h2>{getRoleTitle()}</h2>
          </div>
        </div>
        <div className="alert alert-danger text-center">
          <h5>Error al cargar activos</h5>
          <p>{error}</p>
          <button className="btn btn-primary mt-2" onClick={loadActivos}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`inventory-page ${className}`} {...props}>
      <div className="user-header">
        <div className="user-header-text">
          <h2>{getRoleTitle()}</h2>
          <h6>{getRoleSubtitle(activosToShow.length)}</h6>
        </div>
        {showCreateButton && (
          <button className="add-user-btn" onClick={handleCreateNewActivo}>
            <FaPlusSquare className="add-user-icon" />
            Crear Nuevo Activo
          </button>
        )}
      </div>

      {role === "admin" && error && (
        <div className="alert alert-danger" role="alert">
          <strong>Error:</strong> {error}
          <button
            type="button"
            className="btn btn-sm btn-outline-danger ms-3"
            onClick={loadActivos}
          >
            Reintentar
          </button>
        </div>
      )}

      <SearchBar fields={getSearchFields()} onFilter={handleFilter} />

      {/* Mensaje cuando no hay activos o no hay coincidencias*/}
      {activosToShow.length === 0 && !loading && !error && (
        <div className="empty-container text-center py-5 mt-4 bg-transparent rounded-4 mx-auto">
          <HiOutlineSearch className="empty-icon fs-1 text-white mb-3" />
          <p className="empty-title fs-4 fw-bold text-white mb-2">
            Sin resultados
          </p>
          <p className="empty-subtitle text-white">
            {isFiltered
              ? "No se encontraron coincidencias con los filtros aplicados."
              : "No hay activos disponibles. Puedes crear uno nuevo usando el botón superior"}
          </p>
        </div>
      )}
      {activosToShow.length > 0 && (
        <div className="activos-grid">
          {activosToShow.map((activo, index) => {
            const transformedActivo = transformActivo(activo);
            const estadoBadgeStyle = getEstadoBadgeStyle(activo.estado);

            return (
              <CardActivo
                key={activo.id || index}
                activo={{
                  ...transformedActivo,
                  ...(estadoBadgeStyle && { estadoBadgeStyle }),
                }}
                onHistorialClick={handleHistorialClick}
                onModificarClick={
                  role === "usuario" ? handleModificarClick : undefined
                }
                showModificarButton={role === "usuario"}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default InventoryBase;
