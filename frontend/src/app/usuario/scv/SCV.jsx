import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Table, Button } from "../../../components/ui";

const SCV = ({ onNavigateBack, selectedActivo }) => {
  // Datos de ejemplo del historial de cambios
  const historialCambios = [
    {
      "Fecha": "2025-11-23",
      "Solicitud de Cambio": {
        "Nombre": "Servidor Web Principal",
        "Categoría": "Infraestructura",
        "Estado": "Activo",
        "Descripción": "Servidor web para aplicaciones corporativas con balanceador de carga.",
        "Ubicación": "Sala 5 - Dep TI",
        "Responsable": "Abigail Flores"
      },
      "Comentario": "Comentario de solicitante",
      "Revisión": {
        "Rol": "Responsable de Seguridad",
        "Nombre": "Valeria Enriquez",
        "Fecha": "2025-11-23",
        "Comentario": "Comentario de Responsable de Seguridad"
      },
      "Auditoria": {
        "Auditor": "Valeria Enriquez",
        "Fecha": "2025-11-24",
        "Comentario": "Comentario de Auditor"
      },
      "Estado": "Aprobado"
    }
  ];

  const handleBack = () => {
    if (onNavigateBack) {
      onNavigateBack();
    }
  };

  // Convertir datos
  const historialData = historialCambios.map((item, index) => ({
    version: (
      <span className="version-badge">
        v1.0.{index}
      </span>
    ),
    fecha: item.Fecha,
    solicitud_de_cambio: (
      <div className="scv-cell-content">
        <span className="scv-label">Nombre:</span> <span className="scv-value">{item["Solicitud de Cambio"].Nombre}</span><br/>
        <span className="scv-label">Categoría:</span> <span className="scv-value">{item["Solicitud de Cambio"].Categoría}</span><br/>
        <span className="scv-label">Estado:</span> <span className="scv-value">{item["Solicitud de Cambio"].Estado}</span><br/>
        <span className="scv-label">Responsable:</span> <span className="scv-value">{item["Solicitud de Cambio"].Responsable}</span>
      </div>
    ),
    comentario: item.Comentario,
    revision: (
      <div className="scv-cell-content">
        <span className="scv-label">Rol:</span> <span className="scv-value">{item.Revisión.Rol}</span><br/>
        <span className="scv-label">Nombre:</span> <span className="scv-value">{item.Revisión.Nombre}</span><br/>
        <span className="scv-label">Fecha:</span> <span className="scv-value">{item.Revisión.Fecha}</span><br/>
        <span className="scv-label">Comentario:</span> <span className="scv-value">{item.Revisión.Comentario}</span>
      </div>
    ),
    auditoria: (
      <div className="scv-cell-content">
        <span className="scv-label">Auditor:</span> <span className="scv-value">{item.Auditoria.Auditor}</span><br/>
        <span className="scv-label">Fecha:</span> <span className="scv-value">{item.Auditoria.Fecha}</span><br/>
        <span className="scv-label">Comentario:</span> <span className="scv-value">{item.Auditoria.Comentario}</span>
      </div>
    )
  }));

  // Definir columnas de la tabla
  const tableColumns = [
    { 
      key: "version", 
      label: "Versión",
      cellStyle: { 
        minWidth: "100px",
        textAlign: "center"
      }
    },
    { 
      key: "fecha", 
      label: "Fecha",
      cellStyle: { minWidth: "100px" }
    },
    { 
      key: "solicitud_de_cambio", 
      label: "Solicitud de cambio",
      cellStyle: { minWidth: "250px" }
    },
    { 
      key: "comentario", 
      label: "Comentario",
      cellStyle: { minWidth: "150px" }
    },
    { 
      key: "revision", 
      label: "Revisión",
      cellStyle: { minWidth: "250px" }
    },
    { 
      key: "auditoria", 
      label: "Auditoría",
      cellStyle: { minWidth: "250px" }
    }
  ];

  // Usar datos del activo seleccionado
  const activoInfo = selectedActivo || {
    nombre: historialCambios[0]["Solicitud de Cambio"].Nombre,
    codigo: "SWP-001",
    responsable: historialCambios[0]["Solicitud de Cambio"].Responsable
  };

  return (
    <div className="scv-page">  
        <div className="scv-header">
          <div className="d-flex align-items-center mb-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="me-3 d-flex align-items-center"
              style={{ color: 'white' }}
            >
              <FaArrowLeft className="me-2" />
              Regresar
            </Button>
          </div>
          
          <h2>Historial de Cambios - {activoInfo.nombre}</h2>
          <h6>Código: {activoInfo.codigo} | Responsable: {activoInfo.responsable}</h6>
        </div>
        
        <Table 
          columns={tableColumns}
          data={historialData}
          hoverEffect={true}
          bordered={true}
        />
    </div>
  );
}

export default SCV;