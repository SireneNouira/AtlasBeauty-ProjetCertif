import React from "react";

function Sejour() {
  return (
    <section className="pb-16">
      <div className="flex flex-col ml-16">
        <div className="w-2/3 h-12 bg-pink-100  flex items-center rounded">
          <p className="ml-44 font-bold text-lg">
            Votre séjour de chirurgie esthétique en Tunisie
          </p>
        </div>

        <div className="ml-36 w-fit h-9 bg-blue-500 rounded flex justify-center items-center font-bold -mt-1.5 px-3">
          <h2 className="text-white text-xl">Votre séjour en 7 étapes</h2>
        </div>
      </div>

      <article className="flex justify-between my-14 ml-36">
        {/* Texte à gauche */}
        <div className="">
        <ol className="list-decimal list-inside space-y-5 text-gray-800">

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

        {/* Image qui sort du article */}

        <div className="relative flex justify-end">
          {/* Overlay bleu semi-transparent */}
          <div className="absolute top-[-40px] bottom-[-40px] left-16 w-[45%] bg-blue-500/75 z-10">
            <h4 className="text-white p-3 font-bold">
              Votre expert en chirurgie esthétique en Tunisie
            </h4>{" "}
            <p className=" p-3 text-white font-medium">
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
            className="z-0"
          />
        </div>
      </article>
    </section>
  );
}

export default Sejour;
// 1 - Envoi de votre dossier médical

// 2 - Réponse de l’équipe médicale

// 3 - Préparation de votre intervention...

// 4 - Votre arrivée à Tunis

// 5 - Votre intervention

// 6 - Des jours qui suivent l’intervention...

// 7 - ChirurgiePro garde le contact
