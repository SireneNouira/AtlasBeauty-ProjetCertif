'use client';

import { useState } from 'react';

interface CarouselAvantApresProps {
  slug: string;
}

const imageCount: Record<string, number> = {
  visage: 5,
  mammaire: 4,
  corps: 6,
  dentaire: 3,
  cheveux: 3,
  soin: 2,
};

export default function CarouselAvantApres({ slug }: CarouselAvantApresProps) {
  const totalImages = imageCount[slug] || 0;
  const [currentIndex, setCurrentIndex] = useState(0);

  if (totalImages === 0) return null;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalImages);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalImages) % totalImages);
  };

  const images = Array.from({ length: totalImages }, (_, i) => `/images/${slug}/avant-apres/${i + 1}.jpg`);

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
