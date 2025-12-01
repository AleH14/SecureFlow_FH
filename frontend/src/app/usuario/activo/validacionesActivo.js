export const validateActivoForm = (formData) => {
  const errors = {};
  
  // Validación de nombre - al menos 3 palabras
  if (!formData.nombre?.trim()) {
    errors.nombre = 'El nombre del activo es requerido';
  } else {
    const wordCount = formData.nombre.trim().split(/\s+/).length;
    if (wordCount < 3) {
      errors.nombre = 'El nombre debe contener al menos 3 palabras';
    } else if (formData.nombre.length > 100) {
      errors.nombre = 'El nombre no puede exceder 100 caracteres';
    }
  }
  
  // Validación de código - formato ACT-AAA-000
  if (!formData.codigo?.trim()) {
    errors.codigo = 'El código del activo es requerido';
  } else if (!/^ACT-[A-Z]{3}-\d{3}$/.test(formData.codigo)) {
    errors.codigo = 'El código debe tener el formato: ACT-AAA-000';
  }
  
  // Validación de categoría
  if (!formData.categoria) {
    errors.categoria = 'La categoría es requerida';
  }
  
  // Validación de descripción
  if (!formData.descripcion?.trim()) {
    errors.descripcion = 'La descripción es requerida';
  } else if (formData.descripcion.length < 10) {
    errors.descripcion = 'La descripción debe tener al menos 10 caracteres';
  } else if (formData.descripcion.length > 500) {
    errors.descripcion = 'La descripción no puede exceder 500 caracteres';
  }
  
  // Validación de ubicación
  if (!formData.ubicacion?.trim()) {
    errors.ubicacion = 'La ubicación es requerida';
  } else if (formData.ubicacion.length < 5) {
    errors.ubicacion = 'La ubicación debe tener al menos 5 caracteres';
  }
  
  // Validación de estado
  if (!formData.estado) {
    errors.estado = 'El estado es requerido';
  }
  
  return errors;
};

export const categoriasOptions = [
  { value: 'Datos', label: 'Datos' },
  { value: 'Sistemas', label: 'Sistemas' },
  { value: 'Infraestructura', label: 'Infraestructura' },
  { value: 'Personas', label: 'Personas' }
];

export const estadosOptions = [
  { value: 'activo', label: 'Activo' },
  { value: 'inactivo', label: 'Inactivo' },
  { value: 'en mantenimiento', label: 'En mantenimiento' },
  { value: 'dado de baja', label: 'Dado de baja' },
  { value: 'obsoleto', label: 'Obsoleto' },
  { value: 'en evaluación', label: 'En evaluación' }
];

export const generateActivoCode = (nombre, categoria) => {
  const categoriaPrefix = categoria.substring(0, 3).toUpperCase();
  const nombrePrefix = nombre.substring(0, 2).toUpperCase();
  const randomNumbers = Math.floor(1000 + Math.random() * 9000);
  return `${categoriaPrefix}-${nombrePrefix}-${randomNumbers}`;
};