import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Team {
  id: number;
  name: string;
  group: string;
}

interface Match {
  id: number;
  team1_name: string;
  team2_name: string;
  team1_goals: number;
  team2_goals: number;
  created_at: string;
}

interface MatchLoadModalProps {
  isOpen: boolean;
  onClose: () => void;
  authToken: string;
}

const MatchLoadModal: React.FC<MatchLoadModalProps> = ({ isOpen, onClose, authToken }) => {
  const [opponentTeams, setOpponentTeams] = useState<Team[]>([]);
  const [selectedOpponent, setSelectedOpponent] = useState<number | null>(null);
  const [userGoals, setUserGoals] = useState<number>(0);
  const [opponentGoals, setOpponentGoals] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [recentMatches, setRecentMatches] = useState<Match[]>([]);

  useEffect(() => {
    if (isOpen && authToken) {
      fetchOpponentTeams();
      fetchRecentMatches();
    }
  }, [isOpen, authToken]);

  const fetchOpponentTeams = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/auth/opponents/', {
        headers: { Authorization: `Token ${authToken}` }
      });
      setOpponentTeams(response.data.teams);
    } catch (error: any) {
      setError('Error loading opponent teams');
    }
  };

  const fetchRecentMatches = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/auth/my-matches/', {
        headers: { Authorization: `Token ${authToken}` }
      });
      setRecentMatches(response.data.matches.slice(0, 5)); // Show last 5 matches
    } catch (error: any) {
      console.error('Error loading recent matches:', error);
    }
  };

  const handleSubmitMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!selectedOpponent) {
      setError('Please select an opponent team');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8000/api/auth/load-match/',
        {
          opponent_team_id: selectedOpponent,
          user_goals: userGoals,
          opponent_goals: opponentGoals
        },
        {
          headers: { Authorization: `Token ${authToken}` }
        }
      );

      setSuccess('Match result loaded successfully!');
      
      // Reset form
      setSelectedOpponent(null);
      setUserGoals(0);
      setOpponentGoals(0);
      
      // Refresh recent matches
      fetchRecentMatches();
      
      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
        setSuccess('');
      }, 2000);

    } catch (error: any) {
      setError(error.response?.data?.error || 'Error loading match result');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Cargar Resultado</h2>
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

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmitMatch} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Equipo Oponente
            </label>
            <select
              value={selectedOpponent || ''}
              onChange={(e) => setSelectedOpponent(Number(e.target.value) || null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            >
              <option value="">Seleccionar equipo...</option>
              {opponentTeams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name} (Grupo {team.group})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Goles de tu equipo
              </label>
              <input
                type="number"
                min="0"
                max="20"
                value={userGoals}
                onChange={(e) => setUserGoals(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Goles del oponente
              </label>
              <input
                type="number"
                min="0"
                max="20"
                value={opponentGoals}
                onChange={(e) => setOpponentGoals(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? 'Cargando...' : 'Cargar Resultado'}
          </button>
        </form>

        {recentMatches.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-700 mb-3">Últimos Partidos</h3>
            <div className="space-y-2">
              {recentMatches.map((match) => (
                <div key={match.id} className="bg-gray-50 p-3 rounded-md text-sm">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">
                      {match.team1_name} vs {match.team2_name}
                    </span>
                    <span className="text-primary-600 font-bold">
                      {match.team1_goals} - {match.team2_goals}
                    </span>
                  </div>
                  <div className="text-gray-500 text-xs mt-1">
                    {new Date(match.created_at).toLocaleDateString('es-ES')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchLoadModal;
