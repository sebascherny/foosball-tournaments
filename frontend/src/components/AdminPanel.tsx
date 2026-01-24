import React, { useState, useEffect } from 'react';
import { getApiUrl } from '../utils/api';

interface Tournament {
  id: number;
  name: string;
  start_date: string;
  estimated_end_date: string;
  created_at: string;
  teams_count?: number;
  teams_by_group?: { [key: string]: number };
}

interface Team {
  id: number;
  name: string;
  group: string | null;
  phone_number: string | null;
  tournament: number;
  tournament_name: string;
  created_at: string;
}

interface TournamentTeams {
  tournament: Tournament;
  teams_by_group: { [key: string]: Team[] };
  teams_without_group: Team[];
  total_teams: number;
}

const AdminPanel: React.FC = () => {
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<number | null>(null);
  const [tournamentTeams, setTournamentTeams] = useState<TournamentTeams | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Login form state
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: ''
  });

  // Tournament creation form state
  const [tournamentForm, setTournamentForm] = useState({
    name: '',
    start_date: '',
    estimated_end_date: ''
  });

  useEffect(() => {
    // Check for existing admin token
    const savedToken = localStorage.getItem('adminToken');
    if (savedToken) {
      setAdminToken(savedToken);
      fetchTournaments(savedToken);
    } else {
      setShowLoginModal(true);
    }
  }, []);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(getApiUrl('/api/admin/login/'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginForm),
      });

      const data = await response.json();

      if (response.ok) {
        setAdminToken(data.token);
        localStorage.setItem('adminToken', data.token);
        setShowLoginModal(false);
        fetchTournaments(data.token);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setAdminToken(null);
    localStorage.removeItem('adminToken');
    setTournaments([]);
    setSelectedTournament(null);
    setTournamentTeams(null);
    setShowLoginModal(true);
  };

  const fetchTournaments = async (token: string) => {
    try {
      const response = await fetch(getApiUrl('/api/admin/tournaments/'), {
        headers: {
          'Authorization': `Token ${token}`,
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
    }
  };

  const fetchTournamentTeams = async (tournamentId: number) => {
    if (!adminToken) return;

    try {
      setLoading(true);
      const response = await fetch(getApiUrl(`/api/admin/tournaments/${tournamentId}/teams/`), {
        headers: {
          'Authorization': `Token ${adminToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTournamentTeams(data);
      } else {
        setError('Failed to fetch tournament teams');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createTournament = async () => {
    if (!adminToken) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(getApiUrl('/api/admin/tournaments/create/'), {
        method: 'POST',
        headers: {
          'Authorization': `Token ${adminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tournamentForm),
      });

      const data = await response.json();

      if (response.ok) {
        setShowCreateModal(false);
        setTournamentForm({ name: '', start_date: '', estimated_end_date: '' });
        fetchTournaments(adminToken);
      } else {
        setError(data.error || 'Failed to create tournament');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const assignTeamsToGroup = async (teamIds: number[], group: string) => {
    if (!adminToken || !selectedTournament) return;

    try {
      setLoading(true);
      const assignments = teamIds.map(teamId => ({ team_id: teamId, group }));

      const response = await fetch(getApiUrl(`/api/admin/tournaments/${selectedTournament}/assign-groups/`), {
        method: 'POST',
        headers: {
          'Authorization': `Token ${adminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assignments }),
      });

      if (response.ok) {
        fetchTournamentTeams(selectedTournament);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to assign teams');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const assignRandomly = async () => {
    if (!adminToken || !selectedTournament) return;

    try {
      setLoading(true);
      const response = await fetch(getApiUrl(`/api/admin/tournaments/${selectedTournament}/random-groups/`), {
        method: 'POST',
        headers: {
          'Authorization': `Token ${adminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ groups: ['A', 'B', 'C'] }),
      });

      if (response.ok) {
        fetchTournamentTeams(selectedTournament);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to assign teams randomly');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleTournamentSelect = (tournamentId: number) => {
    setSelectedTournament(tournamentId);
    fetchTournamentTeams(tournamentId);
  };

  if (!adminToken) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        {showLoginModal && (
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <a
                href="/"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                ← Back to Tournament
              </a>
              <h1 className="text-2xl font-bold text-gray-900">Tournament Admin Panel</h1>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
            <button
              onClick={() => setError(null)}
              className="float-right text-red-700 hover:text-red-900"
            >
              ×
            </button>
          </div>
        )}

        {/* Section 1: Create Tournament */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Create New Tournament</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
          >
            Create Tournament
          </button>
        </div>

        {/* Section 2: Tournament Management */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Manage Tournament Teams</h2>
          
          {/* Tournament Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Tournament
            </label>
            <select
              value={selectedTournament || ''}
              onChange={(e) => handleTournamentSelect(Number(e.target.value))}
              className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a tournament...</option>
              {tournaments.map((tournament) => (
                <option key={tournament.id} value={tournament.id}>
                  {tournament.name} ({tournament.teams_count || 0} teams)
                </option>
              ))}
            </select>
          </div>

          {/* Teams Display */}
          {tournamentTeams && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Group A */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-3">Group A ({(tournamentTeams.teams_by_group.A || []).length})</h3>
                <div className="space-y-2">
                  {(tournamentTeams.teams_by_group.A || []).map((team) => (
                    <div key={team.id} className="bg-white p-2 rounded border text-sm">
                      {team.name}
                    </div>
                  ))}
                </div>
              </div>

              {/* Group B */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-3">Group B ({(tournamentTeams.teams_by_group.B || []).length})</h3>
                <div className="space-y-2">
                  {(tournamentTeams.teams_by_group.B || []).map((team) => (
                    <div key={team.id} className="bg-white p-2 rounded border text-sm">
                      {team.name}
                    </div>
                  ))}
                </div>
              </div>

              {/* Group C */}
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-yellow-800 mb-3">Group C ({(tournamentTeams.teams_by_group.C || []).length})</h3>
                <div className="space-y-2">
                  {(tournamentTeams.teams_by_group.C || []).map((team) => (
                    <div key={team.id} className="bg-white p-2 rounded border text-sm">
                      {team.name}
                    </div>
                  ))}
                </div>
              </div>

              {/* Unassigned Teams */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3">Unassigned ({tournamentTeams.teams_without_group.length})</h3>
                <div className="space-y-2 mb-4">
                  {tournamentTeams.teams_without_group.map((team) => (
                    <div key={team.id} className="bg-white p-2 rounded border text-sm">
                      {team.name}
                    </div>
                  ))}
                </div>
                
                {/* Assignment Buttons */}
                {tournamentTeams.teams_without_group.length > 0 && (
                  <div className="space-y-2">
                    <button
                      onClick={() => assignTeamsToGroup(
                        tournamentTeams.teams_without_group.map(t => t.id), 
                        'A'
                      )}
                      disabled={loading}
                      className="w-full bg-blue-600 text-white py-1 px-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                    >
                      Assign to Group A
                    </button>
                    <button
                      onClick={() => assignTeamsToGroup(
                        tournamentTeams.teams_without_group.map(t => t.id), 
                        'B'
                      )}
                      disabled={loading}
                      className="w-full bg-green-600 text-white py-1 px-2 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                    >
                      Assign to Group B
                    </button>
                    <button
                      onClick={() => assignTeamsToGroup(
                        tournamentTeams.teams_without_group.map(t => t.id), 
                        'C'
                      )}
                      disabled={loading}
                      className="w-full bg-yellow-600 text-white py-1 px-2 rounded text-sm hover:bg-yellow-700 disabled:opacity-50"
                    >
                      Assign to Group C
                    </button>
                    <button
                      onClick={assignRandomly}
                      disabled={loading}
                      className="w-full bg-purple-600 text-white py-1 px-2 rounded text-sm hover:bg-purple-700 disabled:opacity-50"
                    >
                      Assign Randomly
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading...</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Tournament Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Create New Tournament</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tournament Name
                </label>
                <input
                  type="text"
                  value={tournamentForm.name}
                  onChange={(e) => setTournamentForm({ ...tournamentForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={tournamentForm.start_date}
                  onChange={(e) => setTournamentForm({ ...tournamentForm, start_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated End Date
                </label>
                <input
                  type="date"
                  value={tournamentForm.estimated_end_date}
                  onChange={(e) => setTournamentForm({ ...tournamentForm, estimated_end_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={createTournament}
                disabled={loading || !tournamentForm.name || !tournamentForm.start_date || !tournamentForm.estimated_end_date}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
