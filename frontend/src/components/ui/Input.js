import React, { forwardRef } from 'react';
import { Form } from 'react-bootstrap';

const Input = forwardRef(({ 
  type = 'text', 
  placeholder, 
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
      <Form.Control
        ref={ref}
        type={type}
        placeholder={placeholder}
        isInvalid={!!error}
        className="custom-input"
        {...props}
      />
      {error && (
        <Form.Control.Feedback type="invalid">
          {error}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
});

Input.displayName = 'Input';

export default Input;