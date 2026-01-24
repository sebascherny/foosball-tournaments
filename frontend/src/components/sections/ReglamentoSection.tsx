import React from 'react';

const ReglamentoSection: React.FC = () => {
  return (
    <section id="reglamento" className="section-container bg-gray-50">
      <div className="max-w-4xl mx-auto text-center">
        {/* Palestina SVG with overlay text */}
        <div className="relative w-full mb-8">
          <img 
            src="/images/loukanikos/palestina.svg" 
            alt="Palestina" 
            className="w-full h-auto"
          />
          <div className="absolute inset-0 flex flex-col">
            <div className="flex-1 flex items-center justify-center">
              <h1 className="text-center text-white px-4 max-w-2xl leading-relaxed text-3xl">
                Bienvenidxs
              </h1>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <p className="text-center text-black font-medium px-4 max-w-2xl leading-relaxed">
                ... y gracias por seguir. Queremos agradeceros ,<br/>
                tanto a lxs que acabais de llegar, como a lxs que no os vais ni con<br/>
                lejia, que decidais formar parte de esta pequeña aventura que es<br/>
                la liga de futbolín Loukanikos.
              </p>
            </div>
            <div className="flex-1"></div>
          </div>
        </div>
        
        <div className="flex items-center justify-center mb-8">
          <img 
            src="/images/loukanikos/louka_futbolin_o_muerte.png" 
            alt="Louka Futbolin o Muerte" 
            className="w-24 h-24 mr-4"
          />
          <h2 className="text-4xl font-bold text-gray-800">REGLAMENTO</h2>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-8 text-left">
          <div className="prose prose-lg max-w-none">
            {/* <h3 className="text-2xl font-semibold text-primary-600 mb-4">Reglas del Torneo</h3> */}
            <p className="text-gray-700 mb-6">
              Lo primero de todo es aclarar que, siempre que se acuerde de antemano por ambas partes, estas normas podrán alterarse.
            </p>
            <h4 className="text-xl font-semibold text-gray-800 mb-3">Saque</h4>
            <p className="text-gray-700 mb-4">
              La posesion inicial se podra decidir de dos maneras:
            </p>
              <ul>
                <li>Sacando desde el centro del campo por el orificio del lateral.</li>
                <li>Tras sorteo de la bola.</li>
              </ul>
              <p className="text-gray-700 mb-4">
              Indiferentemete de como se realice el saque inicial, los siguientes saques de comienzo de partida los realizara el equipo que haya
              perdido la partida anterior.
              </p>
            
            <h4 className="text-xl font-semibold text-gray-800 mb-3">PUESTA EN JUEGO</h4>
            <p className="text-gray-700 mb-4">
              Durante la fase de liguilla cada equipo debera elegir antes de iniciar la partida entre sacar desde atras, o hacer el saque desde la
              barra de media. Esta elección debera mantenerse durante toda la partida.
              <br/>
              <br/>
              En la fase de eliminatoria el saque tendrá que ser desde la barra de media.
            </p>

            <h4 className="font-semibold underline text-gray-800 mb-3">Saque desde atrás:</h4>
            <ul>
              <li>Se tomara posesion de la bola con uno de los dos jugadores de la barra de defensa.</li>
              <li>Antes de poder poner la bola en juego se preguntara al equipo contrario si estan preparados para empezar.</li>
              <li>(i.e.: “¿Vale? - vale”)</li>
            </ul>

            <h4 className="font-semibold underline text-gray-800 mb-3">Saque de media:</h4>
            <p className="text-gray-700 mb-4">
            </p>
              <ul>
                <li>Se tomara posesion de la bola con el jugador central de la barra de 5</li>
                <li>Antes de poder poner la bola en juego se preguntara al equipo contrario si estan preparados para empezar</li>
                <li>(i.e.: “¿Vale? - vale”)</li>
                <li>Deberá efectuar al menos un pase y control entre jugadores de la misma barra.</li>
                <li>Una vez efectuado el control de un pase, la pelota se considerará en juego.</li>
                <li>La perdida de posesión a favor del contrario durante el intento de primer pase no supondrá la repetición del mismo. El balon 
                  estara en juego.</li>
              </ul>

            <h4 className="text-xl font-semibold text-gray-800 mb-3">BOLA FUERA</h4>
            <p className="text-gray-700 mb-4">
              Si la bola sale fuera del campo por la fuerza del tiro, sacara el oponente desde la defensa. Ver normas de puesta en juego.
              Si un jugador responde a un disparo con uno propio (i.e.: Chapa) y la bola sale fuera del campo, la posesion sera para el oponente
del equipo que realiza el ultimo disparo.
              Si la bola sale fuera resultante de un rechaze sin intencion de disparo, la posesion sera para el oponente del equipo que relizó el
disparo.
            </p>

            <h4 className="text-xl font-semibold text-gray-800 mb-3">BOLAS MUERTAS</h4>
            <p className="text-gray-700 mb-4">
              Cuando la bola quede muerta sin que nadie pueda alcanzarla con un jugador de campo, se reanudara de la siguiente forma:
            </p>
              <ul>
                <li>bola muerta entre la barra de defensa y barra de ataque: bola para la defensa</li>
                <li>bola muerta ente la barra de ataque y barra de media: saque para el equipo con saque en esa bola.</li>
                <li>bola muerta en el centro: saque para el equipo con saque en esa bola.</li>
                <li>Para poder coger la bola con la mano se debera pedir permiso al oponente.</li>
                <li>Se reanudara de acuerdo la las normas de <span className="underline">puesta en juego</span></li>
              </ul>

            <h4 className="text-xl font-semibold text-gray-800 mb-3">GOL</h4>
            <p className="text-gray-700 mb-4">
              Se puede marcar gol desde cualquier barra y jugador. 
              <br/>
              La bola que entra por completo y sale rebotada de la porteria se considera GOL. (Las porterias tienen chivato)
            </p>

            <h4 className="text-xl font-semibold text-gray-800 mb-3">CAMBIOS</h4>
            <p className="text-gray-700 mb-4">
              Lxs jugadores de un mismo equipo se podrán cambiar de posicián tantas veces como quieran , siempre despues de un gol, durante 
              un tiempo muerto, o entre partidas.
            </p>

            <h4 className="text-xl font-semibold text-gray-800 mb-3">TIEMPOS MUERTOS</h4>
            <p className="text-gray-700 mb-4">
              Cada equipo dispondra de 2 tiempos muerto por partida
              <br/>
              Para poder pedir un tiempo muerto el equipo que lo pide debe estar en posesion de la pelota.
              <br/>
              El tiempo muerto solo lo puede pedir el miembro del equipo con posesion de la pelota, no su compañerx.
              <br/>
              Cada tiempo muerto tendra una duracion maxima de 30 segundos.
            </p>

            <h4 className="text-xl font-semibold text-gray-800 mb-3">PROHIBICIONES Y JUEGO LIMPIO:</h4>
            <ul>
              <li>Ruleta o molinillo. Se considera "ruleta" la vuelta sin control de la barra de mas de 720°.</li>
              <li>Golpeo con las barras en los laterales. Cualquier movimiento, ya sea en ataque o en defensa, que incurra en golpeos en los
                laterales que puedan afectar al oponente, serán considerados falta, y la posesión pasará al equipo contrario en la misma barra
                en la que se haya cometido la infracción.</li>
              <li>Golpear las barra con las manos (p.e. para alcanzar una bola que se ha quedado parada)</li>
              <li>Levantar la mesa</li>
              <li>Gritos: evitar gritar y distraer al contrario de forma intencionada.</li>
              <li>Manos: No se podra introducir la mano en el campo ni tocar la bola si esta está en juego. </li>
            </ul>
            <br/>
            <p className="mb-4">
              Y recordad, el futbolín y esta liga son para DIVERTIRSE. Respetad a vuestrx contrarix, respetad al bar, y disfrutad!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReglamentoSection;
