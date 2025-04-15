// Servidor Express simples para autenticação
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3004;
const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta_temporaria';

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());

// Dados de usuário fictícios para demonstração
const users = [
  {
    id: '1',
    email: 'franklinmarceloferreiradelima@gmail.com',
    password: '@#$Franklin123',
    name: 'Franklin Marcelo',
    role: 'admin'
  },
  {
    id: '2',
    email: 'usuario@teste.com',
    password: 'senha123',
    name: 'Usuário Teste',
    role: 'user'
  }
];

// Função para gerar um token JWT
const generateToken = (user) => {
  const payload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (60 * 60) // Expira em 1 hora
  };
  
  return jwt.sign(payload, JWT_SECRET);
};

// Middleware de autenticação
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

// Rotas públicas

// Registro de novo estudante
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, school, grade, parentEmail } = req.body;
  
  // Verificar se o e-mail já está cadastrado
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ error: 'Este e-mail já está cadastrado' });
  }
  
  // Criar um novo ID (normalmente seria gerado pelo banco de dados)
  const newId = String(users.length + 1);
  
  // Criar o novo usuário
  const newUser = {
    id: newId,
    email,
    password,
    name,
    role: 'student',
    metadata: {
      school,
      grade,
      parentEmail,
      createdAt: new Date().toISOString(),
      emailVerified: false
    }
  };
  
  // Adicionar o usuário à lista
  users.push(newUser);
  
  // Gerar token para o novo usuário
  const token = generateToken(newUser);
  
  res.status(201).json({
    token,
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      metadata: newUser.metadata
    },
    message: 'Cadastro realizado com sucesso'
  });
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }
  
  const token = generateToken(user);
  
  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    message: 'Login realizado com sucesso'
  });
});

// Logout (apenas para compatibilidade com a API)
app.post('/api/auth/logout', (req, res) => {
  res.json({ message: 'Logout realizado com sucesso' });
});

// Rotas de desenvolvimento

// Login direto com JWT (sem verificação de senha)
app.post('/api/dev/jwt-login', (req, res) => {
  const { email } = req.body;
  
  const user = users.find(u => u.email === email);
  
  if (!user) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }
  
  const token = generateToken(user);
  
  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    message: 'Login direto realizado com sucesso'
  });
});

// Reset de senha
app.post('/api/dev/reset-password', (req, res) => {
  const { email, newPassword } = req.body;
  
  const userIndex = users.findIndex(u => u.email === email);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }
  
  // Atualiza a senha
  users[userIndex].password = newPassword;
  
  res.json({
    message: `Senha para ${email} atualizada com sucesso`,
    success: true
  });
});

// Rotas protegidas (necessitam de autenticação)

// Perfil do usuário
app.get('/api/users/profile', authMiddleware, (req, res) => {
  const user = users.find(u => u.id === req.user.sub);
  
  if (!user) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }
  
  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    metadata: user.metadata || {}
  });
});

// Listar todos os estudantes (apenas para usuários admin)
app.get('/api/users/students', authMiddleware, (req, res) => {
  // Verificar se o usuário é um administrador
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem acessar esta lista.' });
  }
  
  // Filtrar apenas usuários com role='student'
  const students = users
    .filter(user => user.role === 'student')
    .map(student => ({
      id: student.id,
      name: student.name,
      email: student.email,
      school: student.metadata?.school || 'Não informado',
      grade: student.metadata?.grade || 'Não informado'
    }));
  
  res.json({
    students,
    count: students.length
  });
});

// Rota de teste para verificar se o servidor está funcionando
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor funcionando corretamente' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
