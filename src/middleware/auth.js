import jwt from 'jsonwebtoken';
import { Usuario } from '../models/Usuario.js';
import { env } from '../config/env.js';

/**
 * Verifica el JWT del header Authorization y adjunta el usuario a req.user.
 * Rechaza con 401 si el token falta, es inválido o el usuario no existe.
 */
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.jwtSecret);

    const usuario = await Usuario.findById(decoded.id).select('+rol');
    if (!usuario) {
      return res.status(401).json({ success: false, message: 'Usuario no encontrado' });
    }

    req.user = usuario;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token inválido o expirado' });
  }
};

/**
 * Restringe el acceso a los roles indicados.
 * Uso: restrictTo('admin', 'operador')
 */
export const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.rol)) {
    return res.status(403).json({
      success: false,
      message: `Acceso denegado. Se requiere rol: ${roles.join(' o ')}`,
    });
  }
  next();
};
