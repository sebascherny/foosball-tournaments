import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';
import InicioSection from './sections/InicioSection';
import ReglamentoSection from './sections/ReglamentoSection';
import FuncionamientoSection from './sections/FuncionamientoSection';
import ParticipantesSection from './sections/ParticipantesSection';
import ClasificacionSection from './sections/ClasificacionSection';
import GallerySection from './sections/GallerySection';

const Home: React.FC = () => {
  const [activeSection, setActiveSection] = useState('inicio');
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [team, setTeam] = useState<any>(null);

  useEffect(() => {
    // Check for existing authentication on app load
    const savedToken = localStorage.getItem('authToken');
    const savedTeam = localStorage.getItem('team');
    
    if (savedToken && savedTeam) {
      setAuthToken(savedToken);
      setTeam(JSON.parse(savedTeam));
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['inicio', 'reglamento', 'funcionamiento', 'participantes', 'clasificacion-a', 'clasificacion-b', 'clasificacion-c', 'gallery'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAuthSuccess = (token: string, teamData: any) => {
    setAuthToken(token);
    setTeam(teamData);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('team');
    setAuthToken(null);
    setTeam(null);
  };

  return (
    <div className="App">
      <Navigation 
        activeSection={activeSection}
        authToken={authToken}
        team={team}
        onAuthSuccess={handleAuthSuccess}
        onLogout={handleLogout}
      />
      <main>
        <InicioSection />
        <ReglamentoSection />
        <FuncionamientoSection />
        <ParticipantesSection />
        <ClasificacionSection group="A" />
        <ClasificacionSection group="B" />
        <ClasificacionSection group="C" />
        <GallerySection />
      </main>
    </div>
  );
};

export default Home;
