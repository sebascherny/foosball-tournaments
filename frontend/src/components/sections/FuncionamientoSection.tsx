import React from 'react';

const FuncionamientoSection: React.FC = () => {
  return (
    <section id="funcionamiento" className="section-container bg-blue-50">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex items-center justify-center mb-8">
          <img 
            src="/images/loukanikos/leonhart_logo.png" 
            alt="Leonhart Logo" 
            className="w-24 h-24 mr-4"
          />
          <h2 className="text-4xl font-bold text-gray-800">FUNCIONAMIENTO</h2>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-8 text-left">
          <div className="prose prose-lg max-w-none">
            <p>
              El campeonato consistira de una fase de grupos (3) en forma de liguilla, y un play off en formato de torneo. 
            </p>
            <p>
              Una vez hecho el calendario, tendreis acceso a todos los emparejamientos de todas las jornadas, siendo la primera la de la semana del  29 de
octubre.
            </p>
            <p>
              En el bar hemos dejado un cuaderno donde apuntar los resultados de los partidos. Pedidlo en la barra y dejadlo a lxs compañerxs del bar para
              actualizarlos cada semana.
            </p>
            <p>
              Si al final de la liga un equipo ha jugado 3 partidos o menos, sus enfrentamientos seran eliminados del registro y no seran tomados en cuenta
              los resultados.
            </p>
            <p>
              Fase de grupos: 
            </p>
            <ul>
              <li>Enfrentamiento unico </li>
              <li>6 partidas de 9 bolas cada una</li>
              <li>2 puntos por victoria</li>
              <li>1 punto por empate </li>
              <li>(Es decir: un encuentro se compone de 6 partidas, es importante que juguéis todas las partidas y todas las bolas).</li>
            </ul>
            <p>Criterio de desempate:</p>
            <ul>
              <li>1º Puntos </li>
              <li>2º Partidas a favor </li>
              <li>3º Enfrentamientos directos (average particular) </li>
              <li>4º Partidos jugados </li>
              <li>5º Diferencia de Goles </li>
              <li>6º Goles a favor </li>
              <li>7º Partidos Ganados </li>
            </ul>
            <p>IMPORTANTE:</p>
            <p>La fecha final para acabar la fase de grupos es el 30 de noviembre. Los partidos que no se hayan jugado ese dia se daran por no presentados.
              NO habra extensiones.</p>
            <p>CLASIFICACIóN Y Play off:</p>
            <p>Para el play off se clasificarán directamente los 3 primeros equipos de los grupos A y B. </p>
            <p>El 1° y 2° clasificado de A y B pasarán directamente a cuartos de final</p>
            <p>El resto de equipos de A y B se enfrentarán a los 6 primeros equipos del grupo C por un puesto en octavos. Tras este enfrentamiento
ocuparan el puesto natural del cruce en el cuadro del torneo.</p>
            <p>Enfrentamiento unico en play off:</p>
            <p>Octavos de final, 1/4 de final, semifinal y final.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FuncionamientoSection;
