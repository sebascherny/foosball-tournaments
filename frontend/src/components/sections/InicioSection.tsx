import React from 'react';

const InicioSection: React.FC = () => {
  return (
    <section id="inicio" className="section-container bg-black text-white">
      <div className="w-full min-h-screen flex items-center justify-center relative overflow-visible py-8">
        <div className="relative z-10 flex items-center justify-center">
          <img 
            src="/images/loukanikos/septima_liga.png" 
            alt="Séptima Liga" 
            className="w-auto h-auto max-w-[80%] max-h-[80vh] object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default InicioSection;
