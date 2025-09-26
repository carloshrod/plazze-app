'use client';

import Image from 'next/image';
import { useState } from 'react';

interface SiteImagesProps {
  images: string[];
}

export const SiteImages = ({ images }: SiteImagesProps) => {
  const [mainImage, setMainImage] = useState(images[0]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
        <Image
          src={mainImage}
          alt="Site main image"
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw"
        />
      </div>
      <div className="grid grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className={`relative aspect-video rounded-lg overflow-hidden cursor-pointer border-2 bg-gray-100 ${
              image === mainImage ? 'border-primary' : 'border-transparent'
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