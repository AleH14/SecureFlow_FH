import React, { forwardRef } from 'react';
import { Form } from 'react-bootstrap';

const Select = forwardRef(({ 
  options = [], 
  placeholder = 'Selecciona una opción', 
  label, 
  error, 
  className = '', 
  required = false,
  ...props 
}, ref) => {
  return (
    <Form.Group className={`mb-3 ${className}`}>
      {label && (
        <Form.Label className="fw-semibold text-navy">
          {label} {required && <span className="text-danger">*</span>}
        </Form.Label>
      )}
      <Form.Select
        ref={ref}
        isInvalid={!!error}
        className="custom-select"
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </Form.Select>
      {error && (
        <Form.Control.Feedback type="invalid">
          {error}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
});

Select.displayName = 'Select';

export default Select;