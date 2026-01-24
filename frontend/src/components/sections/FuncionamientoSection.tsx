import React from 'react';

const FuncionamientoSection: React.FC = () => {
  return (
    <section id="funcionamiento" className="section-container bg-blue-50">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-8">FUNCIONAMIENTO</h2>
        <div className="bg-white rounded-lg shadow-lg p-8 text-left">
          <div className="prose prose-lg max-w-none">
            <h3 className="text-2xl font-semibold text-primary-600 mb-4">¿Cómo Funciona el Torneo?</h3>
            <p className="text-gray-700 mb-6">
              El torneo está diseñado para ser justo, emocionante y accesible para todos los niveles de juego.
            </p>
            
            <h4 className="text-xl font-semibold text-gray-800 mb-3">Fase de Grupos</h4>
            <p className="text-gray-700 mb-4">
              Los equipos se dividen en grupos de 4. Cada equipo juega contra todos los demás en su grupo.
              Los dos mejores equipos de cada grupo avanzan a la fase eliminatoria.
            </p>
            
            <h4 className="text-xl font-semibold text-gray-800 mb-3">Fase Eliminatoria</h4>
            <p className="text-gray-700 mb-4">
              Cuartos de final, semifinales y final. Todos los partidos son eliminatorios directos.
              En caso de empate, se juega un set adicional de desempate.
            </p>
            
            <h4 className="text-xl font-semibold text-gray-800 mb-3">Sistema de Puntuación</h4>
            <p className="text-gray-700 mb-4">
              Victoria: 3 puntos | Empate: 1 punto | Derrota: 0 puntos
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FuncionamientoSection;
