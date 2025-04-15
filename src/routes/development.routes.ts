import { Router } from 'express';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const router = Router();

// Configuração do cliente Supabase com chave de serviço (service role)
const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzdmpubmRoYnl5eGt0YmN6bG5rIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzQwOTc3OSwiZXhwIjoyMDU4OTg1Nzc5fQ.cnmSutfsHLOWHqMpgIOv5fCHBI0jZG4AN5YJSeHDsEA';
const adminSupabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Rota para atualizar a senha de um usuário
router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    
    if (!email || !newPassword) {
      return res.status(400).json({ error: 'Email e nova senha são obrigatórios' });
    }
    
    // Buscar o usuário pelo email
    const { data: userData, error: userError } = await adminSupabase
      .from('auth.users')
      .select('id')
      .eq('email', email)
      .single();
    
    if (userError || !userData) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    // Atualizar a senha do usuário usando a API admin
    const { error: updateError } = await adminSupabase.auth.admin.updateUserById(
      userData.id,
      { password: newPassword }
    );
    
    if (updateError) {
      return res.status(500).json({ error: updateError.message });
    }
    
    res.json({ message: 'Senha atualizada com sucesso' });
  } catch (error: any) {
    console.error('Erro ao resetar senha:', error);
    res.status(500).json({ error: error.message });
  }
});

// Rota para gerar um token de login direto (bypass de senha)
router.post('/dev-login', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email é obrigatório' });
    }
    
    // Gerar token de acesso usando a API admin (sem verificar senha)
    const { data, error } = await adminSupabase.auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: {
        redirectTo: `${process.env.FRONTEND_URL || 'http://localhost:5173'}`
      }
    });
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    res.json({ 
      message: 'Token gerado com sucesso',
      data
    });
  } catch (error: any) {
    console.error('Erro ao gerar token:', error);
    res.status(500).json({ error: error.message });
  }
});

// Rota para login direto com JWT (bypass completo de Supabase)
router.post('/jwt-login', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email é obrigatório' });
    }
    
    // Buscar o usuário pelo email diretamente no Supabase
    const { data: userData, error: userError } = await adminSupabase
      .from('auth.users')
      .select('id, raw_user_meta_data')
      .eq('email', email)
      .single();
    
    if (userError || !userData) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    // Criar um JWT com os dados do usuário
    const token = jwt.sign(
      { 
        sub: userData.id,
        email: email,
        user_metadata: userData.raw_user_meta_data
      }, 
      process.env.JWT_SECRET || 'f776cf25a99bd1d5a1e00aea7fdf728bd52bc7f6023c38b82539a348a2014f86', 
      { expiresIn: process.env.JWT_EXPIRATION || '7d' }
    );
    
    res.json({
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: userData.id,
        email,
        ...userData.raw_user_meta_data
      }
    });
  } catch (error: any) {
    console.error('Erro ao fazer login com JWT:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
