'use client';

import { InterventionDetail } from '@/utils/interventions-data';

export default function DetailIntervention({ intervention }: { intervention: InterventionDetail }) {
  return (
    <div className="max-w-6xl mx-auto px-6">
      <h1 className="text-4xl font-bold text-center text-rose-800 mb-12">{intervention.name}</h1>
      <div className="space-y-16">
        {intervention.operations.map((op, index) => (
          <div key={index} className="flex flex-col md:flex-row items-center gap-10">
            {index % 2 === 0 ? (
              <>
                <div className="md:w-1/2">
                  <img src={op.image} alt={op.title} className="rounded-2xl shadow-lg" />
                </div>
                <div className="md:w-1/2">
                  <h2 className="text-2xl font-bold text-cyan-700 mb-4">{op.title}</h2>
                  <p className="text-gray-700 mb-4">{op.description}</p>
                  <button className="bg-rose-600 text-white px-6 py-2 rounded-md">Lire plus</button>
                </div>
              </>
            ) : (
              <>
                <div className="md:w-1/2 order-2 md:order-1">
                  <h2 className="text-2xl font-bold text-cyan-700 mb-4">{op.title}</h2>
                  <p className="text-gray-700 mb-4">{op.description}</p>
                  <button className="bg-rose-600 text-white px-6 py-2 rounded-md">Lire plus</button>
                </div>
                <div className="md:w-1/2 order-1 md:order-2">
                  <img src={op.image} alt={op.title} className="rounded-2xl shadow-lg object-cover w-full h-72" />
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
