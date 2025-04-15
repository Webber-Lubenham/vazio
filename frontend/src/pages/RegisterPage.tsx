import React from 'react';
import RegisterForm from '../components/RegisterForm';

const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Sistema de Monitoramento</h1>
        <p className="text-gray-600 mt-2">Cadastro de novo estudante</p>
      </div>
      
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
