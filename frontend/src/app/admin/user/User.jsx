import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaUserPlus, FaEdit, FaTrash, FaUsers } from "react-icons/fa";
import { SearchBar, Table, Modal } from "../../../components/ui";

const User = ({ className = "", ...props }) => { 
    const router = useRouter();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    
    const handleAddUser = () => {
        console.log('Navegando a crear usuario');
        router.push('/admin/register');
    };

    const handleFilter = (filters) => {
        console.log('Filtros aplicados:', filters);
        // Aquí irá la lógica de filtrado
    };

    const handleEdit = (user) => {
        console.log('Editar usuario:', user);
        // Navegar a EditUser con los datos del usuario
        router.push(`/admin/edituser?userId=${user.id}&codigo=${user.codigo}&nombre=${encodeURIComponent(user.nombre_completo)}&email=${encodeURIComponent(user.email)}&telefono=${user.telefono}&departamento=${encodeURIComponent(user.departamento)}&rol=${encodeURIComponent(user.rol)}`);
    };

    const handleDelete = (user) => {
        console.log('Solicitar eliminar usuario:', user);
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        console.log('Eliminando usuario:', userToDelete);
        // Aquí iría la lógica para eliminar el usuario
        // Por ejemplo: await deleteUser(userToDelete.id);
        
        setShowDeleteModal(false);
        setUserToDelete(null);
        
        // Aquí podrías actualizar la lista de usuarios o mostrar un mensaje de éxito
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setUserToDelete(null);
    };

    // Datos de usuarios
    const usuarios = [
        {
            id: 1,
            codigo: "AH112233",
            nombre_completo: "Andrés Aguilar",
            email: "andresaguilar@empresa.com",
            telefono: "5533-0225",
            departamento: "Recursos Humanos",
            rol: "Usuario Lector",
            fecha_creacion: "2025-11-23"
        },
        {
            id: 2,
            codigo: "AF112233",
            nombre_completo: "Abigail Flores",
            email: "abigailflores@empresa.com",
            telefono: "7788-9966",
            departamento: "TI",
            rol: "Administrador",
            fecha_creacion: "2025-11-23"
        },
        {
            id: 3,
            codigo: "JO112233",
            nombre_completo: "Javier Orellana",
            email: "javierorellana@empresa.com",
            telefono: "7123-6655",
            departamento: "TI",
            rol: "Responsable de Seguridad",
            fecha_creacion: "2025-11-23"
        },
        {
            id: 4,
            codigo: "FR771100",
            nombre_completo: "Valeria Enriquez",
            email: "valeriaenriquez@empresa.com",
            telefono: "7475-6985",
            departamento: "TI",
            rol: "Auditor",
            fecha_creacion: "2025-11-23"
        },     {
            id: 5,
            codigo: "AD771100",
            nombre_completo: "Albin Jakitori",
            email: "Albin@empresa.com",
            telefono: "7475-6385",
            departamento: "TI",
            rol: "Administrador",
            fecha_creacion: "2025-11-23"
        }
    ];

    // Definir columnas de la tabla
    const tableColumns = [
        { key: "codigo", label: "Código" },
        { key: "nombre_completo", label: "Nombre Completo" },
        { key: "email", label: "Email" },
        { key: "telefono", label: "Teléfono" },
        { key: "departamento", label: "Departamento" },
        { 
            key: "rol", 
            label: "Rol",
            render: (row) => {
                const getRoleClass = (role) => {
                    switch (role) {
                        case 'Usuario Lector':
                            return 'role-usuario-lector';
                        case 'Administrador':
                            return 'role-administrador';
                        case 'Responsable de Seguridad':
                            return 'role-responsable-seguridad';
                        case 'Auditor':
                            return 'role-auditor';
                        default:
                            return 'role-usuario-lector';
                    }
                };
                return (
                    <span className={`role-badge ${getRoleClass(row.rol)}`}>
                        {row.rol}
                    </span>
                );
            }
        },
        { key: "fecha_creacion", label: "Fecha Creación" },
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
            )
        }
    ];

    // Definir los campos de búsqueda
    const searchFields = [
        {
            name: 'name',
            label: 'Nombre',
            type: 'text',
            placeholder: 'Busque por nombre, código, responsable'
        },
        {
            name: 'role',
            label: 'Rol',
            type: 'select',
            options: [
                { value: 'Administrador', label: 'Administrador' },
                { value: 'Usuario Lector', label: 'Usuario Lector' },
                { value: 'Responsable de Seguridad', label: 'Responsable de Seguridad' },
                { value: 'Auditor', label: 'Auditor' }
            ]
        }
    ];

    return (
        <div className={`user-page ${className}`} {...props}>
            <div className="user-header">
                <div className="user-header-text">
                    <h2>Gestión de Usuarios y Roles</h2>
                    <h6>4 usuarios en total</h6>
                </div>
                <button 
                    className="add-user-btn"
                    onClick={handleAddUser}
                >
                    <FaUserPlus className="add-user-icon" />
                    Crear Nuevo Usuario
                </button>
            </div>

            <SearchBar 
                fields={searchFields}
                onFilter={handleFilter}
            />
            
            <Table 
                columns={tableColumns}
                data={usuarios}
            />

            {/* Modal de confirmación para eliminar */}
            <Modal
                isOpen={showDeleteModal}
                onClose={cancelDelete}
                title="Eliminar Usuario"
                question="¿Estás seguro de que deseas eliminar este usuario?"
                showValueBox={true}
                valueBoxTitle="Usuario a eliminar:"
                valueBoxSubtitle={userToDelete ? `${userToDelete.nombre_completo} (${userToDelete.codigo})` : ""}
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