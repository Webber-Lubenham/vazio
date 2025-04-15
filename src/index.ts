import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from './swagger-output.json';

// Initialize express app
const app = express();
const port = process.env.PORT || 3004;

// Import routes after app initialization
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import { locationRoutes } from './routes/location.routes';
import developmentRoutes from './routes/development.routes';

// Import middleware after app initialization
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Desabilitar CSP para desenvolvimento
}));
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Frontend Vite
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Configuração do Drizzle
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './db/schema';

const db = drizzle(postgres(process.env.DATABASE_URL!));

// Configuração do Nodemailer para recuperação de senha
import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT!),
  secure: false,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD
  }
});

// Configuração do Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/locations', locationRoutes);
app.use('/dev', developmentRoutes);

// Rotas públicas e de desenvolvimento (não precisam de autenticação)
app.use('/api/auth', authRoutes);
app.use('/api/dev', developmentRoutes); // Rotas de desenvolvimento - somente para ambiente de testes

// Middleware de autenticação para rotas protegidas
const authMiddleware = async (req: any, res: any, next: any) => {
  // Verificamos se a rota é uma rota pública
  if (req.path.startsWith('/api/auth/') || req.path.startsWith('/api/dev/')) {
    return next();
  }

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

// Aplicar middleware de autenticação para todas as rotas
app.use(authMiddleware);

// Rotas protegidas (precisam de autenticação)
app.use('/api/users', userRoutes);
app.use('/api/locations', locationRoutes);

// Configuração de erros
app.use(errorHandler);

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Error handling
app.use(errorHandler);

// Start server
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
