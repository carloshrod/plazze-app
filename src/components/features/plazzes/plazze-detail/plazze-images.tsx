"use client";

import Image from "next/image";
import { useState } from "react";

interface PlazzeImagesProps {
  images: string[];
}

export const PlazzeImages = ({ images }: PlazzeImagesProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const mainImage = images[selectedIndex];

  const handleImageClick = (index: number) => {
    setSelectedIndex(index);
  };

  // Avanzar o retroceder en la galería completa con teclas/click
  const handleNext = () => setSelectedIndex((i) => (i + 1) % images.length);
  const handlePrev = () =>
    setSelectedIndex((i) => (i - 1 + images.length) % images.length);

  // Thumbnails: mostrar máx 4; si hay más, el último muestra "+N más"
  const MAX_THUMBS = 4;
  const visibleThumbs = images.slice(0, MAX_THUMBS);
  const extraCount = images.length - MAX_THUMBS;

  // Una sola imagen: solo mostrar la imagen principal
  if (images.length === 1) {
    return (
      <div className="w-full relative aspect-[16/9] rounded-lg overflow-hidden bg-gray-100">
        <Image
          src={mainImage}
          alt="Plazze image"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-[5fr_4fr] gap-1 md:gap-4">
      {/* Imagen principal con navegación */}
      <div
        className="w-full relative aspect-[16/9] rounded-lg overflow-hidden bg-gray-100 cursor-pointer group"
        onClick={handleNext}
      >
        <Image
          src={mainImage}
          alt="Plazze main image"
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw"
        />
        {images.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              className="bg-black/40 hover:bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              aria-label="Imagen anterior"
            >
              ‹
            </button>
            <button
              className="bg-black/40 hover:bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              aria-label="Imagen siguiente"
            >
              ›
            </button>
          </div>
        )}
        {/* Indicador de posición */}
        <div className="absolute bottom-2 right-3 bg-black/40 text-white text-xs px-2 py-0.5 rounded-full">
          {selectedIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails grid: max 4, con "+N más" en el último si aplica */}
      <div className="grid grid-cols-4 md:grid-cols-2 gap-1 md:gap-4">
        {visibleThumbs.map((image, index) => {
          const isLast = index === MAX_THUMBS - 1 && extraCount > 0;
          return (
            <div
              key={index}
              className={`relative aspect-[16/9] md:aspect-square rounded-lg overflow-hidden cursor-pointer border-2 bg-gray-100 transition-all duration-200 ${
                selectedIndex === index
                  ? "border-primary shadow-md"
                  : "border-transparent hover:border-gray-300"
              }`}
              onClick={() => handleImageClick(index)}
            >
              <Image
                src={image}
                alt={`Plazze image ${index + 1}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 25vw, (max-width: 1200px) 16vw"
              />
              {isLast && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    +{extraCount} más
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
