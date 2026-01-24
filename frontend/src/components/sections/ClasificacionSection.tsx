import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getApiUrl } from '../../utils/api';

interface Classification {
  id: number;
  team_name: string;
  points: number;
  games_played: number;
  games_won: number;
  games_lost: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
  position: number;
}

interface ClasificacionSectionProps {
  group: string;
}

const ClasificacionSection: React.FC<ClasificacionSectionProps> = ({ group }) => {
  const [classifications, setClassifications] = useState<Classification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClassifications = async () => {
      try {
        const response = await axios.get(getApiUrl(`/api/classifications/?group=${group}`));
        setClassifications(response.data);
      } catch (error) {
        console.error('Error fetching classifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClassifications();
  }, [group]);

  return (
    <section id={`clasificacion-${group.toLowerCase()}`} className="section-container bg-yellow-50 py-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">CLASIFICACIÓN - GRUPO {group}</h2>
        
        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando clasificación...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-primary-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Pos</th>
                    <th className="px-6 py-4 text-left font-semibold">Equipo</th>
                    <th className="px-6 py-4 text-center font-semibold">PJ</th>
                    <th className="px-6 py-4 text-center font-semibold">PG</th>
                    <th className="px-6 py-4 text-center font-semibold">PP</th>
                    <th className="px-6 py-4 text-center font-semibold">GF</th>
                    <th className="px-6 py-4 text-center font-semibold">GC</th>
                    <th className="px-6 py-4 text-center font-semibold">DG</th>
                    <th className="px-6 py-4 text-center font-semibold">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {classifications.length > 0 ? (
                    classifications.map((team, index) => (
                      <tr 
                        key={team.id} 
                        className={`border-b border-gray-200 hover:bg-gray-50 ${
                          index < 3 ? 'bg-green-50' : index >= classifications.length - 3 ? 'bg-red-50' : ''
                        }`}
                      >
                        <td className="px-6 py-4 font-bold text-gray-800">{index + 1}</td>
                        <td className="px-6 py-4 font-semibold text-gray-800">{team.team_name}</td>
                        <td className="px-6 py-4 text-center text-gray-600">{team.games_played}</td>
                        <td className="px-6 py-4 text-center text-green-600 font-semibold">{team.games_won}</td>
                        <td className="px-6 py-4 text-center text-red-600 font-semibold">{team.games_lost}</td>
                        <td className="px-6 py-4 text-center text-gray-600">{team.goals_for}</td>
                        <td className="px-6 py-4 text-center text-gray-600">{team.goals_against}</td>
                        <td className={`px-6 py-4 text-center font-semibold ${
                          team.goal_difference > 0 ? 'text-green-600' : 
                          team.goal_difference < 0 ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {team.goal_difference > 0 ? '+' : ''}{team.goal_difference}
                        </td>
                        <td className="px-6 py-4 text-center font-bold text-primary-600 text-lg">{team.points}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                        No hay datos de clasificación disponibles
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ClasificacionSection;
