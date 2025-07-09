import React from "react";
import Image from "next/image";
import { IoIosLeaf } from "react-icons/io";

function Accueil() {
  return (
    <section className="flex flex-col lg:flex-row justify-between bg-[linear-gradient(to_right,_#fce7f3_45%,_#ffffff_100%)] pb-2">
      {/* Left side */}
      <div className="flex flex-col items-center gap-9 ml-4 lg:ml-32">
        <img
          src="/atlas/fleur.png"
          alt="fleur"
          width={100}
          height={20}
          className="max-w-full sm:max-w-[400px] lg:max-w-[600px] pt-10 opacity-80 brightness-110 contrast-110 saturate-125"
        />

        <div className="flex flex-col gap-1 w-full sm:max-w-md lg:w-[500px]">
          <h1 className="text-3xl sm:text-4xl lg:text-4xl font-bold leading-snug font-title text-gray-800">
            Chirurgie esthétique Tunisie :
            <span className="block text-lg sm:text-xl lg:text-[22px] font-medium text-[#ca693c] mt-2">
              Votre bien-être entre des mains expertes
            </span>
          </h1>
          <h2 className="text-base sm:text-lg text-gray-700 font-medium">
            Économisez {" "}
            <span className="text-rose-500 font-bold">60%</span> sur les tarifs
            pratiqués en Europe et profitez de
            <span className="text-rose-500 font-bold"> remises de 50%</span>{" "}
            sur les 2ème et 3ème interventions réalisées simultanément.
          </h2>
          <p className="italic text-[#7b6756] text-sm flex items-center gap-2 mt-2">
            <IoIosLeaf className="text-lg" />
            Un voyage de soins, en douceur et en confiance.
          </p>
          <button className="bg-rose-500 hover:bg-blue-400 hover:text-blue-700 text-white w-52 h-11 rounded-4xl text-lg font-medium mt-9">
            Consultation Gratuite
          </button>
        </div>
      </div>

      {/* Right side */}
      <div className="mx-auto mt-8 ">
        <img
          src="/atlas/silhouette.png"
          alt="silhouette"
          width={460}
          height={600}
          className="w-64 sm:w-80 md:w-96 lg:w-[460px] opacity-80 brightness-110 contrast-110 saturate-125"
        />
      </div>
    </section>
  );
}

export default Accueil;
