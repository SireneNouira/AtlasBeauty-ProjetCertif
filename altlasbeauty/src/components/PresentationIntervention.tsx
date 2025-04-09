'use client'

import { useRouter } from 'next/navigation'

type Intervention = {
  title: string
  image: string
  link: string
}

const interventions: Intervention[] = [
  {
    title: 'Chirurgie du visage',
    image: '/visage/visage3.png',
    link: '/interventions/visage',
  },
  {
    title: 'Chirurgie mammaire',
    image: '/poitrine/poitrine2.jpg',
    link: '/interventions/mammaire',
  },
  {
    title: 'Chirurgie du corps',
    image: '/corps/corps3.jpg',
    link: '/interventions/corps',
  },
  {
    title: 'Chirurgie dentaire',
    image: '/dent/dent3.jpg',
    link: '/interventions/dentaire',
  },
  {
    title: 'Greffe de cheveux',
    image: '/greffe/greffe.png',
    link: '/interventions/cheveux',
  },
  {
    title: 'Soin esthétique',
    image: '/soins/soin.png',
    link: '/interventions/soin',
  },
]

export default function PresentationIntervention() {
  const router = useRouter()

  return (
    <section className="bg-gradient-to-b from-pink-100 via-orange-100 to-yellow-50 pb-10 pt-6">
      <div className="text-center text-rose-800 mb-12 px-4">
        <h2 className="text-4xl font-extrabold mb-3 drop-shadow-sm">
          Nos interventions en chirurgie esthétique
        </h2>
        <p className="text-lg text-rose-700/80">Les leaders de notre domaine</p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 px-6">
        {interventions.map((item, index) => (
          <div
            key={index}
            onClick={() => router.push(item.link)}
            className="relative h-64 rounded-3xl overflow-hidden shadow-lg cursor-pointer group transition-transform duration-500 hover:scale-105"
          >
            <img
              src={item.image}
              alt={item.title}
              className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent backdrop-blur-xs group-hover:bg-black/55 transition-all duration-500" />
            <div className="absolute inset-0 flex items-center justify-center px-4 text-white text-2xl font-semibold text-center drop-shadow-md tracking-wide group-hover:tracking-widest">
              {item.title}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
