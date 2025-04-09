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
      handleScroll(); // Init
    }

    return () => {
      if (current) current.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Souris
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

  // Tactile
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

    // Trouver l'élément vers lequel on veut scroller
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
      <div className="flex flex-col ml-16">
        <div className="w-2/3 h-12 bg-pink-100  flex items-center rounded">
          <p className="ml-44 font-bold text-lg">
            Les interventions que nous pratiquons
          </p>
        </div>

        <div className="ml-36 w-52 h-9 bg-blue-500 rounded flex justify-center items-center font-bold -mt-1.5">
          <h2 className="text-white text-xl">Les interventions</h2>
        </div>
      </div>

      <div className="w-[150px] h-0.5 bg-blue-400 mt-20 ml-32 mb-1"></div>

      {/* carroussel */}

      <div className="relative w-full overflow-hidden">
        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow p-2 z-10 rounded-full"
          >
            <ChevronLeft />
          </button>
        )}
        {showRightArrow && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow p-2 z-10 rounded-full"
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
          className={`flex  overflow-x-scroll scroll-smooth p-8 cursor-${
            isDragging ? "grabbing" : "grab"
          } pl-[10vw] `}
          style={{
            scrollSnapType: "x mandatory",
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // IE 10+
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
              className="border border-gray-300 flex justify-between items-start w-[60%] min-w-[60%] py-5 px-10 bg-white scroll-snap-align-start select-none"
            >
              <div className="flex flex-col w-1/2">
                <p className="font-semibold text-lg">{article.title}</p>
                <div className="w-[65px] h-1 bg-blue-500 mb-10"></div>
                <p className="mb-6 ml-10">
                  {article.description.map((line, i) => (
                    <span key={i}>
                      {line} <br />
                    </span>
                  ))}
                </p>
                <div className="flex gap-4">
                  <button className="bg-blue-500 hover:bg-pink-200 text-white px-3 py-0.5 rounded-4xl font-bold">
                    + infos
                  </button>
                  <button className="bg-blue-500 hover:bg-pink-200 text-white px-3 py-0.5 rounded-4xl font-bold">
                    Consultation Gratuite
                  </button>
                </div>
              </div>
              <div className="w-1/2 flex justify-end">
                <img
                  src={article.image}
                  alt={article.title}
                  draggable={false}
                  className="select-none w-[300px] h-[250px] object-cover p-3.5"
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
