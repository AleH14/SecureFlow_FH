import React, { useState, useCallback, useEffect } from "react";
import { SearchBar, CardActivo } from "../../../components/ui";
import { ActivoService } from "@/services";

const Inventory = ({ className = "", onNavigateToSCV, ...props }) => {
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
                throw new Error('Formato de respuesta inesperado');
            }
        } catch (err) {
            console.error('Error cargando activos:', err);
            setError('Error al cargar los activos. Por favor intenta de nuevo.');
            setActivos([]);
        } finally {
            setLoading(false);
        }
    };

    // Cargar activos al montar el componente
    useEffect(() => {
        loadActivos();
    }, []);

    const handleFilter = useCallback((filters) => {
        console.log('Filtros aplicados:', filters);
        
        // Si no hay filtros, mostrar todos los activos
        if (!filters.name && !filters.category && !filters.estado) {
            setFilteredActivos([]);
            setIsFiltered(false);
            return;
        }

        // Aplicar filtros
        const filtered = activos.filter(activo => {
            // Filtro por nombre, código o responsable
            if (filters.name) {
                const searchTerm = filters.name.toLowerCase();
                const matchesName = activo.nombre.toLowerCase().includes(searchTerm);
                const matchesCode = activo.codigo.toLowerCase().includes(searchTerm);
                const matchesResponsible = activo.responsable?.nombreCompleto?.toLowerCase().includes(searchTerm) || false;
                
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
    }, [activos]);

    const handleHistorialClick = (activo) => {
        console.log('Navegando al historial de:', activo.nombre);
        if (onNavigateToSCV) {
            onNavigateToSCV(activo);
        }
    };

    // Función para transformar activos del backend al formato esperado por CardActivo
    const transformActivo = (activo) => {
        return {
            ...activo,
            responsable: activo.responsable?.nombreCompleto || 'Sin asignar',
            fecha_creacion: activo.fechaCreacion ? new Date(activo.fechaCreacion).toLocaleDateString('es-ES') : 'N/A',
            version: `v${activo.version || '1.0'}`,
            acciones_disponibles: ["Historial de Versiones"]
        };
    };

    // Usar activos filtrados o todos los activos
    const activosToShow = isFiltered ? filteredActivos : activos;

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
                { value: 'Sistemas', label: 'Sistemas' },
                { value: 'Hardware', label: 'Hardware' },
                { value: 'Software', label: 'Software' },
                { value: 'Redes', label: 'Redes' },
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

    // Mostrar loading
    if (loading) {
        return (
            <div className={`inventory-page ${className}`} {...props}>
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando activos...</span>
                    </div>
                    <p className="mt-3">Cargando activos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`inventory-page ${className}`} {...props}>
            <div className="user-header">
                <div className="user-header-text">
                    <h2>Inventario de Activos</h2>
                    <h6>{activosToShow.length} activos en total</h6>
                </div>
            </div>

            {error && (
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
            
            <SearchBar fields={searchFields} onFilter={handleFilter} />
            
            <div className="activos-grid">
                {activosToShow.map((activo, index) => (
                    <CardActivo
                        key={activo.id || index}
                        activo={transformActivo(activo)}
                        onHistorialClick={handleHistorialClick}
                    />
                ))}
            </div>
        </div>
    );
};

export default Inventory;