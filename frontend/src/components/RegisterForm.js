'use client';

import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';
import { Input, Button, Card, Select, Alert } from './ui';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    department: '',
    userRole: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const userRoles = [
    { value: 'administrator', label: 'Administrator' },
    { value: 'security_officer', label: 'Security Officer' },
    { value: 'internal_auditor', label: 'Internal Auditor' },
    { value: 'user', label: 'User' }
  ];

  const departments = [
    { value: 'it', label: 'Information Technology' },
    { value: 'security', label: 'Security' },
    { value: 'audit', label: 'Internal Audit' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'finance', label: 'Finance' },
    { value: 'operations', label: 'Operations' },
    { value: 'legal', label: 'Legal & Compliance' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    // Clear success message when form is modified
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }
    
    if (!formData.department) {
      newErrors.department = 'Department is required';
    }
    
    if (!formData.userRole) {
      newErrors.userRole = 'User role is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    setErrors({});
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create user object without confirmPassword
      const { confirmPassword, ...userData } = formData;
      console.log('User created:', userData);
      
      const roleLabel = userRoles.find(role => role.value === formData.userRole)?.label;
      setSuccessMessage(`User ${formData.firstName} ${formData.lastName} has been successfully created with role: ${roleLabel}`);
      
      // Reset form after successful creation
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        department: '',
        userRole: '',
        password: '',
        confirmPassword: ''
      });
      
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ general: 'Failed to create user. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      department: '',
      userRole: '',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
    setSuccessMessage('');
  };

  return (
    <Container fluid className="auth-gradient-container register-container">
      <Row className="justify-content-center align-items-center min-vh-100 py-4">
        <Col xs={12} sm={11} md={10} lg={8} xl={6}>
          <Card className="shadow-lg">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <Image
                  src="/icons/JPG/logo_without_name.jpg"
                  alt="SecureFlow Logo"
                  width={150}
                  height={150}
                  className="mb-3"
                  priority
                />
                <h1 className="text-navy fw-bold mb-3 app-title-small">
                  SecureFlow FH
                </h1>
                <h2 className="text-navy fw-bold mb-2">Create New User</h2>
                <p className="text-muted">Administrator Panel - User Registration</p>
              </div>

              {successMessage && (
                <Alert variant="success" dismissible onClose={() => setSuccessMessage('')}>
                  <i className="bi bi-check-circle-fill me-2"></i>
                  {successMessage}
                </Alert>
              )}

              {errors.general && (
                <Alert variant="danger" dismissible onClose={() => setErrors(prev => ({ ...prev, general: '' }))}>
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {errors.general}
                </Alert>
              )}
              
              <form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Input
                      type="text"
                      name="firstName"
                      label="First Name"
                      placeholder="Enter first name"
                      value={formData.firstName}
                      onChange={handleChange}
                      error={errors.firstName}
                      required
                    />
                  </Col>
                  <Col md={6}>
                    <Input
                      type="text"
                      name="lastName"
                      label="Last Name"
                      placeholder="Enter last name"
                      value={formData.lastName}
                      onChange={handleChange}
                      error={errors.lastName}
                      required
                    />
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Input
                      type="email"
                      name="email"
                      label="Email Address"
                      placeholder="Enter email address"
                      value={formData.email}
                      onChange={handleChange}
                      error={errors.email}
                      required
                    />
                  </Col>
                  <Col md={6}>
                    <Input
                      type="tel"
                      name="phoneNumber"
                      label="Phone Number"
                      placeholder="Enter phone number"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      error={errors.phoneNumber}
                      required
                    />
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Select
                      name="department"
                      label="Department"
                      placeholder="Select department"
                      options={departments}
                      value={formData.department}
                      onChange={handleChange}
                      error={errors.department}
                      required
                    />
                  </Col>
                  <Col md={6}>
                    <Select
                      name="userRole"
                      label="User Role"
                      placeholder="Select user role"
                      options={userRoles}
                      value={formData.userRole}
                      onChange={handleChange}
                      error={errors.userRole}
                      required
                    />
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Input
                      type="password"
                      name="password"
                      label="Password"
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={handleChange}
                      error={errors.password}
                      required
                    />
                    <small className="text-muted">
                      Password must contain uppercase, lowercase, and number (min 8 characters)
                    </small>
                  </Col>
                  <Col md={6}>
                    <Input
                      type="password"
                      name="confirmPassword"
                      label="Confirm Password"
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      error={errors.confirmPassword}
                      required
                    />
                  </Col>
                </Row>
                
                <div className="d-flex justify-content-between align-items-center mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={handleReset}
                    disabled={loading}
                    className="me-3"
                  >
                    Reset Form
                  </Button>
                  
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={loading}
                    disabled={loading}
                    className="flex-grow-1"
                  >
                    Create User
                  </Button>
                </div>
                
                <div className="text-center mt-4">
                  <Link href="/login" className="text-decoration-none text-primary-custom fw-semibold">
                    <i className="bi bi-arrow-left me-2"></i>
                    Back to Login
                  </Link>
                </div>
              </form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterForm;