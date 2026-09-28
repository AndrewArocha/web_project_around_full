import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { rateLimit } from 'express-rate-limit';

import Router from './routes/index.js';
import { createUser, login } from './controllers/users.js';
import auth from './middleware/auth.js';
import { errorHandler } from './middleware/error-handler.js';

// Fix de node DNS (Algunas veces Node no puede resolver correctamente los dominios de MongoDB Atlas en Windows)

import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

// Carga las variables de entorno del archivo .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
app.set('trust proxy', 1);

// Mongoose connection setup
mongoose.connect(process.env.MONGO_URL as string, { maxPoolSize:10 })
  .then(() => {
    console.info('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:3000" }));

// Middleware to parse incoming JSON bodies
app.use(express.json());

// ==========================================
// CONFIGURACIÓN DE LIMITADORES
// ==========================================
// Deinir el limitador para el inicio de sesión
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // Limita a 10 peticiones por IP por ventana
  message: { message: "Demasiados intentos de inicio de sesión. Intenta de nuevo más tarde." }
});

// Definir el limitador para el registro
const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 5, // Limita a 5 cuentas creadas por IP por hora
  message: { message: "Demasiadas cuentas creadas desde esta IP. Intenta de nuevo más tarde." }
});

// ==========================================
// RUTAS TEST
// ==========================================

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('El servidor va a caer');
  }, 0);
});

app.get('/health', (req, res) => {
  res.status(200).send({ status: 'ok' });
});

// ==========================================
// RUTAS PÚBLICAS (No requieren autenticación)
// ==========================================
app.post('/signup', signupLimiter, createUser);
app.post('/signin', loginLimiter, login);

// ==========================================
// BARRERA DE SEGURIDAD (Middleware JWT)
// ==========================================

app.use(auth);

// ==========================================
// RUTAS PROTEGIDAS
// ==========================================

app.use(Router);

// 404 Routes
app.use((req, res, next) => {
  next(Object.assign(new Error("Ruta no encontrada"), { statusCode: 404 }));
});

// Error handler middleware
app.use(errorHandler);

// Mount the server only if not in test mode (Local)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.info(`App listening on port ${PORT}`);
  });
}

export default app;