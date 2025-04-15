import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api.service';

export const RegisterForm = () => {
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
    <div className="flex-center min-h-screen">
      <div className="card">
        <h2 className="h2 text-center">Cadastro de Estudante</h2>
        
        {success ? (
          <div className="alert alert-success">
            <p>Cadastro realizado com sucesso! Redirecionando...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="alert alert-error">
                <p>{error}</p>
              </div>
            )}
            
            <div className="mb-4">
              <div className={classes.formGroup}>
                <label className={classes.formLabel}>Nome completo *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={classes.formInput}
                />
              </div>
            </div>
            
            <div className="mb-4">
              <div className={classes.formGroup}>
                <label className={classes.formLabel}>Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={classes.formInput}
                />
              </div>
            </div>
            
            <div className="mb-4">
              <div className={classes.formGroup}>
                <label className={classes.formLabel}>Senha *</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={classes.formInput}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Mínimo de 6 caracteres</p>
            </div>
            
            <div className="mb-4">
              <div className={classes.formGroup}>
                <label className={classes.formLabel}>Confirmar senha *</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={classes.formInput}
                />
              </div>
            </div>
            
            <div className="mb-4">
              <div className={classes.formGroup}>
                <label className={classes.formLabel}>Escola *</label>
                <input
                  type="text"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  className={classes.formInput}
                />
              </div>
            </div>
            
            <div className="mb-4">
              <div className={classes.formGroup}>
                <label className={classes.formLabel}>Série/Ano *</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className={classes.formInput}
                >
                  <option value="">Selecione uma série</option>
                  {gradeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mb-6">
              <div className={classes.formGroup}>
                <label className={classes.formLabel}>Email do responsável</label>
                <input
                  type="email"
                  value={parentEmail}
                  onChange={(e) => setParentEmail(e.target.value)}
                  className={classes.formInput}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Opcional</p>
            </div>
            
            <div className="flex flex-col gap-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <>
                    <span className="loading"></span>
                    Cadastrando...
                  </>
                ) : "Cadastrar"}
              </button>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Já tem uma conta?{' '}
                <button
                  type="submit"
                  className="btn w-full"
                  disabled={loading}
                >
                  Faça login
                </button>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegisterForm;
