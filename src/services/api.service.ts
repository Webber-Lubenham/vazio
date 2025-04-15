import { API_CONFIG } from '../config/api.config';

// Tipos para as respostas da API
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

// Tipos para autenticação
export interface AuthResponse {
  token: string;
  user: any;
  message: string;
}

// Serviço para interagir com a API
export const apiService = {
  // Métodos de autenticação
  auth: {
    // Registro de novo estudante
    register: async (userData: {
      name: string;
      email: string;
      password: string;
      school: string;
      grade: string;
      parentEmail: string;
    }): Promise<ApiResponse<AuthResponse>> => {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.AUTH.REGISTER}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(userData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Erro ao registrar estudante');
        }
        
        // Salvar token no localStorage
        if (data.token) {
          localStorage.setItem('auth_token', data.token);
        }
        
        return { data, error: null };
      } catch (error: any) {
        console.error('Erro de registro:', error);
        return { data: null, error: error.message };
      }
    },
    // Login normal com email/senha
    login: async (email: string, password: string): Promise<ApiResponse<AuthResponse>> => {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.AUTH.LOGIN}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Erro ao fazer login');
        }
        
        // Salvar token no localStorage
        if (data.token) {
          localStorage.setItem('auth_token', data.token);
        }
        
        return { data, error: null };
      } catch (error: any) {
        console.error('Erro de login:', error);
        return { data: null, error: error.message };
      }
    },
    
    // Login direto para desenvolvimento (bypass de senha)
    devLogin: async (email: string): Promise<ApiResponse<AuthResponse>> => {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.AUTH.DEV_LOGIN}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({ email })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Erro ao fazer login direto');
        }
        
        // Salvar token no localStorage
        if (data.token) {
          localStorage.setItem('auth_token', data.token);
        }
        
        return { data, error: null };
      } catch (error: any) {
        console.error('Erro de login direto:', error);
        return { data: null, error: error.message };
      }
    },
    
    // Reset de senha via API de desenvolvimento
    resetPassword: async (email: string, newPassword: string): Promise<ApiResponse<any>> => {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.AUTH.RESET_PASSWORD}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({ email, newPassword })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Erro ao resetar senha');
        }
        
        return { data, error: null };
      } catch (error: any) {
        console.error('Erro ao resetar senha:', error);
        return { data: null, error: error.message };
      }
    },
    
    // Logout
    logout: async (): Promise<ApiResponse<any>> => {
      try {
        // Remover token do localStorage
        localStorage.removeItem('auth_token');
        
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.AUTH.LOGOUT}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          },
          credentials: 'include'
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Erro ao fazer logout');
        }
        
        return { data, error: null };
      } catch (error: any) {
        console.error('Erro de logout:', error);
        return { data: null, error: error.message };
      }
    }
  },
  
  // Métodos genéricos para requisições HTTP
  request: {
    get: async <T>(url: string): Promise<ApiResponse<T>> => {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${url}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          },
          credentials: 'include'
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Erro na requisição');
        }
        
        return { data, error: null };
      } catch (error: any) {
        console.error(`Erro na requisição GET ${url}:`, error);
        return { data: null, error: error.message };
      }
    },
    
    post: async <T>(url: string, body: any): Promise<ApiResponse<T>> => {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${url}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          },
          credentials: 'include',
          body: JSON.stringify(body)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Erro na requisição');
        }
        
        return { data, error: null };
      } catch (error: any) {
        console.error(`Erro na requisição POST ${url}:`, error);
        return { data: null, error: error.message };
      }
    },
    
    put: async <T>(url: string, body: any): Promise<ApiResponse<T>> => {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${url}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          },
          credentials: 'include',
          body: JSON.stringify(body)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Erro na requisição');
        }
        
        return { data, error: null };
      } catch (error: any) {
        console.error(`Erro na requisição PUT ${url}:`, error);
        return { data: null, error: error.message };
      }
    },
    
    delete: async <T>(url: string): Promise<ApiResponse<T>> => {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${url}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          },
          credentials: 'include'
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Erro na requisição');
        }
        
        return { data, error: null };
      } catch (error: any) {
        console.error(`Erro na requisição DELETE ${url}:`, error);
        return { data: null, error: error.message };
      }
    }
  }
};
