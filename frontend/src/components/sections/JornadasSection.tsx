import React from 'react';

const JornadasSection: React.FC = () => {
  return (
    <section id="jornadas" className="section-container bg-purple-50">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-12">JORNADAS</h2>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Group Links */}
          <div className="flex flex-col items-center space-y-4 mb-8">
            <a 
              href="#grupo-a" 
              className="block w-48 py-3 px-6 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
            >
              Grupo A
            </a>
            <a 
              href="#grupo-b" 
              className="block w-48 py-3 px-6 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
            >
              Grupo B
            </a>
            <a 
              href="#grupo-c" 
              className="block w-48 py-3 px-6 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
            >
              Grupo C
            </a>
          </div>
          
          {/* Description Paragraph */}
          <div className="text-left">
            <p className="text-gray-700 leading-relaxed">
              Cada jornada dura una semana.<br/>
              Durante esa semana escribid a<br/>
              vuestrxs oponentes y elegir el día<br/>
              que mejor os venga a ambxs. Si por<br/>
              algún motivo no podéis completar<br/>
              vuestrx partido de la jornada,<br/>
              siempre se puede posponer, pero<br/>
              mantener en mente la fecha final<br/>
              de la liga. Es importante que todos<br/>
              los partidos se hayan jugado en esa<br/>
              fecha.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JornadasSection;
