import React from "react";
import Image from "next/image";

function Accueil() {
  return (
    <section className="flex justify-between bg-[linear-gradient(to_right,_#fce7f3_45%,_#ffffff_100%)] pb-2 pt-10">


      <div className="flex flex-col  items-center gap-9 ml-32  ">

        <img src="/atlas/fleur.png" alt="fleur" width={100} height={20} className="pt-10"/>

        <div className="flex flex-col  gap-1 w-[500px]">
          <h1 className="font-bold text-3xl font-title">
           Chirurgie esthétique tunisie :  <span className="text-2xl ">Sejour complet à prix abordable</span>
          </h1>
          <h2 className="font-bold text-lg font-title">
            Économisez 60% sur les tarifs pratiqués en Europe et profitez de
            remises de 50% sur les 2ème et 3ème interventions réalisées
            simultanément.
          </h2>
          <button className="bg-blue-500 hover:bg-blue-400 hover:text-blue-700 text-white w-52 h-11 rounded-4xl text-lg font-medium mt-9">Consultation Gratuite</button>
        </div>

      </div>

      <div className="mt-14">
        <img src="/atlas/silhouette.png" alt="silhouette" className=" h-[600px]" />
      </div>
    </section>
  );
}

export default Accueil;
