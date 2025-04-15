import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api.service';

export const RegisterForm: React.FC = () => {
  const { updateUserFromToken } = useAuth();
  
  // Estados para os campos do formulário
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [school, setSchool] = useState('');
  const [grade, setGrade] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  
  // Estados para feedback ao usuário
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Lista de séries disponíveis para seleção
  const gradeOptions = [
    '1º ano - Ensino Fundamental',
    '2º ano - Ensino Fundamental',
    '3º ano - Ensino Fundamental',
    '4º ano - Ensino Fundamental',
    '5º ano - Ensino Fundamental',
    '6º ano - Ensino Fundamental',
    '7º ano - Ensino Fundamental',
    '8º ano - Ensino Fundamental',
    '9º ano - Ensino Fundamental',
    '1º ano - Ensino Médio',
    '2º ano - Ensino Médio',
    '3º ano - Ensino Médio'
  ];

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Limpar mensagens anteriores
    setError(null);
    
    // Validações básicas
    if (!name || !email || !password || !confirmPassword || !school || !grade) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    
    setLoading(true);
    
    try {
      // Chamar o serviço de API para registrar o estudante
      const { data, error } = await apiService.auth.register({
        name,
        email,
        password,
        school,
        grade,
        parentEmail
      });
      
      if (error) {
        throw new Error(error);
      }
      
      if (data?.token) {
        // Atualizar o estado global de autenticação
        updateUserFromToken(data.token);
        setSuccess(true);
        
        // Redirecionar para a página inicial após 2 segundos
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao registrar o estudante.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-form-container">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Cadastro de Estudante</h2>
        
        {success ? (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            <p>Cadastro realizado com sucesso! Redirecionando...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <p>{error}</p>
              </div>
            )}
            
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                Nome completo *
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                Senha *
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                minLength={6}
                required
              />
              <p className="text-xs text-gray-500 mt-1">Mínimo de 6 caracteres</p>
            </div>
            
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
                Confirmar senha *
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="school" className="block text-gray-700 text-sm font-bold mb-2">
                Escola *
              </label>
              <input
                type="text"
                id="school"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="grade" className="block text-gray-700 text-sm font-bold mb-2">
                Série/Ano *
              </label>
              <select
                id="grade"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecione uma série</option>
                {gradeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-6">
              <label htmlFor="parentEmail" className="block text-gray-700 text-sm font-bold mb-2">
                Email do responsável
              </label>
              <input
                type="email"
                id="parentEmail"
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Opcional</p>
            </div>
            
            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Cadastrando...' : 'Cadastrar'}
              </button>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Já tem uma conta?{' '}
                <a href="/login" className="text-blue-500 hover:text-blue-600">
                  Faça login
                </a>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegisterForm;
