import React, { useState, useEffect, useCallback, useMemo } from "react";
import { FaArrowLeft, FaCommentAlt } from "react-icons/fa";
import { createPortal } from "react-dom";
import { Table, Button } from "../ui";
import { ActivoService } from "@/services";
import { getCurrentUser } from "@/services/userService";
import { HiOutlineSearch } from "react-icons/hi";

const SCVBase = ({
  onNavigateBack,
  selectedActivo,
  userRole = "admin", // 'admin', 'auditor', 'security', 'user'
  showActions = false,
  customColumns = null,
  customDataTransform = null,
}) => {
  const [historialData, setHistorialData] = useState([]);
  const [activoInfo, setActivoInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Estados para modal de comentarios (auditor)
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [comment, setComment] = useState("");

  // Función para determinar el tipo de versión (PATCH, MINOR, MAJOR)
  const getTipoVersion = (cambios) => {
    if (!cambios || cambios.length === 0) return "PATCH";
    
    let tipo = "PATCH"; // Por defecto
    
    cambios.forEach(cambio => {
      const campo = cambio.campo?.toLowerCase();
      
      // Cambios MAJOR: Nombre, categoría
      if (["nombre", "categoria"].includes(campo)) {
        tipo = "MAJOR";
      }
      // Cambios MINOR: Estado, responsable, descripción importante
      else if (["estado", "responsableid", "descripcion"].includes(campo)) {
        if (tipo !== "MAJOR") {
          tipo = "MINOR";
        }
      }
      // Cambios PATCH: Ubicación, código, fechas menores
      else if (["ubicacion", "codigo", "fechacreacion"].includes(campo)) {
        // Ya es PATCH por defecto
      }
    });
    
    return tipo;
  };

  // Cargar historial de cambios
  const loadHistorialCambios = useCallback(async () => {
    if (!selectedActivo?.id) {
      setError("No se ha seleccionado un activo válido");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await ActivoService.historyCompleteRequestByActivoId(
        selectedActivo.id
      );
      console.log("Historial de cambios:", response);

      if (response && response.data) {
        setActivoInfo(response.data.activo);
        // Ordenar por fecha ascendente (más antiguo primero) para cálculo correcto
        const historialOrdenado = (response.data.historial || [])
          .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
        setHistorialData(historialOrdenado);
      } else {
        setHistorialData([]);
      }
    } catch (error) {
      console.error("Error cargando historial:", error);

      // Manejar diferentes tipos de errores
      if (error.response?.status === 403) {
        setError("No tienes permisos para ver el historial de este activo");
      } else if (error.response?.status === 404) {
        setError("Activo no encontrado");
      } else {
        setError("Error al cargar el historial de cambios");
      }

      setHistorialData([]);
    } finally {
      setLoading(false);
    }
  }, [selectedActivo?.id]);

  // Cargar información del usuario actual
  const loadCurrentUser = useCallback(async () => {
    try {
      const userResponse = await getCurrentUser();
      if (userResponse && userResponse.data) {
        setCurrentUser(userResponse.data);
      }
    } catch (error) {
      console.error("Error cargando usuario actual:", error);
    }
  }, []);

  // Cargar datos al montar el componente o cambiar el activo
  useEffect(() => {
    loadCurrentUser();
  }, [loadCurrentUser]);

  useEffect(() => {
    loadHistorialCambios();
  }, [loadHistorialCambios]);

  const handleBack = () => {
    if (onNavigateBack) {
      onNavigateBack();
    }
  };

  // Función para obtener la clase del estado
  const getEstadoClass = (estado) => {
    switch (estado?.toLowerCase()) {
      case "aprobado":
        return "estado-aprobado";
      case "pendiente":
        return "estado-pendiente";
      case "rechazado":
        return "estado-rechazado";
      case "en revisión":
      case "en revision":
        return "estado-revision";
      default:
        return "estado-default";
    }
  };

  // Función para formatear fecha
  const formatFecha = (fecha) => {
    if (!fecha) return "N/A";
    return new Date(fecha).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // Funciones para modal de comentarios (auditor)
  const handleComment = (record) => {
    setSelectedRecord(record);
    setComment("");
    setShowCommentModal(true);
    document.body.classList.add("modal-open");
  };

  const handleSubmitComment = async () => {
    if (!comment.trim() || !selectedRecord?.id) {
      console.error("Comentario vacío o solicitud inválida");
      return;
    }

    try {
      setLoading(true);
      console.log("Enviando comentario de auditoría:", {
        solicitudId: selectedRecord.id,
        comentario: comment.trim(),
        auditor: currentUser?.nombreCompleto || "Auditor",
      });

      // Importar el servicio dinámicamente para evitar problemas de dependencia circular
      const { addCommentToRequestByAuditory } = await import(
        "@/services/requestService"
      );

      const response = await addCommentToRequestByAuditory(
        selectedRecord.id,
        comment.trim()
      );

      console.log("Respuesta del comentario de auditoría:", response);

      // Recargar el historial para mostrar el nuevo comentario
      await loadHistorialCambios();

      // Cerrar modal y limpiar estado
      setShowCommentModal(false);
      setSelectedRecord(null);
      setComment("");
      document.body.classList.remove("modal-open");

      // Mostrar mensaje de éxito (podrías agregar un toast aquí)
      console.log("Comentario de auditoría agregado exitosamente");
    } catch (error) {
      console.error("Error agregando comentario de auditoría:", error);

      // Manejar errores específicos
      let errorMessage = "Error al agregar el comentario de auditoría";
      if (error.response?.status === 403) {
        errorMessage =
          "No tienes permisos para agregar comentarios de auditoría";
      } else if (error.response?.status === 404) {
        errorMessage = "Solicitud no encontrada";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      // Mostrar error al usuario (podrías usar un toast aquí)
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelComment = () => {
    setShowCommentModal(false);
    setSelectedRecord(null);
    setComment("");
    document.body.classList.remove("modal-open");
  };

  // Determinar qué historial mostrar según el rol
  const getHistorialFiltrado = () => {
    // Security y Auditor ven TODOS los cambios
    if (userRole === "security" || userRole === "auditor") {
      return historialData;
    }
    // Admin y User solo ven APROBADOS
    else {
      return historialData.filter(item => 
        item.estado?.toLowerCase() === "aprobado"
      );
    }
  };

  // Función para saber si debemos mostrar versión
  const debeMostrarVersion = () => {
    // Solo Admin y User muestran versión
    return userRole === "admin" || userRole === "user";
  };

  // Función para calcular versiones SOLO sobre los cambios aprobados que se están mostrando
  const calcularVersionesParaHistorialMostrado = useCallback((historialMostrado) => {
    // Si no debemos mostrar versión o no hay historial, retornar mapa vacío
    if (!debeMostrarVersion() || !historialMostrado || historialMostrado.length === 0) {
      return new Map();
    }
    
    const versionesMap = new Map();
    
    // Para Admin/User, el historialMostrado ya está filtrado a solo aprobados
    if (userRole === "admin" || userRole === "user") {
      // Iniciar en v1.0.0
      let major = 1;
      let minor = 0;
      let patch = 0;
      
      // Recorrer el historial mostrado en orden cronológico (ya está ordenado)
      for (let i = 0; i < historialMostrado.length; i++) {
        const registro = historialMostrado[i];
        const cambiosRegistro = registro.solicitudCambio?.cambios || [];
        const tipoVersion = getTipoVersion(cambiosRegistro);
        
        // Para la creación, siempre es v1.0.0
        if (i === 0 && registro.solicitudCambio?.tipoOperacion === "creacion") {
          versionesMap.set(registro.id, "v1.0.0");
          continue;
        }
        
        // Aplicar reglas de semver basadas en el tipo de cambio
        if (tipoVersion === "MAJOR") {
          major++;
          minor = 0;
          patch = 0;
        } else if (tipoVersion === "MINOR") {
          minor++;
          patch = 0;
        } else if (tipoVersion === "PATCH") {
          patch++;
        }
        
        // Guardar la versión calculada para este registro
        versionesMap.set(registro.id, `v${major}.${minor}.${patch}`);
      }
    }
    
    return versionesMap;
  }, [userRole, debeMostrarVersion]);

  // Obtener historial filtrado según rol
  const historialFiltrado = useMemo(() => getHistorialFiltrado(), [historialData, userRole]);

  // Calcular versiones SOLO para el historial que se está mostrando
  const versionesMap = useMemo(() => 
    calcularVersionesParaHistorialMostrado(historialFiltrado),
    [historialFiltrado, calcularVersionesParaHistorialMostrado]
  );

// Transformación de datos base 
const defaultDataTransform = useCallback((item, index) => {
  // Obtener versión SOLO si es aprobado y debemos mostrar versión
  let versionDisplay = null;
  if (debeMostrarVersion() && item.estado?.toLowerCase() === "aprobado") {
    const version = versionesMap.get(item.id);
    if (version) {
      versionDisplay = (
        <span className="version-badge">
          {version}
        </span>
      );
    }
  }

  // Obtener los cambios específicos de la solicitud
  const cambios = item.solicitudCambio?.cambios || [];
  
  // Función para formatear el nombre del campo
  const formatearNombreCampo = (campo) => {
    if (campo === "responsableId") return "Responsable";
    return campo;
  };
  
  // Función para formatear el valor de un cambio
  const formatearValor = (valor, campo) => {
    if (!valor || valor === "null" || valor.trim() === "") {
      return "Vacío";
    }
    
    // Si es un cambio de responsable
    if (campo === "responsableId") {
      // Para creación, usar el responsable de la solicitud
      if (item.solicitudCambio?.tipoOperacion === "creacion") {
        const responsableInfo = item.solicitudCambio?.responsable;
        if (responsableInfo?.nombreCompleto) {
          return responsableInfo.nombreCompleto;
        }
      }
      
      // Para modificación/reasignación, buscar en los datos poblados
      // El backend debería enviar información del nuevo responsable
      const responsableInfo = item.solicitudCambio?.responsable;
      if (responsableInfo?.nombreCompleto) {
        return responsableInfo.nombreCompleto;
      }
      
      // Si el valor coincide con el ID del solicitante, usar su nombre
      if (valor === item.solicitante?.id) {
        return item.solicitante?.nombreCompleto || valor;
      }
    }
    
    return valor;
  };

  // Crear el contenido de cambios
  const contenidoCambios = cambios.map((cambio, idx) => {
    const nombreCampo = formatearNombreCampo(cambio.campo);
    const valorNuevo = formatearValor(cambio.valorNuevo, cambio.campo);
    
    // Para creación, mostrar solo el valor nuevo
    if (item.solicitudCambio?.tipoOperacion === "creacion") {
      return (
        <React.Fragment key={idx}>
          <span className="scv-label">{nombreCampo}:</span>{" "}
          <span className="scv-value">{valorNuevo}</span>
          <br />
        </React.Fragment>
      );
    }
    
    // Para modificación, mostrar ambos
    return (
      <React.Fragment key={idx}>
        <span className="scv-label">{nombreCampo}:</span>{" "}
        <span className="scv-value">{valorNuevo}</span>
        <br />
      </React.Fragment>
    );
  });

  const baseData = {
    fecha: formatFecha(item.fecha),
    ...(debeMostrarVersion() && { version: versionDisplay }),
    solicitud_de_cambio: (
      <div className="scv-cell-content">
        <span className="scv-label">Código:</span>{" "}
        <span className="scv-value">
          {item.solicitudCambio?.codigoSolicitud || "N/A"}
        </span>
        <br />
        <span className="scv-label">Tipo:</span>{" "}
        <span className="scv-value">
          {item.solicitudCambio?.tipoOperacion || "N/A"}
        </span>
        <br />
        {/* Mostrar cambios específicos aquí */}
        {contenidoCambios.length > 0 ? (
          contenidoCambios
        ) : (
          <>
            <span className="scv-label">Cambios:</span>{" "}
            <span className="scv-value text-muted">No especificados</span>
            <br />
          </>
        )}
      </div>
    ),
    comentario: item.comentarioSolicitante || "Sin comentarios",
    revision: item.revision ? (
      <div className="scv-cell-content">
        <span className="scv-label">Responsable:</span>{" "}
        <span className="scv-value">
          {item.revision.responsableSeguridad?.nombreCompleto || "N/A"}
        </span>
        <br />
        <span className="scv-label">Fecha:</span>{" "}
        <span className="scv-value">
          {formatFecha(item.revision.fechaRevision)}
        </span>
        <br />
        <span className="scv-label">Comentario:</span>{" "}
        <span className="scv-value">
          {item.revision.comentario || "Sin comentarios"}
        </span>
      </div>
    ) : (
      <span className="text-muted">Pendiente de revisión</span>
    ),
    auditoria: item.auditoria ? (
      <div className="scv-cell-content">
        <span className="scv-label">Auditor:</span>{" "}
        <span className="scv-value">
          {item.auditoria.auditor?.nombreCompleto || "N/A"}
        </span>
        <br />
        <span className="scv-label">Fecha:</span>{" "}
        <span className="scv-value">{formatFecha(item.auditoria.fecha)}</span>
        <br />
        <span className="scv-label">Comentario:</span>{" "}
        <span className="scv-value">
          {item.auditoria.comentario || "Sin comentarios"}
        </span>
      </div>
    ) : (
      <span className="text-muted">Pendiente de auditoría</span>
    ),
    estado: (
      <span className={`estado-badge ${getEstadoClass(item.estado)}`}>
        {item.estado}
      </span>
    ),
  };

  // Agregar campos específicos según el rol
  if (userRole === "auditor" && showActions) {
    baseData.accion = (
      <button
        className="comment-btn"
        onClick={() => handleComment(item)}
        title="Agregar comentario de auditoría"
        aria-label={`Agregar comentario a ${
          item.solicitudCambio?.nombreActivo || "registro"
        }`}
      >
        <FaCommentAlt className="comment-icon" />
        Comentar
      </button>
    );
  }

  return baseData;
}, [userRole, showActions, getEstadoClass, formatFecha, handleComment, debeMostrarVersion, versionesMap]);

  // Usar transformación personalizada o la por defecto
  const historialTableData = useMemo(() => 
    historialFiltrado.map((item, index) => {
      if (customDataTransform) {
        return customDataTransform(item, index, {
          formatFecha,
          getEstadoClass,
          handleComment,
        });
      }
      return defaultDataTransform(item, index);
    }),
    [historialFiltrado, customDataTransform, defaultDataTransform, formatFecha, getEstadoClass, handleComment]
  );

  // Invertir el orden para mostrar más reciente primero
  const historialTableDataOrdenado = useMemo(() => 
    [...historialTableData].reverse(),
    [historialTableData]
  );

  // Columnas base - ajustar según si se muestra versión
  const getDefaultColumns = () => {
    const baseColumns = [];
    
    // Solo agregar columna de versión si corresponde
    if (debeMostrarVersion()) {
      baseColumns.unshift({
        key: "version",
        label: "Versión",
        cellStyle: { minWidth: "100px", textAlign: "center" },
      });
    }
    
    // Columnas comunes
    baseColumns.push(
      { key: "fecha", label: "Fecha", cellStyle: { minWidth: "100px" } },
      {
        key: "solicitud_de_cambio",
        label: "Solicitud de cambio",
        cellStyle: { minWidth: "250px" },
      },
      {
        key: "comentario",
        label: "Comentario",
        cellStyle: { minWidth: "150px" },
      },
      { key: "revision", label: "Revisión", cellStyle: { minWidth: "250px" } },
      {
        key: "auditoria",
        label: "Auditoría",
        cellStyle: { minWidth: "250px" },
      }
    );

    // Agregar columna de estado (excepto para usuarios que ven solo aprobados)
    if (userRole !== "admin" && userRole !== "user") {
      baseColumns.push({
        key: "estado",
        label: "Estado",
        cellStyle: { minWidth: "120px", textAlign: "center" },
      });
    }

    if (userRole === "auditor" && showActions) {
      baseColumns.push({
        key: "accion",
        label: "Acción",
        cellStyle: { minWidth: "120px", textAlign: "center" },
      });
    }

    return baseColumns;
  };

  const tableColumns = customColumns || getDefaultColumns();

  // Información del activo para mostrar en el header
  const displayActivoInfo = activoInfo ||
    selectedActivo || {
      nombre: "Activo no encontrado",
      codigo: "N/A",
      responsable: "N/A",
    };

  if (loading) {
    return (
      <div className="scv-page">
        <div className="scv-header">
          <div className="d-flex align-items-center mb-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="me-3 d-flex align-items-center"
              style={{ color: "white" }}
            >
              <FaArrowLeft className="me-2" />
              Regresar
            </Button>
          </div>
          <h2>Historial de Cambios</h2>
        </div>
        <div className="text-center p-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2">Cargando historial de cambios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="scv-page">
        <div className="scv-header">
          <div className="d-flex align-items-center mb-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="me-3 d-flex align-items-center"
              style={{ color: "white" }}
            >
              <FaArrowLeft className="me-2" />
              Regresar
            </Button>
          </div>
          <h2>Historial de Cambios</h2>
        </div>
        <div className="alert alert-danger text-center">
          <h5>Error al cargar el historial</h5>
          <p>{error}</p>
          <Button
            variant="primary"
            onClick={loadHistorialCambios}
            className="mt-2"
          >
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="scv-page">
      <div className="scv-header">
        <div className="d-flex align-items-center mb-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            className="me-3 d-flex align-items-center"
            style={{ color: "white" }}
          >
            <FaArrowLeft className="me-2" />
            Regresar
          </Button>
        </div>

        <h2>Historial de Cambios - {displayActivoInfo.nombre}</h2>
        <h6>Código: {displayActivoInfo.codigo}</h6>
        {historialFiltrado.length > 0 && (
          <p>
            Total de cambios: {historialFiltrado.length}
          </p>
        )}
      </div>

      {historialFiltrado.length === 0 ? (
        <div className="empty-container text-center py-5 mt-4 bg-transparent rounded-4 mx-auto">
          <HiOutlineSearch className="empty-icon fs-1 text-white mb-3" />
          <p className="empty-title fs-4 fw-bold text-white mb-2">
            {userRole === "admin" || userRole === "user" 
              ? "Sin cambios aprobados" 
              : "Sin historial de cambios"}
          </p>
          <p className="empty-subtitle text-white">
            {userRole === "admin" || userRole === "user" 
              ? "No se encontraron cambios aprobados para este activo."
              : "No se encontraron cambios registrados para este activo."}
          </p>
        </div>
      ) : (
        <Table
          columns={tableColumns}
          data={historialTableDataOrdenado}
          hoverEffect={true}
          bordered={true}
        />
      )}

      {/* Modal para comentarios (auditor) */}
      {showCommentModal &&
        createPortal(
          <div className="modalOverlay" onClick={handleCancelComment}>
            <div
              className="modalContainer"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="modalHeader"
                style={{ backgroundColor: "#17a2b8" }}
              >
                <h3 className="modalTitle">Agregar Comentario de Auditoría</h3>
                <button className="modalCloseBtn" onClick={handleCancelComment}>
                  ×
                </button>
              </div>

              <div className="modalBody">
                <p className="modalQuestion">
                  ¿Deseas agregar un comentario a este registro?
                </p>

                <div className="modalValueBox">
                  <div className="valueBoxTitle">Registro seleccionado:</div>
                  <div className="valueBoxSubtitle">
                    {selectedRecord
                      ? `${
                          selectedRecord.solicitudCambio?.nombreActivo ||
                          "Registro"
                        } - ${formatFecha(selectedRecord.fecha)}`
                      : ""}
                  </div>
                </div>

                <div className="comment-input-section">
                  <label className="comment-label">
                    Comentario de Auditoría:
                  </label>
                  <textarea
                    className="comment-textarea"
                    placeholder="Escribe tu comentario aquí..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows="4"
                  />
                </div>

                <p className="modalInformativeText">
                  El comentario será agregado como parte del proceso de
                  auditoría y quedará registrado en el historial.
                </p>
              </div>

              <div className="modalFooter">
                <button
                  className="modalBtn modalCancelBtn"
                  onClick={handleCancelComment}
                >
                  Cancelar
                </button>
                <button
                  className="modalBtn modalAcceptBtn"
                  onClick={handleSubmitComment}
                  style={{ backgroundColor: "#17a2b8" }}
                  disabled={!comment.trim()}
                >
                  Agregar Comentario
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Estilos para el modal y botones */}
      <style jsx global>{`
        /* Evitar scroll del fondo cuando modal está abierto */
        body.modal-open {
          overflow: hidden !important;
        }

        /* ==== MODAL SOBRE TODO === */
        .modalOverlay {
          position: fixed !important;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.55);
          display: flex;
          justify-content: center;
          align-items: flex-start;
          overflow: hidden;
          z-index: 50000 !important;
          padding-top: 80px;
        }

        .modalContainer {
          background: white;
          border-radius: 10px;
          width: 480px;
          max-width: 90%;
          max-height: calc(85vh - 80px);
          overflow-y: auto;
          position: relative;
          padding-bottom: 20px;
          z-index: 50001 !important;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          margin-top: 0;
        }

        /* Botón de comentar */
        .comment-btn {
          background-color: #17a2b8;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 8px 12px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .comment-btn:hover {
          background-color: #138496;
        }
        .comment-icon {
          font-size: 11px;
        }

        /* Badge de versión */
        .version-badge {
          background-color: #6f42c1;
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        /* Estilos adicionales del modal */
        .modalHeader {
          padding: 16px 20px;
          border-radius: 10px 10px 0 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .modalTitle {
          margin: 0;
          color: white;
          font-size: 18px;
          font-weight: 600;
        }
        .modalCloseBtn {
          background: none;
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: background-color 0.2s;
        }
        .modalCloseBtn:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }
        .modalBody {
          padding: 20px;
        }
        .modalQuestion {
          font-weight: 600;
          margin-bottom: 16px;
          color: #333;
        }
        .modalValueBox {
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 6px;
          padding: 12px;
          margin-bottom: 16px;
        }
        .valueBoxTitle {
          font-weight: 600;
          font-size: 14px;
          color: #495057;
          margin-bottom: 4px;
        }
        .valueBoxSubtitle {
          font-size: 14px;
          color: #6c757d;
        }
        .comment-input-section {
          margin: 16px 0;
        }
        .comment-label {
          font-weight: bold;
          color: black !important;
          margin-bottom: 8px;
          display: block;
        }
        .comment-textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          font-size: 14px;
          font-family: inherit;
          resize: vertical;
          min-height: 80px;
          box-sizing: border-box;
          background-color: #f8f9fa; 
          color: #000000ff
        }
          color: #000000ff;
          outline: none;
          border-color: #17a2b8;
          box-shadow: 0 0 0 2px rgba(23, 162, 184, 0.2);
        }
        .modalInformativeText {
          font-size: 13px;
          color: #6c757d;
          margin-top: 16px;
          line-height: 1.4;
        }
        .modalFooter {
          padding: 16px 20px;
          border-top: 1px solid #e9ecef;
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }
        .modalBtn {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          min-width: 120px;
        }
        .modalCancelBtn {
          background-color: #6c757d;
          color: white;
        }
        .modalCancelBtn:hover {
          background-color: #5a6268;
        }
        .modalAcceptBtn {
          background-color: #17a2b8;
          color: white;
        }
        .modalAcceptBtn:hover:not(:disabled) {
          background-color: #138496;
        }
        .modalAcceptBtn:disabled {
          background-color: #b8d8de;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default SCVBase;