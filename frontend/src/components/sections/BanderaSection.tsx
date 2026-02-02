import React from 'react';

const ReglamentoSection: React.FC = () => {
  return (
    <section id="bandera" className="section-container bg-gray-50">
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
              <p className="text-center text-black font-medium ml-2 px-4 max-w-2xl leading-relaxed">
                ... y gracias por seguir. Queremos agradeceros ,<br/>
                tanto a lxs que acabais de llegar, como a lxs que no os vais ni con<br/>
                lejia, que decidais formar parte de esta pequeña aventura que es<br/>
                la liga de futbolín Loukanikos.
              </p>
            </div>
            <div className="flex-1"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReglamentoSection;
