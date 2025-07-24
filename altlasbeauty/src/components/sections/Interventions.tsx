"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function Interventions() {
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);

  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (!carouselRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
    };

    const current = carouselRef.current;
    if (current) {
      current.addEventListener("scroll", handleScroll);
      handleScroll();
    }

    return () => {
      if (current) current.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };
  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!carouselRef.current) return;
    setTouchStartX(e.touches[0].clientX);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!carouselRef.current) return;
    const x = e.touches[0].clientX;
    const walk = (x - touchStartX) * 1.5;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const scroll = (direction: "left" | "right") => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const children = Array.from(container.children) as HTMLElement[];
    const scrollLeft = container.scrollLeft;
    const containerWidth = container.clientWidth;

    let target: HTMLElement | undefined;
    if (direction === "right") {
      target = children.find((child) => child.offsetLeft > scrollLeft + 10);
    } else {
      const reversed = [...children].reverse();
      target = reversed.find((child) => child.offsetLeft < scrollLeft - 10);
    }

    if (target) {
      container.scrollTo({
        left: target.offsetLeft,
        behavior: "smooth",
      });
    }
  };

  const articles = [
    {
      title: "Chirurgie du visage",
      image: "/visage/visage.jpg",
      description: [
        "Lifting cervico-facial",
        "Rhinoplastie",
        "Blépharoplastie",
        "Lifting du cou",
        "Canthopexie (fox eyes)",
      ],
    },
    {
      title: "Chirurgie de la poitrine",
      image: "/poitrine/poitrine3.jpg",
      description: [
        "Augmentation mammaire",
        "Réduction mammaire",
        "Lifting mammaire",
        "Reconstruction",
        "Changement de prothèses",
      ],
    },
    {
      title: "Chirurgie du corps",
      image: "/corps/corps2.jpg",
      description: [
        "Abdominoplastie",
        "Liposuccion",
        "Body lift",
        "Lifting des bras",
        "Lifting des cuisses",
      ],
    },
    {
      title: "Chirurgie dentaire",
      image: "/dent/dent-blanche.webp",
      description: [
        "Blanchiment dentaire",
        "Implants dentaire Tunisie",
        "Facettes dentaire",
        "Soins",
      ],
    },
    {
      title: "Soin esthétique",
      image: "/visage/visage2.png",
      description: ["Injection", "Mésolift", "Peeling", "Hypersudation"],
    },
  ];

return (
  <section className="mt-12 pb-16">
    <div className="flex flex-col ml-4 sm:ml-16">
      <div className="w-[90%] sm:w-2/3 h-12 bg-pink-100 flex items-center rounded">
        <p className="mx-auto sm:ml-44 font-bold text-base sm:text-lg text-center sm:text-left">
          Les interventions que nous pratiquons
        </p>
      </div>
      <div className="ml-10 sm:ml-36 w-40 sm:w-52 h-9 bg-blue-500 rounded flex justify-center items-center font-bold -mt-1.5">
        <h2 className="text-white text-lg sm:text-xl">Les interventions</h2>
      </div>
    </div>

    <div className="w-[100px] sm:w-[150px] h-0.5 bg-blue-400 mt-12 sm:mt-20 ml-6 sm:ml-32 mb-1"></div>

    <div className="relative w-full overflow-hidden">
      {showLeftArrow && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white shadow p-2 z-10 rounded-full hover:scale-110 transition-transform duration-300"
        >
          <ChevronLeft />
        </button>
      )}
      {showRightArrow && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white shadow p-2 z-10 rounded-full hover:scale-110 transition-transform duration-300"
        >
          <ChevronRight />
        </button>
      )}

      <div
        ref={carouselRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        className={`flex overflow-x-scroll scroll-smooth px-4 sm:p-8 cursor-${
          isDragging ? "grabbing" : "grab"
        } pl-[5vw] sm:pl-[10vw] gap-6 sm:gap-8`}
        style={{
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {articles.map((article, index) => (
          <article
            key={index}
            className="flex flex-col sm:flex-row justify-between items-start w-[90%] sm:w-[60%] min-w-[90%] sm:min-w-[60%] p-4 sm:p-6 bg-white rounded-2xl shadow-md scroll-snap-align-start select-none transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02]"
          >
            <div className="flex flex-col w-full sm:w-1/2">
              <p className="font-semibold text-lg sm:text-xl mb-2">{article.title}</p>
              <div className="w-[50px] sm:w-[65px] h-1 bg-blue-500 mb-4 sm:mb-6"></div>
              <div className="mb-4 sm:mb-6 ml-2 sm:ml-4 text-gray-700 text-sm sm:text-base">
                {article.description.map((line, i) => (
                  <p key={i} className="mb-1">• {line}</p>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-full font-semibold transition duration-300 hover:scale-105 text-sm sm:text-base">
                  + infos
                </button>
                <button className="bg-pink-400 hover:bg-pink-500 text-white px-4 py-1 rounded-full font-semibold transition duration-300 hover:scale-105 text-sm sm:text-base">
                  Consultation Gratuite
                </button>
              </div>
            </div>
            <div className="w-full sm:w-1/2 flex justify-center sm:justify-end items-center mt-4 sm:mt-0">
              <img
                src={article.image}
                alt={article.title}
                draggable={false}
                className="rounded-xl shadow-sm w-[260px] sm:w-[300px] h-[180px] sm:h-[250px] object-cover transition-transform duration-300"
              />
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);
}

export default Interventions;
