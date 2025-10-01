"use client";

import Image from "next/image";
import { useState } from "react";

interface SiteImagesProps {
  images: string[];
}

export const PlazzeImages = ({ images }: SiteImagesProps) => {
  const [mainImage, setMainImage] = useState(images[0]);

  return (
    <div className="grid md:grid-cols-[5fr_4fr] gap-1 md:gap-4">
      <div className="w-full relative aspect-[16/9] rounded-lg overflow-hidden bg-gray-100">
        <Image
          src={mainImage}
          alt="Site main image"
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw"
        />
      </div>
      <div className="grid grid-cols-4 md:grid-cols-2 md:grid-rows-2 gap-1 md:gap-4 h-[calc(100%+2px)]">
        {images.slice(0, 4).map((image, index) => (
          <div
            key={index}
            className={`relative aspect-[16/9] md:aspect-auto md:h-full rounded-lg overflow-hidden cursor-pointer border-2 bg-gray-100 ${
              index === 0 ? "border-primary" : "border-transparent"
            }`}
            onClick={() => setMainImage(image)}
          >
            <Image
              src={image}
              alt={`Site image ${index + 1}`}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 25vw, (max-width: 1200px) 16vw"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
