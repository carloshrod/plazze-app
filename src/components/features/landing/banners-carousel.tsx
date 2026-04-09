"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { bannerLib } from "@/libs/api/banner";
import type { Banner } from "@/types/plazze";

interface BannersCarouselProps {
  position: "features" | "trending";
}

const BannersCarousel = ({ position }: BannersCarouselProps) => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    bannerLib
      .getActiveBanners(position)
      .then(setBanners)
      .catch(() => {});
  }, [position]);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) return null;

  // Si algún banner tiene imagen móvil distinta, el contenedor adapta su ratio en móvil
  const hasMobileImage = banners.some(
    (b) => b.image_url_mobile && b.image_url_mobile !== b.image_url,
  );

  return (
    <section className="w-full bg-white border-y border-gray-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Contenedor móvil: ratio vertical si hay imagen móvil, horizontal si no */}
        <div
          className={`relative w-full overflow-hidden rounded-xl shadow-sm md:hidden ${
            hasMobileImage
              ? "aspect-[9/16] max-h-[600px]"
              : "aspect-[3/1] max-h-80"
          }`}
        >
          {banners.map((banner, index) => {
            const mobileSrc = banner.image_url_mobile || banner.image_url;
            const inner = (
              <div
                key={banner.id}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  index === current ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                <Image
                  src={mobileSrc}
                  alt={banner.title}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            );
            return banner.link_url ? (
              <Link
                key={banner.id}
                href={banner.link_url}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0"
                style={{ zIndex: index === current ? 10 : 0 }}
              >
                {inner}
              </Link>
            ) : (
              inner
            );
          })}
          {banners.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    i === current ? "bg-white" : "bg-white/50"
                  }`}
                  aria-label={`Ir al banner ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Contenedor desktop: siempre horizontal */}
        <div
          className="relative w-full overflow-hidden rounded-xl shadow-sm hidden md:block"
          style={{ aspectRatio: "3/1", maxHeight: 320 }}
        >
          {banners.map((banner, index) => {
            const inner = (
              <div
                key={banner.id}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  index === current ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                <Image
                  src={banner.image_url}
                  alt={banner.title}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            );
            return banner.link_url ? (
              <Link
                key={banner.id}
                href={banner.link_url}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0"
                style={{ zIndex: index === current ? 10 : 0 }}
              >
                {inner}
              </Link>
            ) : (
              inner
            );
          })}
          {banners.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    i === current ? "bg-white" : "bg-white/50"
                  }`}
                  aria-label={`Ir al banner ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BannersCarousel;
