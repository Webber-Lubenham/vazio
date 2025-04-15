// Configurações de API para o projeto
export const API_CONFIG = {
  // URL base da API
  BASE_URL: 'http://localhost:3003/api',
  
  // Rotas de autenticação
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token',
    DEV_LOGIN: '/dev/jwt-login',
    RESET_PASSWORD: '/dev/reset-password'
  },
  
  // Rotas de usuários
  USERS: {
    GET_ALL: '/users',
    GET_BY_ID: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`
  },
  
  // Rotas de localização
  LOCATIONS: {
    GET_ALL: '/locations',
    GET_BY_ID: (id: string) => `/locations/${id}`,
    CREATE: '/locations',
    UPDATE: (id: string) => `/locations/${id}`,
    DELETE: (id: string) => `/locations/${id}`
  }
};
