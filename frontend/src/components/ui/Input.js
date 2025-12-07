import React, { forwardRef } from 'react';
import { Form } from 'react-bootstrap';

const Input = forwardRef(({ 
  type = 'text', 
  placeholder, 
  label, 
  error, 
  className = '', 
  required = false,
  icon,
  rightIcon,
  ...props 
}, ref) => {
  
  return (
    <Form.Group className={`mb-3 ${className}`}>
      {label && (
        <Form.Label className="fw-semibold text-navy">
          {label} {required && <span className="text-danger">*</span>}
        </Form.Label>
      )}
      <div className="input-wrapper">
        {icon && (
          <div className="input-icon-left">
            {icon}
          </div>
        )}
        <Form.Control
          ref={ref}
          type={type}
          placeholder={placeholder}
          isInvalid={!!error}  
          className={`custom-input ${icon ? 'has-left-icon' : ''} ${rightIcon ? 'has-right-icon' : ''}`}
          {...props}
        />
        {rightIcon && (
          <div className="input-icon-right">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <Form.Control.Feedback type="invalid" className="d-block">
          {error}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
});

Input.displayName = 'Input';

export default Input;