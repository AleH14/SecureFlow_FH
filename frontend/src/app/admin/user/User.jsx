import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaUserPlus, FaEdit, FaTrash } from "react-icons/fa";
import { SearchBar, Table, Modal } from "../../../components/ui";
import { UserService } from "@/services";
const User = ({ className = "", ...props }) => {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);

  const handleAddUser = () => {
    console.log("Navegando a crear usuario");
    router.push("/admin/register");
  };

  // Función para cargar usuarios desde la API (excluyendo al usuario actual)
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Obtener el ID del usuario actual
      let currentUserId = null;
      try {
        const currentUserResponse = await UserService.getCurrentUser();
        if (currentUserResponse?.success && currentUserResponse.data) {
          currentUserId =
            currentUserResponse.data._id || currentUserResponse.data.id;
        }
      } catch {
        // Si falla, continuamos sin filtrar
      }

      // Obtener todos los usuarios
      const response = await UserService.getUsers();

      if (response?.success && response.data?.users) {
        const allUsers = response.data.users;

        // Filtrar para excluir al usuario actual si tenemos su ID
        const usuariosSinActual = currentUserId
          ? allUsers.filter((user) => (user._id || user.id) !== currentUserId)
          : allUsers;

        setUsuarios(usuariosSinActual);
      } else {
        throw new Error("Formato de respuesta inesperado");
      }
    } catch (err) {
      setError("Error al cargar los usuarios. Por favor intenta de nuevo.");
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar usuarios al montar el componente
  useEffect(() => {
    loadUsers();
  }, []);

  const handleFilter = useCallback(
    (filters) => {
      console.log("Filtros aplicados:", filters);

      // Si no hay filtros, mostrar todos los usuarios
      if (!filters.name && !filters.role) {
        setFilteredUsers([]);
        setIsFiltered(false);
        return;
      }

      // Aplicar filtros
      const filtered = usuarios.filter((usuario) => {
        // Filtro por nombre, código o email
        if (filters.name) {
          const searchTerm = filters.name.toLowerCase();
          const matchesName = usuario.nombreCompleto
            .toLowerCase()
            .includes(searchTerm);
          const matchesCode = usuario.codigo.toLowerCase().includes(searchTerm);
          const matchesEmail = usuario.email.toLowerCase().includes(searchTerm);

          if (!matchesName && !matchesCode && !matchesEmail) {
            return false;
          }
        }

        // Filtro por rol
        if (filters.role && usuario.rol !== filters.role) {
          return false;
        }

        return true;
      });

      setFilteredUsers(filtered);
      setIsFiltered(true);
    },
    [usuarios]
  );

  const handleEdit = (user) => {
    console.log("Editar usuario:", user);
    // Navegar a EditUser con los datos del usuario
    const userId = user._id || user.id;
    router.push(
      `/admin/edituser?userId=${userId}&codigo=${
        user.codigo
      }&nombre=${encodeURIComponent(
        user.nombreCompleto
      )}&email=${encodeURIComponent(user.email)}&telefono=${
        user.telefono
      }&departamento=${encodeURIComponent(
        user.departamento
      )}&rol=${encodeURIComponent(user.rol)}`
    );
  };

  const handleDelete = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      await UserService.deleteUser(userToDelete._id || userToDelete.id);

      // Recargar la lista de usuarios
      await loadUsers();

      setShowDeleteModal(false);
      setUserToDelete(null);

      console.log("Usuario eliminado exitosamente");
    } catch (error) {
      console.error("Error eliminando usuario:", error);
      setError("Error al eliminar el usuario. Por favor intenta de nuevo.");
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  // Usar usuarios filtrados o todos los usuarios
  const usersToShow = isFiltered ? filteredUsers : usuarios;

  // Función para obtener clase CSS del rol
  const getRoleClass = (role) => {
    switch (role) {
      case "usuario":
        return "role-usuario-lector";
      case "administrador":
        return "role-administrador";
      case "responsable_seguridad":
        return "role-responsable-seguridad";
      case "auditor":
        return "role-auditor";
      default:
        return "role-usuario-lector";
    }
  };

  // Función para obtener el texto amigable del rol
  const getRoleDisplayText = (role) => {
    switch (role) {
      case "usuario":
        return "Usuario Lector";
      case "administrador":
        return "Administrador";
      case "responsable_seguridad":
        return "Responsable de Seguridad";
      case "auditor":
        return "Auditor";
      default:
        return "Usuario Lector";
    }
  };

  // Función para obtener el texto amigable del departamento
  const getDepartmentDisplayText = (department) => {
    switch (department) {
      case "Tecnologia_de_la_Informacion":
        return "TI";
      case "recursos_humanos":
        return "Recursos Humanos";
      case "seguridad":
        return "Seguridad";
      case "auditoria":
        return "Auditoría";
      case "finanzas":
        return "Finanzas";
      case "operaciones":
        return "Operaciones";
      case "legal_y_cumplimiento":
        return "Legal y Cumplimiento";
      default:
        return department; // Si no coincide, mostrar el valor original
    }
  };

  // Definir columnas de la tabla
  const tableColumns = [
    { key: "codigo", label: "Código" },
    { key: "nombreCompleto", label: "Nombre Completo" },
    { key: "email", label: "Email" },
    { key: "telefono", label: "Teléfono" },
    {
      key: "departamento",
      label: "Departamento",
      render: (row) => getDepartmentDisplayText(row.departamento),
    },
    {
      key: "rol",
      label: "Rol",
      render: (row) => (
        <span className={`role-badge ${getRoleClass(row.rol)}`}>
          {getRoleDisplayText(row.rol)}
        </span>
      ),
    },
    {
      key: "fechaCreacion",
      label: "Fecha Creación",
      render: (row) => new Date(row.fechaCreacion).toLocaleDateString("es-ES"),
    },
    {
      key: "acciones",
      label: "Acciones",
      render: (row) => (
        <div className="action-buttons">
          <button
            className="action-btn edit-btn"
            onClick={() => handleEdit(row)}
            title="Editar usuario"
          >
            <FaEdit />
          </button>
          <button
            className="action-btn delete-btn"
            onClick={() => handleDelete(row)}
            title="Eliminar usuario"
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  // Definir los campos de búsqueda
  const searchFields = [
    {
      name: "name",
      label: "Nombre",
      type: "text",
      placeholder: "Busque por nombre, código o email",
    },
    {
      name: "role",
      label: "Rol",
      type: "select",
      options: [
        { value: "administrador", label: "Administrador" },
        { value: "usuario", label: "Usuario Lector" },
        { value: "responsable_seguridad", label: "Responsable de Seguridad" },
        { value: "auditor", label: "Auditor" },
      ],
    },
  ];

  // Mostrar loading
  if (loading) {
    return (
      <div className={`user-page ${className}`} {...props}>
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando usuarios...</span>
          </div>
          <p className="mt-3">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`user-page ${className}`} {...props}>
      <div className="user-header">
        <div className="user-header-text">
          <h2>Gestión de Usuarios y Roles</h2>
          <h6>{usersToShow.length} usuarios en total</h6>
        </div>
        <button className="add-user-btn" onClick={handleAddUser}>
          <FaUserPlus className="add-user-icon" />
          Crear Nuevo Usuario
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          <strong>Error:</strong> {error}
          <button
            type="button"
            className="btn btn-sm btn-outline-danger ms-3"
            onClick={loadUsers}
          >
            Reintentar
          </button>
        </div>
      )}

      <SearchBar fields={searchFields} onFilter={handleFilter} />

      <Table columns={tableColumns} data={usersToShow} />

      {/* Modal de confirmación para eliminar */}
      <Modal
        isOpen={showDeleteModal}
        onClose={cancelDelete}
        title="Eliminar Usuario"
        question="¿Estás seguro de que deseas eliminar este usuario?"
        showValueBox={true}
        valueBoxTitle="Usuario a eliminar:"
        valueBoxSubtitle={
          userToDelete
            ? `${userToDelete.nombreCompleto} (${userToDelete.codigo})`
            : ""
        }
        informativeText="Esta acción no se puede deshacer. Se eliminarán todos los datos asociados al usuario."
        cancelText="Cancelar"
        acceptText="Eliminar"
        onCancel={cancelDelete}
        onAccept={confirmDelete}
        headerBgColor="#dc3545"
        buttonColor="#dc3545"
      />
    </div>
  );
};
export default User;
