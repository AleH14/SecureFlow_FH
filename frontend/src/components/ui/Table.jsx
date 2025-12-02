import React from "react";

const Table = ({ 
  columns = [],
  data = [],
  title,
  icon,
  className = "",
  headerStyle = {},
  rowStyle = {},
  cellStyle = {},
  // Props opcionales para funcionalidad adicional
  hoverEffect = true,
  striped = false,
  bordered = false,
  compact = false,
  ...props 
}) => {
  if (!columns || columns.length === 0) {
    return <div className="table-error">No se han definido columnas para la tabla</div>;
  }

  // clases dinámicas
  const tableClasses = [
    className,
    hoverEffect ? "table-hover" : "",
    striped ? "table-striped" : "",
    bordered ? "table-bordered" : "",
    compact ? "table-compact" : ""
  ].filter(Boolean).join(" ");

  return (
    <div className={`table-container ${tableClasses}`} {...props}>
      {(title || icon) && (
        <div className="table-header">
          {icon && <div className="table-icon">{icon}</div>}
          {title && <h3 className="table-title">{title}</h3>}
        </div>
      )}
      
      <div className="table-wrapper">
        <table className="custom-table">
          <thead>
            <tr style={headerStyle}>
              {columns.map((column, index) => (
                <th 
                  key={column.key || index}
                  className="table-header-cell"
                  style={column.headerStyle || {}}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr 
                  key={row.id || rowIndex} 
                  className={`table-row ${striped && rowIndex % 2 === 0 ? 'table-row-striped' : ''}`}
                  style={rowStyle}
                >
                  {columns.map((column, colIndex) => (
                    <td 
                      key={`${rowIndex}-${column.key || colIndex}`}
                      className="table-cell"
                      style={column.cellStyle || cellStyle}
                    >
                      {column.render 
                        ? column.render(row, rowIndex) 
                        : row[column.key] || '-'
                      }
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td 
                  colSpan={columns.length} 
                  className="table-empty"
                >
                  No hay datos disponibles
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;