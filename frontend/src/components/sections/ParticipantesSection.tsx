import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getApiUrl } from '../../utils/api';

interface Team {
  id: number;
  name: string;
  group: string;
  phone_number: string | null;
  created_at: string;
}

const ParticipantesSection: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get(getApiUrl('/api/teams/'));
        setTeams(response.data);
      } catch (error) {
        console.error('Error fetching teams:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  // Group teams by their group field (A, B, C)
  const groupedTeams = teams.reduce((acc: { [key: string]: Team[] }, team) => {
    const group = team.group || 'A';
    if (!acc[group]) acc[group] = [];
    acc[group].push(team);
    return acc;
  }, {});

  const groups = ['A', 'B', 'C'];

  return (
    <section id="participantes" className="section-container bg-green-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-800 mb-12 text-center">EQUIPOS</h2>
        
        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando equipos...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {groups.map((groupLetter) => (
              <div key={groupLetter} className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-2xl font-semibold text-primary-600 mb-6 text-center">
                  Grupo {groupLetter}
                </h3>
                <div className="space-y-3">
                  {Array.from({ length: 4 }, (_, rowIndex) => {
                    const team = groupedTeams[groupLetter]?.[rowIndex];
                    return (
                      <button
                        key={rowIndex}
                        className={`w-full p-4 rounded-lg text-left transition-colors ${
                          team
                            ? 'bg-primary-100 hover:bg-primary-200 text-primary-800 border-2 border-primary-300'
                            : 'bg-gray-100 text-gray-400 border-2 border-gray-200 cursor-not-allowed'
                        }`}
                        disabled={!team}
                      >
                        {team ? (
                          <div>
                            {
                              team.phone_number ?
                              <a className="font-semibold" href={`https://wa.me/${team.phone_number?.replace(' ', '').replace(' ', '').replace(' ', '').replace('+', '')}`}>{team.name}</a>
                              : <span className="font-semibold">{team.name}</span>
                            }
                          </div>
                        ) : (
                          <div className="font-medium">Disponible</div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ParticipantesSection;
