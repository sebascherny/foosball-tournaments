import React from 'react';

const InicioSection: React.FC = () => {
  return (
    <section id="inicio" className="section-container bg-gradient-to-br from-blue-600 to-purple-700 text-white">
      <div className="w-full h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 animate-fade-in">
            FOOSBALL
          </h1>
          <h2 className="text-3xl md:text-5xl font-light mb-8 animate-fade-in-delay">
            TOURNAMENTS
          </h2>
          <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto">
            Bienvenido al sistema de torneos de futbolín más emocionante
          </p>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InicioSection;
