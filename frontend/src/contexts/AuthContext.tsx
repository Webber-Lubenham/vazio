import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js'; // Mantemos os tipos do Supabase
import { apiService } from '../services/api.service';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    data: any;
  }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{
    error: Error | null;
    data: any;
  }>;
  // Adicionamos um método para atualizar o usuário a partir do token JWT
  updateUserFromToken: (token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carrega a sessão inicial do localStorage (token JWT)
    const getInitialSession = async () => {
      setLoading(true);
      
      // Verificar se existe um token JWT salvo
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          // Decodificar o token JWT para obter as informações do usuário
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const payload = JSON.parse(window.atob(base64));
          
          // Criar um objeto de usuário compatível com a interface User do Supabase
          const mockUser = {
            id: payload.sub || payload.user_id,
            email: payload.email,
            user_metadata: payload.user_metadata || {},
            app_metadata: payload.app_metadata || {},
            created_at: payload.created_at || new Date().toISOString(),
            updated_at: payload.updated_at || new Date().toISOString(),
            aud: 'authenticated',
            role: 'authenticated'
          } as unknown as User;
          
          // Criar uma sessão simulada com o token
          const mockSession = {
            access_token: token,
            refresh_token: '',
            expires_in: payload.exp ? (payload.exp - Math.floor(Date.now() / 1000)) : 3600,
            // expires_at precisa ser number para Session
            expires_at: payload.exp ? payload.exp : Math.floor(Date.now() / 1000) + 3600,
            token_type: 'bearer',
            user: mockUser
          } as unknown as Session;
          
          setSession(mockSession);
          setUser(mockUser);
        } catch (error) {
          console.error('Erro ao decodificar token JWT:', error);
          // Limpar o token inválido
          localStorage.removeItem('auth_token');
        }
      }
      
      setLoading(false);
    };
    
    getInitialSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await apiService.auth.login(email, password);
      
      if (error) throw new Error(error);
      
      if (data?.token) {
        // Atualizar o estado com as informações do token
        updateUserFromToken(data.token);
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('Error signing in:', error);
      return { data: null, error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      // Chamar o endpoint de logout se existir
      await apiService.auth.logout();
      
      // Limpar o token e o estado local
      localStorage.removeItem('auth_token');
      setSession(null);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      // Implementar recuperação de senha quando necessário
      // Por enquanto, apenas retornamos uma mensagem com o email fornecido
      console.log(`Solicitada recuperação de senha para: ${email}`);
      return { 
        data: { message: `Recuperação de senha solicitada para ${email}. Este recurso será implementado em produção.` }, 
        error: null 
      };
    } catch (error) {
      console.error('Error resetting password:', error);
      return { data: null, error: error as Error };
    }
  };
  
  // Método para processar o token JWT e atualizar o estado
  const updateUserFromToken = (token: string) => {
    try {
      // Salvar o token no localStorage
      localStorage.setItem('auth_token', token);
      
      // Decodificar o token JWT para obter as informações do usuário
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));
      
      // Criar um objeto de usuário compatível com a interface User do Supabase
      const mockUser = {
        id: payload.sub || payload.user_id,
        email: payload.email,
        user_metadata: payload.user_metadata || {},
        app_metadata: payload.app_metadata || {},
        created_at: payload.created_at || new Date().toISOString(),
        updated_at: payload.updated_at || new Date().toISOString(),
        aud: 'authenticated',
        role: 'authenticated'
      } as unknown as User;
      
      // Criar uma sessão simulada com o token
      const mockSession = {
        access_token: token,
        refresh_token: '',
        expires_in: payload.exp ? (payload.exp - Math.floor(Date.now() / 1000)) : 3600,
        // expires_at precisa ser number para Session
        expires_at: payload.exp ? payload.exp : Math.floor(Date.now() / 1000) + 3600,
        token_type: 'bearer',
        user: mockUser
      } as unknown as Session;
      
      setSession(mockSession);
      setUser(mockUser);
    } catch (error) {
      console.error('Erro ao processar token JWT:', error);
    }
  };

  const value: AuthContextType = {
    session,
    user,
    loading,
    signIn,
    signOut,
    resetPassword,
    updateUserFromToken
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
