import jwt from 'jsonwebtoken';
import { Usuario } from '../models/Usuario.js';
import { env } from '../config/env.js';

const generarToken = (id) => jwt.sign({ id }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

export const register = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;
    const existe = await Usuario.findOne({ email });
    if (existe) return res.status(409).json({ success: false, message: 'El email ya está registrado' });

    const usuario = await Usuario.create({ nombre, email, password, rol: rol || 'usuario' });
    const token = generarToken(usuario._id);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado correctamente',
      data: { token, usuario: { id: usuario._id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol } },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ email }).select('+password');
    if (!usuario) return res.status(401).json({ success: false, message: 'Credenciales inválidas' });

    const valido = await usuario.compararPassword(password);
    if (!valido) return res.status(401).json({ success: false, message: 'Credenciales inválidas' });

    const token = generarToken(usuario._id);
    res.json({
      success: true,
      message: 'Inicio de sesión correcto',
      data: { token, usuario: { id: usuario._id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol } },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const me = async (req, res) => {
  res.json({ success: true, data: req.user });
};

export const getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find().sort({ createdAt: -1 });
    res.json({ success: true, data: usuarios });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuario) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    res.json({ success: true, message: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
