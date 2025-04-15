import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export const HomePage = () => {
  const { user, signOut, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Sistema de Monitoramento</h1>
          <button
            onClick={() => signOut()}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
          >
            Sair
          </button>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-2">Informações do usuário</h2>
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Nome:</strong> {user.user_metadata?.full_name || 'Não informado'}</p>
          <p><strong>Tipo de Usuário:</strong> {user.user_metadata?.user_type || 'Não informado'}</p>
          <p><strong>Email verificado:</strong> {user.email_confirmed_at ? 'Sim' : 'Não'}</p>
        </div>

        <div className="border-t pt-4">
          <p className="text-gray-600 text-sm">
            Última atualização: {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};
