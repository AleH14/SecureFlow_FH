"use client";
import React, { useState, useEffect } from "react";
import { Button, Card, Table } from "../../../components/ui";
import { FaArrowLeft, FaShieldAlt, FaInfoCircle, FaEdit } from "react-icons/fa";
import { ActivoService } from "@/services";

const SolicitudDetalles = ({ solicitud, onNavigateBack, onNavigateToModificarActivo }) => {
  const [usuariosOptions, setUsuariosOptions] = useState([]);
  const [loadingUsuarios, setLoadingUsuarios] = useState(false);
  const [loadingActivo, setLoadingActivo] = useState(false);

  if (!solicitud) {
    return (
      <div className="solicitud-detalles-container p-2 p-lg-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onNavigateBack}
          className="mb-3 text-white border-white"
        >
          <FaArrowLeft className="me-2" />
          Volver a mis solicitudes
        </Button>
        <div className="alert alert-warning">
          No se encontró la información de la solicitud
        </div>
      </div>
    );
  }

  // Cargar responsables disponibles al montar el componente
  useEffect(() => {
    cargarResponsablesDisponibles();
  }, []);

  const cargarResponsablesDisponibles = async () => {
    setLoadingUsuarios(true);
    try {
      const response = await ActivoService.getResponsablesDisponibles();
      
      let responsablesData = [];
      
      if (Array.isArray(response)) {
        responsablesData = response;
      } else if (response && response.data && Array.isArray(response.data)) {
        responsablesData = response.data;
      } else if (response && response.success && Array.isArray(response.data)) {
        responsablesData = response.data;
      }
      
      const responsablesFiltrados = responsablesData
        .map(user => ({
          id: user.id || user._id,
          nombreCompleto: user.nombreCompleto || `${user.nombre} ${user.apellido}`,
          nombre: user.nombre || '',
          apellido: user.apellido || '',
          email: user.email || ''
        }))
        .filter(user => user.nombreCompleto && user.nombreCompleto.trim() !== "")
        .sort((a, b) => a.nombreCompleto.localeCompare(b.nombreCompleto));
      
      setUsuariosOptions(responsablesFiltrados);
      
    } catch (error) {
      console.error("Error cargando responsables:", error);
      setUsuariosOptions([]);
    } finally {
      setLoadingUsuarios(false);
    }
  };

  // Función para obtener el nombre de un responsable por ID
  const getNombreResponsableById = (responsableId) => {
    if (!responsableId || responsableId === "(sin valor anterior)" || responsableId === "(sin valor nuevo)") {
      return responsableId;
    }

    // Si es un objeto, extraer el nombre
    if (typeof responsableId === 'object' && responsableId !== null) {
      if (responsableId.nombreCompleto) {
        return responsableId.nombreCompleto;
      } else if (responsableId.nombre || responsableId.apellido) {
        return `${responsableId.nombre || ''} ${responsableId.apellido || ''}`.trim();
      } else if (responsableId.email) {
        return responsableId.email;
      }
      return "Responsable (objeto)";
    }

    // Si ya es un nombre
    if (typeof responsableId === 'string' && /[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/.test(responsableId) && responsableId.includes(' ')) {
      return responsableId;
    }

    // Buscar en la lista de usuarios
    if (usuariosOptions.length > 0) {
      const usuarioEncontrado = usuariosOptions.find(
        usuario => usuario.id === responsableId || usuario.id?.toString() === responsableId.toString()
      );
      
      if (usuarioEncontrado) {
        return usuarioEncontrado.nombreCompleto;
      }
    }

    // Si parece ser un ObjectId de MongoDB
    if (/^[0-9a-fA-F]{24}$/.test(responsableId)) {
      return `Usuario [ID: ${responsableId.substring(0, 8)}...]`;
    }

    // Si es solo números
    if (/^\d+$/.test(responsableId)) {
      return `Usuario ID: ${responsableId}`;
    }

    return responsableId;
  };

  // Función para formatear fecha
  const formatFecha = (fechaISO) => {
    if (!fechaISO) return "Pendiente";
    try {
      return new Date(fechaISO).toLocaleDateString("es-ES", {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return fechaISO;
    }
  };

  // Función para obtener el nombre completo del responsable de seguridad
  const getNombreResponsableSeguridad = () => {
    if (solicitud.responsableSeguridad) {
      const responsable = solicitud.responsableSeguridad;
      if (responsable.nombreCompleto) {
        return responsable.nombreCompleto;
      } else if (responsable.nombre && responsable.apellido) {
        return `${responsable.nombre} ${responsable.apellido}`;
      } else if (responsable.nombre) {
        return responsable.nombre;
      }
      return "Responsable de Seguridad";
    }
    return "No asignado aún";
  };

  // Función para obtener el estado
  const getEstado = () => {
    return solicitud.estado || "Pendiente";
  };

  // Función para obtener comentario de seguridad
  const getComentarioSeguridad = () => {
    return solicitud.comentarioSeguridad || solicitud.aprobaciones?.seguridad?.comentario || "Sin comentarios aún";
  };

  // Función para obtener datos actuales del activo
  const obtenerDatosActivoActual = async (activoId) => {
    if (!activoId) {
      return null;
    }

    setLoadingActivo(true);
    
    try {
      const response = await ActivoService.obtenerActivoPorId(activoId);
      
      let activoData = null;
      
      // Manejar diferentes estructuras de respuesta
      if (response && response.success && response.data) {
        activoData = response.data;
      } else if (response && response.data) {
        activoData = response.data;
      } else if (response) {
        activoData = response;
      }
      
      return activoData;
      
    } catch (error) {
      console.error("Error obteniendo datos del activo:", error);
      return null;
    } finally {
      setLoadingActivo(false);
    }
  };

  // Función para navegar a Modificar Activo
  const handleCorregirSolicitud = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    const estadoActual = getEstado();
    
    if (estadoActual !== "Rechazado") {
      alert("Solo puedes corregir solicitudes que han sido rechazadas.");
      return;
    }
    
    if (!onNavigateToModificarActivo) {
      alert("Error: No se puede navegar a la pantalla de modificación.");
      return;
    }

    try {
      // Obtener datos actuales del activo SIEMPRE
      let activoActual = null;
      if (solicitud.activoId) {
        activoActual = await obtenerDatosActivoActual(solicitud.activoId);
      }

      // Preparar objeto con TODOS los datos del activo
      const datosActivoCompletos = {
        // Identificación
        id: solicitud.activoId,
        codigo: solicitud.codigoActivo || "",
        
        // Datos principales (prioridad: activoActual > cambios > valores por defecto)
        nombre: "",
        categoria: "",
        descripcion: "",
        ubicacion: "",
        estado: "",
        responsable: "",
        responsableId: "",
        version: "v1.0.0"
      };

      // PRIMERO: Usar datos del activo actual si están disponibles
      if (activoActual) {
        datosActivoCompletos.id = activoActual._id || activoActual.id || solicitud.activoId;
        datosActivoCompletos.codigo = activoActual.codigo || solicitud.codigoActivo || "";
        
        // Mapear TODOS los campos del activo actual
        datosActivoCompletos.nombre = activoActual.nombre || "";
        datosActivoCompletos.descripcion = activoActual.descripcion || "";
        datosActivoCompletos.ubicacion = activoActual.ubicacion || "";
        datosActivoCompletos.estado = activoActual.estado || "";
        datosActivoCompletos.categoria = activoActual.categoria || "";
        datosActivoCompletos.version = activoActual.version || "v1.0.0";
        
        // Manejar responsable
        if (typeof activoActual.responsable === 'object') {
          datosActivoCompletos.responsable = activoActual.responsable.nombreCompleto || 
            `${activoActual.responsable.nombre || ''} ${activoActual.responsable.apellido || ''}`.trim();
          datosActivoCompletos.responsableId = activoActual.responsable.id || activoActual.responsable._id;
        } else if (activoActual.responsable) {
          datosActivoCompletos.responsable = getNombreResponsableById(activoActual.responsable);
          datosActivoCompletos.responsableId = activoActual.responsable;
        } else if (activoActual.responsableId) {
          datosActivoCompletos.responsable = getNombreResponsableById(activoActual.responsableId);
          datosActivoCompletos.responsableId = activoActual.responsableId;
        }
      } 
      
      // SEGUNDO: Si faltan datos, completar con cambios de la solicitud
      if (solicitud.cambios && Array.isArray(solicitud.cambios)) {
        solicitud.cambios.forEach((cambio) => {
          // Para modificación, usar valorAnterior como estado actual
          const valorActual = cambio.valorAnterior;
          
          if (valorActual !== null && valorActual !== undefined) {
            const campo = cambio.campo.toLowerCase();
            
            // Solo asignar si el campo está vacío
            switch (campo) {
              case 'nombre':
                if (!datosActivoCompletos.nombre) datosActivoCompletos.nombre = valorActual;
                break;
              case 'categoria':
                if (!datosActivoCompletos.categoria) datosActivoCompletos.categoria = valorActual;
                break;
              case 'descripcion':
                if (!datosActivoCompletos.descripcion) datosActivoCompletos.descripcion = valorActual;
                break;
              case 'ubicacion':
                if (!datosActivoCompletos.ubicacion) datosActivoCompletos.ubicacion = valorActual;
                break;
              case 'estado':
                if (!datosActivoCompletos.estado) datosActivoCompletos.estado = valorActual;
                break;
              case 'responsableid':
                if (!datosActivoCompletos.responsable) {
                  datosActivoCompletos.responsable = getNombreResponsableById(valorActual);
                  datosActivoCompletos.responsableId = valorActual;
                }
                break;
            }
          }
        });
      }
      
      // TERCERO: Valores por defecto para campos vacíos
      if (!datosActivoCompletos.nombre || datosActivoCompletos.nombre.trim() === "") {
        datosActivoCompletos.nombre = solicitud.tipoSolicitud === 'creacion' 
          ? "Nuevo activo - favor completar" 
          : "Activo por modificar";
      }
      
      if (!datosActivoCompletos.categoria || datosActivoCompletos.categoria.trim() === "") {
        datosActivoCompletos.categoria = "Infraestructura";
      }
      
      if (!datosActivoCompletos.descripcion || datosActivoCompletos.descripcion.trim() === "") {
        datosActivoCompletos.descripcion = "Descripción no disponible - favor completar";
      }
      
      if (!datosActivoCompletos.ubicacion || datosActivoCompletos.ubicacion.trim() === "") {
        datosActivoCompletos.ubicacion = "No especificada";
      }
      
      if (!datosActivoCompletos.estado || datosActivoCompletos.estado.trim() === "") {
        datosActivoCompletos.estado = "Activo";
      }
      
      if (!datosActivoCompletos.responsable || datosActivoCompletos.responsable.trim() === "") {
        datosActivoCompletos.responsable = "No asignado";
      }

      // Pasar los datos a ModificarActivo.jsx
      onNavigateToModificarActivo(
        datosActivoCompletos, 
        "solicitudes", 
        solicitud.tipoSolicitud || 'modificacion'
      );
      
    } catch (error) {
      console.error("Error en handleCorregirSolicitud:", error);
      alert("Error al preparar los datos para modificar. Intente nuevamente.");
    }
  };

  // Preparar datos para la tabla de cambios
  const prepareCambiosTableData = () => {
    if (!solicitud.cambios || !Array.isArray(solicitud.cambios)) {
      return [];
    }

    // Para creación de activo
    if (solicitud.tipoSolicitud === 'creacion') {
      const cambiosCreacion = [];
      
      const camposCreacion = [
        { key: 'nombre', label: 'Nombre' },
        { key: 'categoria', label: 'Categoría' },
        { key: 'descripcion', label: 'Descripción' },
        { key: 'ubicacion', label: 'Ubicación' },
        { key: 'estado', label: 'Estado' },
        { key: 'responsableId', label: 'Responsable' },
        { key: 'version', label: 'Versión' }
      ];

      camposCreacion.forEach(campoInfo => {
        const cambioExistente = solicitud.cambios.find(c => 
          c.campo.toLowerCase() === campoInfo.key.toLowerCase()
        );

        if (cambioExistente) {
          let valorNuevo = cambioExistente.valorNuevo;
          
          if (campoInfo.key === 'responsableId') {
            valorNuevo = getNombreResponsableById(valorNuevo);
            if (!valorNuevo || valorNuevo === 'undefined' || valorNuevo === 'null') {
              valorNuevo = "(sin valor nuevo)";
            }
          }

          cambiosCreacion.push({
            id: `${campoInfo.key}-creacion`,
            campo: campoInfo.label,
            valorAnterior: "(sin valor anterior)",
            valorModificado: valorNuevo !== null && valorNuevo !== undefined ? 
              String(valorNuevo).trim() : "(sin valor nuevo)"
          });
        } else {
          cambiosCreacion.push({
            id: `${campoInfo.key}-creacion`,
            campo: campoInfo.label,
            valorAnterior: "(sin valor anterior)",
            valorModificado: "(sin valor nuevo)"
          });
        }
      });

      return cambiosCreacion;
    }

    // Para modificación de activo
    return solicitud.cambios.map((cambio, index) => {
      let campoNombre = cambio.campo;
      let valorAnterior = cambio.valorAnterior;
      let valorNuevo = cambio.valorNuevo;

      // Mejorar nombres de campo
      switch (campoNombre.toLowerCase()) {
        case 'nombre':
          campoNombre = 'Nombre';
          break;
        case 'categoria':
          campoNombre = 'Categoría';
          break;
        case 'descripcion':
          campoNombre = 'Descripción';
          break;
        case 'estado':
          campoNombre = 'Estado';
          break;
        case 'ubicacion':
          campoNombre = 'Ubicación';
          break;
        case 'responsableid':
          campoNombre = 'Responsable';
          valorAnterior = getNombreResponsableById(valorAnterior);
          valorNuevo = getNombreResponsableById(valorNuevo);
          valorAnterior = !valorAnterior || valorAnterior === 'undefined' || valorAnterior === 'null' ? 
            "(sin valor anterior)" : valorAnterior;
          valorNuevo = !valorNuevo || valorNuevo === 'undefined' || valorNuevo === 'null' ? 
            "(sin valor nuevo)" : valorNuevo;
          break;
        case 'version':
          campoNombre = 'Versión';
          break;
        default:
          campoNombre = campoNombre.charAt(0).toUpperCase() + campoNombre.slice(1);
      }

      // Manejar valores nulos
      if (campoNombre !== 'Responsable') {
        valorAnterior = valorAnterior === null || valorAnterior === undefined || 
                       valorAnterior === 'undefined' || valorAnterior === 'null' ? 
                       "(sin valor anterior)" : String(valorAnterior).trim();
        valorNuevo = valorNuevo === null || valorNuevo === undefined || 
                     valorNuevo === 'undefined' || valorNuevo === 'null' ? 
                     "(sin valor nuevo)" : String(valorNuevo).trim();
      }

      return {
        id: index,
        campo: campoNombre,
        valorAnterior: valorAnterior,
        valorModificado: valorNuevo,
      };
    });
  };

  // Columnas para la tabla de cambios
  const cambiosTableColumns = [
    {
      key: "campo",
      label: "Campo modificado",
      render: (row) => <strong className="text-dark">{row.campo}</strong>,
      cellStyle: { 
        minWidth: "150px",
        maxWidth: "200px"
      }
    },
    {
      key: "valorAnterior",
      label: "Valor anterior",
      render: (row) => <span className="text-dark">{row.valorAnterior}</span>,
      cellStyle: { 
        minWidth: "250px",
        maxWidth: "300px"
      }
    },
    {
      key: "valorModificado",
      label: "Valor nuevo",
      render: (row) => <span className="text-dark">{row.valorModificado}</span>,
      cellStyle: { 
        minWidth: "250px",
        maxWidth: "300px"
      }
    },
  ];

  const cambiosTableData = prepareCambiosTableData();
  const estado = getEstado();
  const nombreResponsableSeguridad = getNombreResponsableSeguridad();

  return (
    <div className="solicitud-detalles-container p-2 p-lg-3">
      <Button
        variant="outline"
        size="sm"
        onClick={onNavigateBack}
        className="mb-3 text-white border-white"
      >
        <FaArrowLeft className="me-2" />
        Volver a mis solicitudes
      </Button>

      <div className="d-flex justify-content-between align-items-start mb-3 mb-lg-4">
        <div className="text-white">
          <h2 className="fw-bold mb-1 h4-responsive">Detalles de Solicitud de Cambio</h2>
          <h6 className="text-white-50 h6-responsive">
            <strong>Código:</strong> {solicitud.codigoSolicitud}
            {solicitud.tipoSolicitud && (
              <span className="ms-2 badge bg-info">
                {solicitud.tipoSolicitud === 'creacion' ? 'Creación' : 'Modificación'}
              </span>
            )}
            {loadingActivo && (
              <span className="ms-2 badge bg-warning">
                <i className="bi bi-arrow-repeat me-1"></i>
                Cargando datos del activo...
              </span>
            )}
          </h6>
        </div>
        
        {estado === "Rechazado" && (
          <Button
            variant="warning"
            size="md"
            onClick={handleCorregirSolicitud}
            className="text-dark fw-bold d-flex align-items-center"
            style={{ 
              backgroundColor: '#ffc107', 
              borderColor: '#ffc107',
              whiteSpace: 'nowrap',
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              fontWeight: '600'
            }}
            disabled={loadingActivo}
          >
            {loadingActivo ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Cargando...
              </>
            ) : (
              <>
                <FaEdit className="me-2" size={18} />
                Corregir Solicitud
              </>
            )}
          </Button>
        )}
      </div>

      <div className="row">
        <div className="col-12 col-lg-5 mb-3 mb-lg-0">
          <Card className="h-auto" style={{ backgroundColor: '#FFEEEE' }}>
            <div className="card-body p-2 p-lg-3">
              <div className="bg-white p-2 p-lg-3 rounded mb-2 mb-lg-3">
                <h5 className="card-title fw-bold mb-0 text-primary d-flex align-items-center h5-responsive">
                  <FaShieldAlt className="me-2 text-primary" />
                  Revisión de Seguridad
                </h5>
              </div>
              
              <div className="mb-2 mb-lg-3">
                <label className="form-label fw-semibold small text-dark">
                  Responsable de Seguridad
                </label>
                <p className="mb-1 mb-lg-2 small text-dark">
                  {nombreResponsableSeguridad}
                  {solicitud.responsableSeguridad?.codigo && (
                    <small className="d-block text-muted">
                      Código: {solicitud.responsableSeguridad.codigo}
                    </small>
                  )}
                </p>
              </div>

              <div className="mb-2 mb-lg-3">
                <label className="form-label fw-semibold small text-dark">
                  Fecha de Revisión
                </label>
                <p className="mb-1 mb-lg-2 small text-dark">
                  {formatFecha(solicitud.fechaRevision)}
                </p>
              </div>

              <div>
                <label className="form-label fw-semibold small text-dark">
                  Comentario de Revisión
                </label>
                <p className="small text-dark" style={{ minHeight: "50px" }}>
                  {getComentarioSeguridad()}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="col-12 col-lg-7 mt-3 mt-lg-0">
          <Card style={{ backgroundColor: '#FFEEEE' }}>
            <div className="card-body p-2 p-lg-3">
              <div className="bg-white p-2 p-lg-3 rounded mb-2 mb-lg-3">
                <h5 className="card-title fw-bold mb-0 text-primary d-flex align-items-center h5-responsive">
                  <FaInfoCircle className="me-2 text-primary" />
                  Información de la Solicitud
                </h5>
              </div>

              <div className="mb-3 mb-lg-4 p-2 p-lg-3 rounded" style={{ backgroundColor: '#FFEEEE' }}>
                <div className="row">
                  <div className="col-12 col-md-6 mb-2 mb-md-0">
                    <strong className="text-dark">Estado de la solicitud:</strong>
                    <span
                      className={`badge ms-2 ${
                        estado === "Aprobado"
                          ? "bg-success"
                          : estado === "Rechazado"
                          ? "bg-danger"
                          : "bg-warning"
                      }`}
                    >
                      {estado}
                    </span>
                  </div>
                  <div className="col-12 col-md-6">
                    <strong className="text-dark">Fecha de Solicitud:</strong>
                    <span className="ms-2 text-dark d-block d-md-inline">
                      {formatFecha(solicitud.fechaSolicitud)}
                    </span>
                  </div>
                </div>
                
                <div className="row mt-2">
                  <div className="col-12">
                    <strong className="text-dark">Código del Activo:</strong>
                    <span className="ms-2 text-dark d-block d-md-inline">
                      {solicitud.codigoActivo}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-3 mb-lg-4 ps-3">
                <h6 className="fw-bold mb-2 mb-lg-3 text-dark h6-responsive">
                  Justificación del Cambio
                </h6>
                <Card style={{ backgroundColor: '#FFEEEE' }}>
                  <div className="card-body p-2 p-lg-3">
                    <p className="mb-0 text-dark">{solicitud.justificacion || "Sin justificación proporcionada"}</p>
                  </div>
                </Card>
              </div>

              <div className="mb-3 mb-lg-4 ps-3">
                <h6 className="fw-bold mb-2 mb-lg-3 text-dark h6-responsive">
                  Cambios Realizados ({cambiosTableData.length})
                </h6>
                
                {cambiosTableData.length > 0 ? (
                  <div className="table-responsive">
                    <Table
                      columns={cambiosTableColumns}
                      data={cambiosTableData}
                      compact={true}
                      bordered={true}
                    />
                    {loadingUsuarios && (
                      <div className="text-center text-muted small mt-2">
                        <i className="bi bi-hourglass-split me-1"></i>
                        Cargando información de responsables...
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="alert alert-info">
                    No se registraron cambios específicos para esta solicitud.
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SolicitudDetalles;