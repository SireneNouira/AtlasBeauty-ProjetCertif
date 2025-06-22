'use client';

import { useState } from 'react';

interface CarouselAvantApresProps {
  slug: string;
}

const imagePaths: Record<string, string[]> = {
  visage: [
    '/visage/nez_avant-apres.png',
    '/visage/visage_avant-apres.png',
    '/visage/nez_avant-apres.png',

  ],
  mammaire: [
    '/poitrine/poitrine_avant-apres.png',
    '/poitrine/poitrine_avant-apres.png',
    '/poitrine/poitrine_avant-apres.png',
  ],
  greffe: [
    '/greffe/greffe_avant-apres.png',
    '/greffe/greffe_avant-apres.png',
    '/greffe/greffe_avant-apres.png',
  ],
  dent: [
    '/dent/dent_avant-apres.png',
    '/dent/dent_avant-apres.png',
    '/dent/dent_avant-apres.png',
  ],
  corps: [
    '/corps/corps_avant-apres.png',
    '/corps/corps_avant-apres.png',
    '/corps/corps_avant-apres.png',
  ],
};

export default function CarouselAvantApres({ slug }: CarouselAvantApresProps) {
  const images = imagePaths[slug] || [];
  const totalImages = images.length;
  const [currentIndex, setCurrentIndex] = useState(0);

  if (totalImages === 0) return null;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalImages);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalImages) % totalImages);
  };

  return (
    <div className="relative w-full overflow-hidden rounded-xl shadow-lg">
      <img
        src={images[currentIndex]}
        alt={`Slide ${currentIndex + 1}`}
        className="w-full object-cover h-96 transition-all duration-700"
      />
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
      >
        ◀
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
      >
        ▶
      </button>
    </div>
  );
}
