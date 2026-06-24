import { app } from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';

const startServer = async () => {
  await connectDB();
  app.listen(env.port, () => {
    console.log(`ComercioTech API corriendo en http://localhost:${env.port}`);
    console.log(`Entorno: ${env.nodeEnv}`);
  });
};

startServer();
