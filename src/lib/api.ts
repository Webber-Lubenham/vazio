// API Helpers para interação com o backend
const API_URL = 'http://localhost:3002/api';

export const devApi = {
  // Função para resetar a senha de um usuário (somente ambiente de desenvolvimento)
  resetPassword: async (email: string, newPassword: string) => {
    try {
      const response = await fetch(`${API_URL}/dev/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, newPassword }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao resetar senha');
      }
      
      return { data, error: null };
    } catch (error: any) {
      console.error('Erro na API:', error);
      return { data: null, error: error.message };
    }
  },
  
  // Função para gerar token de acesso direto (somente ambiente de desenvolvimento)
  devLogin: async (email: string) => {
    try {
      const response = await fetch(`${API_URL}/dev/dev-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao gerar token de login');
      }
      
      return { data, error: null };
    } catch (error: any) {
      console.error('Erro na API:', error);
      return { data: null, error: error.message };
    }
  },
};
