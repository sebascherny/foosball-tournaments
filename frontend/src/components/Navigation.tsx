import React, { useState } from 'react';
import AuthModal from './AuthModal';
import MatchLoadModal from './MatchLoadModal';
import TournamentAssignModal from './TournamentAssignModal';
import { getApiUrl } from '../utils/api';

interface NavigationProps {
  activeSection: string;
  authToken: string | null;
  team: any;
  onAuthSuccess: (token: string, team: any) => void;
  onLogout: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ 
  activeSection, 
  authToken, 
  team, 
  onAuthSuccess, 
  onLogout 
}) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [showTournamentModal, setShowTournamentModal] = useState(false);

  const sections = [
    { id: 'inicio', label: 'INICIO' },
    { id: 'reglamento', label: 'REGLAMENTO' },
    { id: 'funcionamiento', label: 'FUNCIONAMIENTO' },
    { id: 'participantes', label: 'PARTICIPANTES' },
    { id: 'clasificacion-a', label: 'CLASIFICACIÓN' },
    { id: 'gallery', label: 'GALERÍA' },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  console.log(team);
  console.log(team?.tournament);

  const handleLogout = () => {
    if (authToken) {
      // Call logout API
      fetch(getApiUrl('/api/auth/logout/'), {
        method: 'POST',
        headers: {
          'Authorization': `Token ${authToken}`,
          'Content-Type': 'application/json',
        },
      }).finally(() => {
        onLogout();
      });
    }
  };

  const handleTournamentAssignSuccess = (updatedTeam: any) => {
    // Update the team data with the new tournament assignment
    onAuthSuccess(authToken!, updatedTeam);
    setShowTournamentModal(false);
  };

  return (
    <>
      <nav className="sticky-nav">
        <div className="flex justify-between items-center">
          <div className="flex justify-center flex-1">
            {sections.map((section) => (
              <div
                key={section.id}
                className={`nav-item ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => scrollToSection(section.id)}
              >
                {section.label}
              </div>
            ))}
          </div>
          
          <div className="flex items-center space-x-4 ml-4">
            {authToken && team ? (
              <>
                {team.tournament ? (
                  <button
                    onClick={() => setShowMatchModal(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm font-medium"
                  >
                    CARGAR PARTIDO
                  </button>
                ) : (
                  <button
                    onClick={() => setShowTournamentModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium"
                  >
                    ASSIGN TO TOURNAMENT
                  </button>
                )}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">
                    {team.name}
                    {team.tournament && (
                      <span className="text-xs text-gray-500 block">
                        {team.tournament_name}
                      </span>
                    )}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-gray-500 hover:text-gray-700 underline"
                  >
                    Salir
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 text-sm font-medium"
              >
                INICIAR SESIÓN
              </button>
            )}
          </div>
        </div>
      </nav>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={onAuthSuccess}
      />

      {authToken && (
        <MatchLoadModal
          isOpen={showMatchModal}
          onClose={() => setShowMatchModal(false)}
          authToken={authToken}
        />
      )}

      {authToken && (
        <TournamentAssignModal
          isOpen={showTournamentModal}
          onClose={() => setShowTournamentModal(false)}
          authToken={authToken}
          onAssignSuccess={handleTournamentAssignSuccess}
        />
      )}
    </>
  );
};

export default Navigation;
