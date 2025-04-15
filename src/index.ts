import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { users, responsibleLinks, locations } from './db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { AuthService } from './services/auth.service';
import { authenticateToken, authorizeRole } from './middleware/auth.middleware';
import { UserRole } from './types/auth';

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limite de 100 requisições por IP
});
app.use(limiter);

// Configuração do Supabase
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

// Configuração do Drizzle
const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);
const db = drizzle(client);

// Configuração do Nodemailer para recuperação de senha
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Middleware de autenticação
const authenticate = async (req: any, res: any, next: any) => {
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

// Rotas públicas
app.post('/auth/register', async (req, res) => {
  try {
    const result = await AuthService.register(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const result = await AuthService.login(req.body);
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

app.post('/auth/reset-password', async (req, res) => {
  try {
    const result = await AuthService.requestPasswordReset(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/auth/new-password', async (req, res) => {
  try {
    const result = await AuthService.resetPassword(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Rotas protegidas
app.get('/profile', authenticateToken, async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota de teste
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Rotas de localização
app.post('/location', authenticate, async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const userId = req.user.id;

    const [location] = await db.insert(locations).values({
      userId,
      latitude,
      longitude,
    }).returning();

    res.status(201).json(location);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao salvar localização' });
  }
});

app.get('/location/:userId', authenticate, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Verificar se o usuário tem permissão (é responsável do aluno)
    const [link] = await db.select()
      .from(responsibleLinks)
      .where(eq(responsibleLinks.responsavelId, req.user.id))
      .where(eq(responsibleLinks.alunoId, userId));

    if (!link && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso não autorizado' });
    }

    // Buscar última localização
    const [location] = await db.select()
      .from(locations)
      .where(eq(locations.userId, userId))
      .orderBy(locations.timestamp)
      .limit(1);

    res.json(location);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar localização' });
  }
});

// Rotas de associação aluno-responsável
app.post('/responsible-link', authenticate, async (req, res) => {
  try {
    const { alunoId } = req.body;
    const responsavelId = req.user.id;

    // Verificar se o usuário é um responsável
    if (req.user.role !== 'responsavel') {
      return res.status(403).json({ error: 'Apenas responsáveis podem criar associações' });
    }

    // Verificar se o aluno existe
    const [aluno] = await db.select().from(users).where(eq(users.id, alunoId));
    if (!aluno || aluno.role !== 'aluno') {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }

    // Criar associação
    const [link] = await db.insert(responsibleLinks).values({
      alunoId,
      responsavelId,
    }).returning();

    res.status(201).json(link);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar associação' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}); 