"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  FaUserPlus, 
  FaEdit, 
  FaTrash, 
  FaUndo,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { SearchBar, Table, Modal, Button, Select } from "../../../components/ui";
import Toast from "../../../components/ui/Toast"; 
import { UserService, ActivoService } from "@/services";
import api from "@/services/api";

const User = ({ className = "", ...props }) => {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReactivateModal, setShowReactivateModal] = useState(false);
  const [showReasignacionModal, setShowReasignacionModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToReactivate, setUserToReactivate] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [showInactive, setShowInactive] = useState(false);
  
  // Estados para la reasignación
  const [activosDelUsuario, setActivosDelUsuario] = useState([]);
  const [nuevoResponsableId, setNuevoResponsableId] = useState("");
  const [responsablesDisponibles, setResponsablesDisponibles] = useState([]);
  const [justificacion, setJustificacion] = useState("");
  const [errorsReasignacion, setErrorsReasignacion] = useState({});
  
  // Estados para Toast
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("info");

  // Función para mostrar toast
  const showToastMessage = useCallback((message, variant = "info") => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
  }, []);

  // Función para cargar usuarios desde la API
  const loadUsers = useCallback(async () => {
    try {
      setError(null);

      // Obtener ID del usuario actual
      const currentUserResponse = await UserService.getCurrentUser();
      const currentUserId = currentUserResponse?.data?.id || currentUserResponse?.data?._id;

      // Obtener todos los usuarios
      const response = await UserService.getUsers(showInactive);

      if (response?.success && response.data?.users) {
        // Filtrar para excluir al usuario actual si existe
        const usuariosFiltrados = currentUserId
          ? response.data.users.filter(user => user.id !== currentUserId && user._id !== currentUserId)
          : response.data.users;

        setUsuarios(usuariosFiltrados);
      }
    } catch (err) {
      setError("Error al cargar los usuarios. Por favor intenta de nuevo.");
      setUsuarios([]);
    } 
  }, [showInactive]);

  // Cargar usuarios al montar y cuando cambie showInactive
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Función para verificar si el usuario tiene activos asignados
  const verificarActivosUsuario = useCallback(async (userId) => {
    try {
      return await ActivoService.hasActivosAsignados(userId);
    } catch (error) {
      return false;
    }
  }, []);

  // Función para cargar activos del usuario
  const cargarActivosUsuario = useCallback(async (userId) => {
    try {
      const response = await ActivoService.getActivosByResponsable(userId);
      return response.data?.activos || response.activos || [];
    } catch (error) {
      return [];
    }
  }, []);

  // Función para cargar responsables disponibles
  const cargarResponsablesDisponibles = useCallback(async (usuarioExcluidoId) => {
    try {
      const response = await ActivoService.getResponsablesDisponibles();
      
      let responsablesData = Array.isArray(response) 
        ? response 
        : response?.data || [];
      
      // Filtrar y formatear responsables
      const responsablesFiltrados = responsablesData
        .filter(user => user.id !== usuarioExcluidoId && user._id !== usuarioExcluidoId)
        .map(user => ({
          id: user.id || user._id,
          label: user.nombreCompleto || `${user.nombre} ${user.apellido}`,
          value: user.id || user._id
        }))
        .sort((a, b) => a.label.localeCompare(b.label));
      
      return responsablesFiltrados;
    } catch (error) {
      return [];
    }
  }, []);

  // Función para manejar filtros
  const handleFilter = useCallback((filters) => {
    if (!filters.name && !filters.role) {
      setFilteredUsers([]);
      setIsFiltered(false);
      return;
    }

    const searchTerm = filters.name?.toLowerCase() || '';
    const filtered = usuarios.filter((usuario) => {
      // Filtro por nombre, código o email
      if (filters.name) {
        const matchesName = usuario.nombreCompleto?.toLowerCase().includes(searchTerm);
        const matchesCode = usuario.codigo?.toLowerCase().includes(searchTerm);
        const matchesEmail = usuario.email?.toLowerCase().includes(searchTerm);

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
  }, [usuarios]);

  // Función para editar usuario
    const handleEdit = (user) => {
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

  // Función para manejar desactivación de usuario
  const handleDelete = useCallback(async (user) => {
    const userId = user._id || user.id;
    
    try {
      const tieneActivos = await verificarActivosUsuario(userId);
      
      if (tieneActivos) {
        // Si tiene activos, mostrar modal de reasignación
        const [activos, responsables] = await Promise.all([
          cargarActivosUsuario(userId),
          cargarResponsablesDisponibles(userId)
        ]);
        
        setActivosDelUsuario(activos);
        setResponsablesDisponibles(responsables);
        setUserToDelete(user);
        setShowReasignacionModal(true);
      } else {
        // Si no tiene activos, proceder con desactivación normal
        setUserToDelete(user);
        setShowDeleteModal(true);
      }
    } catch (error) {
      showToastMessage('Error al verificar activos del usuario', 'danger');
    }
  }, [verificarActivosUsuario, cargarActivosUsuario, cargarResponsablesDisponibles, showToastMessage]);

 // Función para crear solicitud de reasignación
const crearSolicitudReasignacion = useCallback(async (activo, nuevoResponsableId, justificacion) => {
  try {
    // Usar api directamente importándolo
    const response = await api.post('/solicitudes/reasignar', {
      activoId: activo.id || activo._id,
      nuevoResponsableId,
      justificacion
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
}, [api]); 

  // Función para procesar la reasignación
  const procesarReasignacion = useCallback(async () => {
    // Validaciones
    const newErrors = {};
    
    if (!nuevoResponsableId) {
      newErrors.nuevoResponsable = "Debe seleccionar un nuevo responsable";
    }
    
    if (!justificacion || justificacion.trim().length < 10) {
      newErrors.justificacion = "La justificación debe tener al menos 10 caracteres";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrorsReasignacion(newErrors);
      return;
    }
    
    try {
      // 1. Crear solicitudes de cambio para cada activo
      const solicitudesPromesas = activosDelUsuario.map(activo => 
        crearSolicitudReasignacion(activo, nuevoResponsableId, justificacion)
      );
      
      await Promise.all(solicitudesPromesas);
      
      // 2. Desactivar al usuario
      await UserService.deleteUser(userToDelete._id || userToDelete.id);
      
      // 3. Recargar usuarios y limpiar estado
      await loadUsers();
      setShowReasignacionModal(false);
      setUserToDelete(null);
      setNuevoResponsableId("");
      setJustificacion("");
      setErrorsReasignacion({});
      
      // 4. Mostrar mensaje de éxito
      showToastMessage(
        `Usuario desactivado y ${activosDelUsuario.length} activo(s) reasignado(s) exitosamente`,
        "success"
      );
      
    } catch (error) {
      showToastMessage(
        error.message.includes('Error de validación') 
          ? error.message 
          : "Error en el proceso de reasignación",
        "danger"
      );
    }
  }, [activosDelUsuario, nuevoResponsableId, justificacion, crearSolicitudReasignacion, userToDelete, loadUsers, showToastMessage]);

  // Funciones de confirmación y cancelación
  const confirmDelete = useCallback(async () => {
    if (!userToDelete) return;

    try {
      await UserService.deleteUser(userToDelete._id || userToDelete.id);
      await loadUsers();
      
      setShowDeleteModal(false);
      setUserToDelete(null);
      showToastMessage("Usuario desactivado exitosamente", "success");
    } catch (error) {
      showToastMessage("Error al desactivar usuario", "danger");
    }
  }, [userToDelete, loadUsers, showToastMessage]);

  const handleReactivate = useCallback((user) => {
    setUserToReactivate(user);
    setShowReactivateModal(true);
  }, []);

  const confirmReactivate = useCallback(async () => {
    if (!userToReactivate) return;

    try {
      await UserService.reactivateUser(userToReactivate._id || userToReactivate.id);
      await loadUsers();
      
      setShowReactivateModal(false);
      setUserToReactivate(null);
      showToastMessage("Usuario reactivado exitosamente", "success");
    } catch (error) {
      showToastMessage("Error al reactivar usuario", "danger");
    }
  }, [userToReactivate, loadUsers, showToastMessage]);

  // Funciones auxiliares para formatear datos
  const getRoleClass = useCallback((role) => {
    const roleClasses = {
      "usuario": "role-usuario-lector",
      "administrador": "role-administrador",
      "responsable_seguridad": "role-responsable-seguridad",
      "auditor": "role-auditor"
    };
    return roleClasses[role] || "role-usuario-lector";
  }, []);

  const getRoleDisplayText = useCallback((role) => {
    const roleTexts = {
      "usuario": "Usuario Lector",
      "administrador": "Administrador",
      "responsable_seguridad": "Responsable de Seguridad",
      "auditor": "Auditor"
    };
    return roleTexts[role] || "Usuario Lector";
  }, []);

  const getDepartmentDisplayText = useCallback((department) => {
    const departments = {
      "Tecnologia_de_la_Informacion": "TI",
      "recursos_humanos": "Recursos Humanos",
      "seguridad": "Seguridad",
      "auditoria": "Auditoría",
      "finanzas": "Finanzas",
      "operaciones": "Operaciones",
      "legal_y_cumplimiento": "Legal y Cumplimiento"
    };
    return departments[department] || department;
  }, []);

  const getStatusClass = useCallback((estado) => {
    return estado === "activo" ? "status-active" : "status-inactive";
  }, []);

  const getStatusDisplayText = useCallback((estado) => {
    return estado === "activo" ? "Activo" : "Inactivo";
  }, []);

  // Columnas de la tabla
  const tableColumns = useMemo(() => [
    { key: "codigo", label: "Código" },
    { key: "nombreCompleto", label: "Nombre Completo" },
    { key: "email", label: "Email" },
    { key: "telefono", label: "Teléfono" },
    {
      key: "estado",
      label: "Estado",
      render: (row) => (
        <span className={`status-badge ${getStatusClass(row.estado)}`}>
          {getStatusDisplayText(row.estado)}
        </span>
      ),
    },
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
          {row.estado === "activo" ? (
            <>
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
                title="Desactivar usuario"
              >
                <FaTrash />
              </button>
            </>
          ) : (
            <button
              className="action-btn activar-btn"
              onClick={() => handleReactivate(row)}
              title="Reactivar usuario"
            >
              <FaUndo />
            </button>
          )}
        </div>
      ),
    },
  ], [getStatusClass, getStatusDisplayText, getDepartmentDisplayText, getRoleClass, getRoleDisplayText, handleEdit, handleDelete, handleReactivate]);

  // Campos de búsqueda
  const searchFields = useMemo(() => [
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
  ], []);

  // Usuarios a mostrar
  const usersToShow = isFiltered ? filteredUsers : usuarios;

  // Funciones de cancelación
  const cancelDelete = useCallback(() => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  }, []);

  const cancelReasignacion = useCallback(() => {
    setShowReasignacionModal(false);
    setUserToDelete(null);
    setNuevoResponsableId("");
    setJustificacion("");
    setErrorsReasignacion({});
    setActivosDelUsuario([]);
    setResponsablesDisponibles([]);
  }, []);

  const cancelReactivate = useCallback(() => {
    setShowReactivateModal(false);
    setUserToReactivate(null);
  }, []);

  return (
    <div className={`user-page ${className}`} {...props}>
      <div className="user-header">
        <div className="user-header-text">
          <h2>Gestión de Usuarios y Roles</h2>
          <h6>{usersToShow.length} usuarios en total</h6>
        </div>
        <div className="d-flex gap-3">
          <Button
            variant="secondary"
            onClick={() => setShowInactive(!showInactive)}
            title={showInactive ? "Ocultar usuarios inactivos" : "Mostrar usuarios inactivos"}
          >
            {showInactive ? (
              <>
                <FaEyeSlash className="me-2" />
                Ocultar Inactivos
              </>
            ) : (
              <>
                <FaEye className="me-2" />
                Mostrar Inactivos
              </>
            )}
          </Button>
          
          <button className="add-user-btn" onClick={() => router.push("/admin/register")}>
            <FaUserPlus className="add-user-icon" />
            Crear Nuevo Usuario
          </button>
        </div>
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

      {/* Toast para notificaciones */}
      <Toast
        message={toastMessage}
        variant={toastVariant}
        show={showToast}
        onClose={() => setShowToast(false)}
        autohide={true}
        delay={3000}
      />

      {/* Modal de desactivación simple */}
      <Modal
        isOpen={showDeleteModal}
        onClose={cancelDelete}
        title="Desactivar Usuario"
        question="¿Estás seguro de que deseas desactivar este usuario?"
        showValueBox={true}
        valueBoxTitle="Usuario a desactivar:"
        valueBoxSubtitle={userToDelete ? `${userToDelete.nombreCompleto} (${userToDelete.codigo})` : ""}
        informativeText="El usuario será marcado como inactivo. Podrás reactivarlo más tarde si es necesario."
        cancelText="Cancelar"
        acceptText="Desactivar"
        onCancel={cancelDelete}
        onAccept={confirmDelete}
        headerBgColor="#dc3545"
        buttonColor="#dc3545"
      />

      {/* Modal de reasignación */}
      <Modal
        isOpen={showReasignacionModal}
        onClose={cancelReasignacion}
        title="Reasignar Activos y Desactivar Usuario"
        size="lg"
        showValueBox={true}
        valueBoxTitle={`Usuario a desactivar: ${userToDelete?.nombreCompleto || ''}`}
        valueBoxSubtitle={`Tiene ${activosDelUsuario.length} activo(s) asignado(s)`}
        cancelText="Cancelar"
        acceptText="Procesar Reasignación"
        onCancel={cancelReasignacion}
        onAccept={procesarReasignacion}
        headerBgColor="#ffc107"
        buttonColor="#ffc107"
      >
        <div className="p-3">
          {/* Lista simplificada de activos */}
          <div className="mb-3">
            <div className="list-group mb-3" style={{ maxHeight: '150px', overflowY: 'auto' }}>
              {activosDelUsuario.map((activo) => (
                <div key={activo.id || activo._id} className="list-group-item py-2 small">
                  <strong>{activo.codigo}</strong> - {activo.nombre}
                </div>
              ))}
            </div>
          </div>
          
          {/* Selección de nuevo responsable */}
          <div className="mb-3">
            <label className="form-label fw-bold text-dark">
              Nuevo Responsable <span className="text-danger">*</span>
            </label>
            <Select
              options={responsablesDisponibles}
              value={nuevoResponsableId}
              onChange={(e) => {
                setNuevoResponsableId(e.target.value);
                if (errorsReasignacion.nuevoResponsable) {
                  setErrorsReasignacion(prev => ({ ...prev, nuevoResponsable: '' }));
                }
              }}
              error={errorsReasignacion.nuevoResponsable}
              placeholder="Seleccione un nuevo responsable"
            />
          </div>
          
          {/* Justificación */}
          <div className="mb-3">
            <label className="form-label fw-bold text-dark">
              Justificación <span className="text-danger">*</span>
            </label>
            <textarea
              className={`form-control ${errorsReasignacion.justificacion ? 'is-invalid' : ''}`}
              value={justificacion}
              onChange={(e) => {
                setJustificacion(e.target.value);
                if (errorsReasignacion.justificacion) {
                  setErrorsReasignacion(prev => ({ ...prev, justificacion: '' }));
                }
              }}
              rows="3"
              placeholder="Explique por qué necesita reasignar los activos..."
            />
            {errorsReasignacion.justificacion && (
              <div className="invalid-feedback">{errorsReasignacion.justificacion}</div>
            )}
            <small className="text-muted">
              Mínimo 10 caracteres
            </small>
          </div>
        </div>
      </Modal>

      {/* Modal de reactivación */}
      <Modal
        isOpen={showReactivateModal}
        onClose={cancelReactivate}
        title="Reactivar Usuario"
        question="¿Estás seguro de que deseas reactivar este usuario?"
        showValueBox={true}
        valueBoxTitle="Usuario a reactivar:"
        valueBoxSubtitle={userToReactivate ? `${userToReactivate.nombreCompleto} (${userToReactivate.codigo})` : ""}
        informativeText="El usuario volverá a tener acceso al sistema con sus permisos anteriores."
        cancelText="Cancelar"
        acceptText="Reactivar"
        onCancel={cancelReactivate}
        onAccept={confirmReactivate}
        headerBgColor="#28a745"
        buttonColor="#28a745"
      />
    </div>
  );
};

export default User;