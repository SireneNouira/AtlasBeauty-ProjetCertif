import React from "react";

function Sejour() {
  return (
    <section className="pb-16">
      <div className="flex flex-col ml-4 sm:ml-16">
        <div className="w-[90%] sm:w-2/3 h-12 bg-pink-100 flex items-center rounded">
          <p className="mx-auto sm:ml-44 font-bold text-base sm:text-lg text-center sm:text-left">
            Votre séjour de chirurgie esthétique en Tunisie
          </p>
        </div>

        <div className="ml-8 sm:ml-36 w-fit h-9 bg-blue-500 rounded flex justify-center items-center font-bold -mt-1.5 px-3">
          <h2 className="text-white text-lg sm:text-xl text-center">
            Votre séjour en 7 étapes
          </h2>
        </div>
      </div>

      <article className="flex flex-col-reverse sm:flex-row justify-between mt-10 sm:my-14 px-4 sm:ml-36 gap-8">
        {/* Texte à gauche */}
        <div>
          <ol className="list-decimal list-inside space-y-5 text-gray-800 text-sm sm:text-base">
            <li className="underline decoration-blue-500">
              Envoi de votre dossier médical
            </li>
            <li>Réponse de l’équipe médicale</li>
            <li>Préparation de votre intervention...</li>
            <li>Votre arrivée à Tunis</li>
            <li>Votre intervention</li>
            <li>Des jours qui suivent l’intervention...</li>
            <li>AtlasBeauty garde le contact</li>
          </ol>
        </div>

        {/* Image + overlay */}
        <div className="relative flex justify-center sm:justify-end">
          {/* Overlay bleu */}
          <div className="absolute top-[-20px]  sm:top-[-40px] bottom-[-20px] sm:bottom-[-40px] left-6 sm:left-16 w-[90%] sm:w-[45%] bg-blue-500/90 z-10">
            <h4 className="text-white p-3 font-bold text-sm sm:text-base">
              Votre expert en chirurgie esthétique en Tunisie
            </h4>
            <p className="p-3 text-white font-medium text-sm sm:text-base">
              Notre agence de tourisme médical en Tunisie vous accompagne à
              chaque étape : prise de contact, organisation du séjour,
              intervention et suivi post-opératoire. Spécialisée en chirurgie
              plastique, réparatrice et soins esthétiques, profitez d’un service
              personnalisé, de chirurgiens qualifiés et d’un cadre rassurant
              pour vivre votre transformation en toute sérénité.
            </p>
          </div>

          {/* Image */}
          <img
            src="/atlas/sidi.jpg"
            alt="tunis"
            width={550}
            height={400}
            className="z-0 max-w-full h-auto"
          />
        </div>
      </article>
    </section>
  );
}


export default Sejour;