import React from "react";
import { SearchBar, CardActivo } from "../../../components/ui";

const Inventory = ({ className = "", onNavigateToSCV, ...props }) => {
    const handleFilter = (filters) => {
        console.log('Filtros aplicados:', filters);
        // Aquí irá la lógica de filtrado
    };

    const handleHistorialClick = (activo) => {
        console.log('Navegando al historial de:', activo.nombre);
        if (onNavigateToSCV) {
            onNavigateToSCV(activo);
        }
    };

    // Datos de ejemplo
    const activos = [
        {
            nombre: "Servidor Web Principal",
            codigo: "SWP-001",
            estado: "Activo",
            categoria: "Infraestructura",
            descripcion: "Servidor web para aplicaciones corporativas con balanceador de carga",
            responsable: "Abigail Flores",
            version: "v1.0.0",
            ubicacion: "Sala 5 - Dep TI",
            fecha_creacion: "2025-11-23",
            acciones_disponibles: ["Historial de Versiones"]
        },
        {
            nombre: "Base de Datos MySQL",
            codigo: "BDM-002",
            estado: "Mantenimiento",
            categoria: "Base de Datos",
            descripcion: "Base de datos principal para almacenamiento de información corporativa",
            responsable: "Javier Orellana",
            version: "v2.1.3",
            ubicacion: "Sala 3 - Dep TI",
            fecha_creacion: "2025-11-20",
            acciones_disponibles: ["Historial de Versiones"]
        },
        {
            nombre: "Sistema de Backup",
            codigo: "SBK-003",
            estado: "Inactivo",
            categoria: "Respaldo",
            descripcion: "Sistema automatizado de respaldos nocturnos",
            responsable: "Valeria Enriquez",
            version: "v1.5.2",
            ubicacion: "Sala 7 - Dep TI",
            fecha_creacion: "2025-11-18",
            acciones_disponibles: ["Historial de Versiones"]
        },
        {
            nombre: "Firewall Corporativo",
            codigo: "FWC-004",
            estado: "En Revision",
            categoria: "Seguridad",
            descripcion: "Firewall de nueva generación para protección perimetral",
            responsable: "Andrés Aguilar",
            version: "v3.0.1",
            ubicacion: "Sala 1 - Seguridad",
            fecha_creacion: "2025-11-25",
            acciones_disponibles: ["Historial de Versiones"]
        }
    ];

    // Definir los campos de búsqueda
    const searchFields = [
        {
            name: 'name',
            label: 'Nombre',
            type: 'text',
            placeholder: 'Busque activo por nombre, código o responsable'
        },
        {
            name: 'category',
            label: 'Categoría',
            type: 'select',
            options: [
                { value: 'Infraestructura', label: 'Infraestructura' },
                { value: 'Base de Datos', label: 'Base de Datos' },
                { value: 'Respaldo', label: 'Respaldo' },
                { value: 'Seguridad', label: 'Seguridad' }
            ]
        },
        {
            name: 'estado',
            label: 'Estado',
            type: 'select',
            options: [
                { value: 'Activo', label: 'Activo' },
                { value: 'Mantenimiento', label: 'Mantenimiento' },
                { value: 'Inactivo', label: 'Inactivo' },
                { value: 'En Revision', label: 'En Revisión' }
            ]
        }
    ];

    return (
        <div className={`inventory-page ${className}`} {...props}>
            <div className="user-header">
                <div className="user-header-text">
                    <h2>Inventario de Activos</h2>
                    <h6>{activos.length} activos en total</h6>
                </div>
            </div>
            
            <SearchBar fields={searchFields} onFilter={handleFilter} />
            
            <div className="activos-grid">
                {activos.map((activo, index) => (
                    <CardActivo
                        key={index}
                        activo={activo}
                        onHistorialClick={handleHistorialClick}
                    />
                ))}
            </div>
        </div>
    );
};

export default Inventory;
