import React from "react";

function Chirurgiens() {
  return (
    <section className="pb-16">
      <div className="flex flex-col ">
        <div className="ml-4">
        <div className="w-[90%] sm:w-2/3 h-12 bg-pink-100 flex items-center rounded">
          <p className="mx-auto sm:ml-44 font-bold text-base sm:text-lg text-center sm:text-left">
            Les chirurgiens partenaires avec qui nous collaborons
          </p>
        </div>

        <div className="ml-8 sm:ml-36 w-fit h-fit px-3 py-1.5 bg-blue-500 rounded flex justify-center items-center font-bold -mt-1.5">
          <h2 className="text-white text-lg sm:text-xl text-center">
            Nos chirurgiens esthétiques
          </h2>
        </div>
</div>
        <p className="my-5 px-4 sm:px-32 text-sm sm:text-base ">
          Nos chirurgiens ont été diplômés de meilleures universités. Tous ont une trajectoire allant de 10 à 30 ans d’expérience dans le domaine de la Chirurgie Plastique et Reconstructive, et sont membres des principales associations de chirurgie plastique et reconstructive aux Etats-Unis et en France ainsi que dans le Conseil national de l’Ordre des médecins en Tunisie.
        </p>

        <div className="flex flex-col sm:flex-row gap-8 px-4 sm:px-32 pt-10 justify-center items-center">
          {/* Card 1 */}
          <div className="bg-white rounded-xl shadow-md p-4 py-5 w-64 h-fit text-center">
            <img
              src="chirurgien1.png"
              alt="Dr. Amine Ben Salah"
              className="w-40 h-40 object-cover rounded mx-auto mb-4"
            />
            <h3 className="text-lg font-semibold">Dr. Amine Ben Salah</h3>
            <p className="text-gray-600">Chirurgie maxillo-faciale</p>
            <button className="w-fit h-fit px-1.5 py-1.5 bg-blue-500 hover:bg-pink-200 rounded flex justify-self-center items-center font-bold mt-2 text-white">
              Voir CV
            </button>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-xl shadow-md p-4 py-5 w-64 h-fit text-center">
            <img
              src="chirurgien2.png"
              alt="Dr. Leila Mezri"
              className="w-40 h-40 object-cover rounded mx-auto mb-4"
            />
            <h3 className="text-lg font-semibold">Dr. Leila Mezri</h3>
            <p className="text-gray-600">Chirurgie dentaire</p>
            <button className="w-fit h-fit px-1.5 py-1.5 bg-blue-500 hover:bg-pink-200 rounded flex justify-self-center items-center font-bold mt-2 text-white">
              Voir CV
            </button>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-xl shadow-md p-4 py-5 w-64 h-fit text-center">
            <img
              src="chirurgien3.webp"
              alt="Dr. Karim Haddad"
              className="w-40 h-40 object-cover rounded mx-auto mb-4"
            />
            <h3 className="text-lg font-semibold">Dr. Karim Haddad</h3>
            <p className="text-gray-600">Chirurgie de l'obésité</p>
            <button className="w-fit h-fit px-1.5 py-1.5 bg-blue-500 hover:bg-pink-200 rounded flex justify-self-center items-center font-bold mt-2 text-white">
              Voir CV
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Chirurgiens;
