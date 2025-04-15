import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api.service';

export const LoginForm = () => {
  const classes = {
    container: 'max-w-md mx-auto',
    card: 'card',
    formGroup: 'form-group',
    formLabel: 'form-label',
    formInput: 'form-input',
    button: 'btn w-full',
    link: 'link block text-center mt-4'
  };

  const { updateUserFromToken } = useAuth();
  const [email, setEmail] = useState('franklinmarceloferreiradelima@gmail.com');
  const [password, setPassword] = useState('@#$Franklin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [devMode, setDevMode] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Realiza o login via API
      const { data, error } = await apiService.auth.login(email, password);
      
      if (error) {
        throw new Error(error);
      }
      
      if (data && data.token) {
        // Salva o token no localStorage
        localStorage.setItem('auth_token', data.token);
        
        // Atualiza o contexto de autenticação
        updateUserFromToken(data.token);
        
        // Redireciona para a página inicial
        setSuccess(true);
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro durante o login');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Implementar a navegação para a página de recuperação de senha
    console.log('Navegar para recuperação de senha');
  };

  const handleMagicLink = async () => {
    if (!email) {
      setError('Por favor, insira seu email');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Mantemos o uso do Supabase para magic link pois é uma funcionalidade conveniente
      setMagicLinkSent(true);
      setSuccess(true);
      alert('Esta funcionalidade está simulada. Em produção, um email seria enviado para ' + email);
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar link de login');
    } finally {
      setLoading(false);
    }
  };

  // Função para resetar a senha via API de desenvolvimento
  const handleResetDevPassword = async () => {
    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await apiService.auth.resetPassword(email, password);

      if (error) {
        setError(error);
      } else {
        setSuccess(true);
        // Tenta fazer login com as novas credenciais
        await handleSubmit(new Event('submit') as any);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao resetar senha');
    } finally {
      setLoading(false);
    }
  };

  // Função para login direto via API de desenvolvimento
  const handleDevLogin = async () => {
    if (!email) {
      setError('Por favor, insira seu email');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await apiService.auth.devLogin(email);

      if (error) {
        setError(error);
      } else {
        setSuccess(true);
        console.log('Login realizado com sucesso:', data);
        
        // Atualizar o usuário usando o token recebido
        if (data?.token) {
          updateUserFromToken(data.token);
        }
        
        // Redirecionar para a página inicial após o login
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao gerar token de login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-center min-h-screen">
      <div className="card">
        <h2 className="h2 text-center">
          Sistema de Monitoramento
        </h2>
        <p className="p text-center">
          Faça login na sua conta
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className={classes.formGroup}>
            <label className={classes.formLabel}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={classes.formInput}
            />
          </div>

          <div className={classes.formGroup}>
            <label className={classes.formLabel}>Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={classes.formInput}
            />
            <a
              href="#"
              className="link text-center"
            >
              Esqueceu a senha?
            </a>
          </div>

          {error && (
            <div className="alert alert-error">
              <div className="flex">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            </div>
          )}

          {success && !magicLinkSent && (
            <div className="bg-green-50 p-4 rounded-md">
              <div className="flex">
                <div className="text-sm text-green-700">Login realizado com sucesso!</div>
              </div>
            </div>
          )}

          {magicLinkSent && (
            <div className="bg-green-50 p-4 rounded-md">
              <div className="flex">
                <div className="text-sm text-green-700">
                  Link de acesso enviado para seu email. Por favor, verifique sua caixa de entrada e clique no link para fazer login.
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col space-y-3">
            <button
              type="submit"
              className="btn w-full"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar com senha"}
            </button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">ou</span>
              </div>
            </div>
            
            <button
              type="button"
              onClick={handleMagicLink}
              disabled={loading}
              className="flex w-full justify-center rounded-md bg-white px-3 py-1.5 text-sm font-semibold leading-6 text-indigo-600 shadow-sm border border-indigo-300 hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70"
            >
              {loading ? "Enviando..." : "Entrar com link mágico"}
            </button>

            {/* Botão para mostrar/ocultar opções de desenvolvimento */}
            <button 
              type="button" 
              onClick={() => setDevMode(!devMode)} 
              className="text-xs text-gray-500 mt-2 hover:text-gray-700">
              {devMode ? "Ocultar opções de desenvolvimento" : "Opções de desenvolvimento"}
            </button>

            {/* Opções de desenvolvimento */}
            {devMode && (
              <div className="mt-4 p-3 border border-yellow-300 bg-yellow-50 rounded-md">
                <p className="text-xs text-yellow-800 mb-3">Ferramentas de desenvolvimento. Somente use em ambiente de teste.</p>
                <div className="flex flex-col gap-4">
                  <button
                    type="button"
                    onClick={handleResetDevPassword}
                    disabled={loading}
                    className="flex w-full justify-center rounded-md bg-amber-600 px-3 py-1.5 text-xs font-semibold leading-6 text-white shadow-sm hover:bg-amber-500"
                  >
                    Resetar senha no Supabase
                  </button>
                  <button
                    type="button"
                    onClick={handleDevLogin}
                    disabled={loading}
                    className="flex w-full justify-center rounded-md bg-amber-600 px-3 py-1.5 text-xs font-semibold leading-6 text-white shadow-sm hover:bg-amber-500"
                  >
                    Gerar token direto
                  </button>
                </div>
              </div>
            )}
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Não tem uma conta?{' '}
          <a href="/register" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
            Cadastre-se como estudante
          </a>
        </p>
      </div>
    </div>
  );
};
