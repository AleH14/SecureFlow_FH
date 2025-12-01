const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { sendError } = require('../utils/helpers');

// Middleware de autenticación JWT
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return sendError(res, 401, 'Acceso denegado. Token no proporcionado');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production');
    
    // Buscar usuario para verificar que aún existe
    const user = await User.findById(decoded.id).select('-contrasenaHash');
    
    if (!user) {
      return sendError(res, 401, 'Token inválido. Usuario no encontrado');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendError(res, 401, 'Token expirado');
    } else if (error.name === 'JsonWebTokenError') {
      return sendError(res, 401, 'Token inválido');
    }
    return sendError(res, 500, 'Error en autenticación');
  }
};

// Middleware para verificar rol de administrador
const admin = (req, res, next) => {
  if (req.user && req.user.rol === 'administrador') {
    next();
  } else {
    return sendError(res, 403, 'Acceso denegado. Se requieren privilegios de administrador');
  }
};

// Middleware para verificar rol de responsable de seguridad
const responsableSeguridad = (req, res, next) => {
  if (req.user && (req.user.rol === 'responsable_seguridad' || req.user.rol === 'administrador')) {
    next();
  } else {
    return sendError(res, 403, 'Acceso denegado. Se requieren privilegios de seguridad');
  }
};

// Middleware para verificar rol de auditor
const auditor = (req, res, next) => {
  if (req.user && (req.user.rol === 'auditor' || req.user.rol === 'administrador')) {
    next();
  } else {
    return sendError(res, 403, 'Acceso denegado. Se requieren privilegios de auditor');
  }
};

module.exports = {
  auth,
  admin,
  responsableSeguridad,
  auditor
};