import React, { useState } from 'react';
import axios from 'axios';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (token: string, team: any) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Login form state
  const [loginData, setLoginData] = useState({
    team_name: '',
    password: ''
  });
  
  // Registration form state
  const [registerData, setRegisterData] = useState({
    team_name: '',
    password: '',
    confirmPassword: '',
    participants: [
      { name: '', phone_number: '' },
      { name: '', phone_number: '' }
    ]
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8000/api/auth/login/', loginData);
      const { token, team } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('team', JSON.stringify(team));
      
      onAuthSuccess(token, team);
      onClose();
    } catch (error: any) {
      setError(error.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!registerData.participants[0].name || !registerData.participants[1].name) {
      setError('Both participant names are required');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/auth/register/', {
        team_name: registerData.team_name,
        password: registerData.password,
        participants: registerData.participants
      });
      
      const { token, team } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('team', JSON.stringify(team));
      
      onAuthSuccess(token, team);
      onClose();
    } catch (error: any) {
      setError(error.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const updateParticipant = (index: number, field: string, value: string) => {
    const newParticipants = [...registerData.participants];
    newParticipants[index] = { ...newParticipants[index], [field]: value };
    setRegisterData({ ...registerData, participants: newParticipants });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {isLogin ? 'Iniciar Sesión' : 'Registrar Equipo'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="flex mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 px-4 rounded-l-lg ${
              isLogin
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 px-4 rounded-r-lg ${
              !isLogin
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Registrarse
          </button>
        </div>

        {isLogin ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Equipo
              </label>
              <input
                type="text"
                required
                value={loginData.team_name}
                onChange={(e) => setLoginData({ ...loginData, team_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                required
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Equipo
              </label>
              <input
                type="text"
                required
                value={registerData.team_name}
                onChange={(e) => setRegisterData({ ...registerData, team_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  required
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Contraseña
                </label>
                <input
                  type="password"
                  required
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-medium text-gray-700">Participantes</h3>
              {registerData.participants.map((participant, index) => (
                <div key={index} className="border border-gray-200 rounded-md p-3">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">
                    Participante {index + 1}
                  </h4>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Nombre completo"
                      required
                      value={participant.name}
                      onChange={(e) => updateParticipant(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <input
                      type="tel"
                      placeholder="Número de teléfono (opcional)"
                      value={participant.phone_number}
                      onChange={(e) => updateParticipant(index, 'phone_number', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? 'Registrando...' : 'Registrar Equipo'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
