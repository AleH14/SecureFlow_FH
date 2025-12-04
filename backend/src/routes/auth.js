const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { 
  asyncHandler, 
  sendResponse, 
  sendError, 
  isValidEmail, 
  sanitizeInput, 
  generateUserCode,
  isValidPassword,
  generateJWTToken 
} = require('../utils/helpers');

const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', asyncHandler(async (req, res) => {
  const { email, contrasena } = req.body;

  // Validar que se proporcionen email y contraseña
  if (!email || !contrasena) {
    return sendError(res, 400, 'Email y contraseña son requeridos');
  }

  // Sanitizar email
  const sanitizedEmail = sanitizeInput(email).toLowerCase();

  // Validar formato de email
  if (!isValidEmail(sanitizedEmail)) {
    return sendError(res, 400, 'Formato de email inválido');
  }

  try {
    // Buscar usuario por email
    const user = await User.findOne({ email: sanitizedEmail });
    
    if (!user) {
      return sendError(res, 401, 'Credenciales inválidas');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(contrasena, user.contrasenaHash);
    
    if (!isPasswordValid) {
      return sendError(res, 401, 'Credenciales inválidas');
    }

    // Generar JWT token
    const tokenPayload = {
      id: user._id,
      email: user.email,
      rol: user.rol,
      codigo: user.codigo
    };

    const token = generateJWTToken(tokenPayload);

    // Respuesta exitosa (sin incluir contraseña)
    const userResponse = {
      id: user._id,
      codigo: user.codigo,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      telefono: user.telefono,
      departamento: user.departamento,
      rol: user.rol,
      fechaCreacion: user.fechaCreacion
    };

    sendResponse(res, 200, 'Login exitoso', {
      user: userResponse,
      token: token,
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });

  } catch (error) {
    return sendError(res, 500, 'Error interno del servidor');
  }
}));

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', asyncHandler(async (req, res) => {
  const {
    nombre,
    apellido,
    email,
    telefono,
    departamento,
    rol,
    contrasena,
    confirmarContrasena
  } = req.body;

  // Validaciones
  if (!nombre || !apellido || !email || !telefono || !departamento || !contrasena || !confirmarContrasena) {
    return sendError(res, 400, 'Todos los campos son requeridos');
  }

  // Sanitizar inputs
  const sanitizedData = {
    nombre: sanitizeInput(nombre),
    apellido: sanitizeInput(apellido),
    email: sanitizeInput(email).toLowerCase(),
    telefono: sanitizeInput(telefono),
    departamento: sanitizeInput(departamento),
    rol: rol || 'usuario'
  };

  // Validar formato de email
  if (!isValidEmail(sanitizedData.email)) {
    return sendError(res, 400, 'Formato de email inválido');
  }

  // Validar fortaleza de contraseña
  if (!isValidPassword(contrasena)) {
    return sendError(res, 400, 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número');
  }

  // Validar que las contraseñas coincidan
  if (contrasena !== confirmarContrasena) {
    return sendError(res, 400, 'Las contraseñas no coinciden');
  }

  // Verificar si el usuario ya existe
  const existingUser = await User.findOne({ email: sanitizedData.email });
  if (existingUser) {
    return sendError(res, 409, 'Ya existe un usuario con este email');
  }

  // Verificar que el departamento sea válido
  const validDepartments = [
    'Tecnologia_de_la_Informacion',
    'recursos_humanos',
    'seguridad',
    'auditoria',
    'finanzas',
    'operaciones',
    'legal_y_cumplimiento'
  ];
  
  if (!validDepartments.includes(sanitizedData.departamento)) {
    return sendError(res, 400, 'Departamento inválido');
  }

  // Verificar que el rol sea válido
  const validRoles = ['administrador', 'responsable_seguridad', 'auditor', 'usuario'];
  if (!validRoles.includes(sanitizedData.rol)) {
    return sendError(res, 400, 'Rol inválido');
  }

  // Generar hash de la contraseña
  const saltRounds = 12;
  const contrasenaHash = await bcrypt.hash(contrasena, saltRounds);

  // Generar código único
  let codigo;
  let codigoExists = true;
  
  while (codigoExists) {
    codigo = generateUserCode();
    const userWithCode = await User.findOne({ codigo });
    if (!userWithCode) {
      codigoExists = false;
    }
  }

  // Crear nuevo usuario
  const newUser = new User({
    codigo,
    nombre: sanitizedData.nombre,
    apellido: sanitizedData.apellido,
    email: sanitizedData.email,
    telefono: sanitizedData.telefono,
    departamento: sanitizedData.departamento,
    rol: sanitizedData.rol,
    contrasenaHash,
    fechaCreacion: new Date()
  });

  const savedUser = await newUser.save();

  // Respuesta sin incluir la contraseña
  const userResponse = {
    id: savedUser._id,
    codigo: savedUser.codigo,
    nombre: savedUser.nombre,
    apellido: savedUser.apellido,
    email: savedUser.email,
    telefono: savedUser.telefono,
    departamento: savedUser.departamento,
    rol: savedUser.rol,
    fechaCreacion: savedUser.fechaCreacion
  };

  sendResponse(res, 201, 'Usuario registrado exitosamente', userResponse);
}));

// @route   POST /api/auth/logout
// @desc    Logout user (invalidate token)
// @access  Private
router.post('/logout', auth, asyncHandler(async (req, res) => {
  // En una implementación más avanzada, podrías agregar el token a una blacklist
  // o implementar un sistema de revocación de tokens
  
  // Por ahora, simplemente confirmamos el logout exitoso
  // El cliente debe eliminar el token del localStorage/cookies
  
  sendResponse(res, 200, 'Sesión cerrada exitosamente', {
    message: 'Token invalidado correctamente'
  });
}));

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, asyncHandler(async (req, res) => {
  // El middleware auth ya carga el usuario en req.user
  const userResponse = {
    id: req.user._id,
    codigo: req.user.codigo,
    nombre: req.user.nombre,
    apellido: req.user.apellido,
    email: req.user.email,
    telefono: req.user.telefono,
    departamento: req.user.departamento,
    rol: req.user.rol,
    fechaCreacion: req.user.fechaCreacion
  };

  sendResponse(res, 200, 'Usuario obtenido correctamente', userResponse);
}));

module.exports = router;