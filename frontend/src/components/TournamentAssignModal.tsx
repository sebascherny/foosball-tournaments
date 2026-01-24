import React, { useState, useEffect } from 'react';

interface Tournament {
  id: number;
  name: string;
  start_date: string;
  estimated_end_date: string;
  teams_count: number;
}

interface TournamentAssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  authToken: string;
  onAssignSuccess: (updatedTeam: any) => void;
}

const TournamentAssignModal: React.FC<TournamentAssignModalProps> = ({
  isOpen,
  onClose,
  authToken,
  onAssignSuccess
}) => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchTournaments();
    }
  }, [isOpen]);

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/auth/tournaments/', {
        headers: {
          'Authorization': `Token ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTournaments(data.tournaments);
      } else {
        setError('Failed to fetch tournaments');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignToTournament = async () => {
    if (!selectedTournament) {
      setError('Please select a tournament');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:8000/api/auth/assign-tournament/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tournament_id: selectedTournament,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onAssignSuccess(data.team);
        onClose();
      } else {
        setError(data.error || 'Failed to assign to tournament');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 max-w-md mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Assign to Tournament</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Tournament
              </label>
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-600">Loading tournaments...</p>
                </div>
              ) : (
                <select
                  value={selectedTournament || ''}
                  onChange={(e) => setSelectedTournament(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a tournament...</option>
                  {tournaments.map((tournament) => (
                    <option key={tournament.id} value={tournament.id}>
                      {tournament.name} ({tournament.teams_count} teams)
                    </option>
                  ))}
                </select>
              )}
            </div>

            {selectedTournament && (
              <div className="bg-blue-50 p-3 rounded-md">
                <p className="text-sm text-blue-800">
                  <strong>Selected Tournament:</strong>{' '}
                  {tournaments.find(t => t.id === selectedTournament)?.name}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Start: {tournaments.find(t => t.id === selectedTournament)?.start_date} | 
                  End: {tournaments.find(t => t.id === selectedTournament)?.estimated_end_date}
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAssignToTournament}
              disabled={loading || !selectedTournament}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Assigning...' : 'Assign to Tournament'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentAssignModal;
