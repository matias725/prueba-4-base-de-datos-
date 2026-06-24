import mongoose from 'mongoose';
import { env } from './env.js';

/**
 * Establece conexión segura a MongoDB con reintentos automáticos.
 * Las credenciales se leen desde variables de entorno, nunca hardcodeadas.
 */
export const connectDB = async () => {
  const options = {
    // Pool de conexiones: reutiliza hasta 10 conexiones simultáneas
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  };

  try {
    const conn = await mongoose.connect(env.mongoUri, options);
    console.log(`MongoDB conectado: ${conn.connection.host} | DB: ${conn.connection.name}`);
  } catch (error) {
    console.error(`Error al conectar a MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Eventos de conexión para monitoreo
mongoose.connection.on('disconnected', () => console.warn('MongoDB desconectado'));
mongoose.connection.on('reconnected', () => console.log('MongoDB reconectado'));
