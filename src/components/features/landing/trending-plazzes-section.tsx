"use client";

import Image from "next/image";
import Link from "next/link";
import { LuArrowUpRight } from "react-icons/lu";
import { mockSites } from "@/mock/sites";
import { ROUTES } from "@/consts/routes";

export const TrendingPlazzesSection = () => {
  const trendingSites = mockSites.slice(0, 6);

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Plazzes más buscados
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubre los espacios que están marcando tendencia en nuestra
            comunidad
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingSites.map((site) => (
            <Link
              href={ROUTES.PUBLIC.PLAZZES.DETAIL(site.id)}
              key={site.id}
              className="group block relative aspect-[4/3] rounded-lg overflow-hidden"
            >
              <Image
                src={site.image}
                alt={site.name}
                fill
                sizes="(max-width: 640px) 100vw, 256px"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-bold mb-2">{site.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold">
                    ${site.price.toLocaleString()}
                  </span>
                  <span className="text-white/80">/ día</span>
                </div>
                <p className="text-white/90 text-sm mt-2">{site.location}</p>
              </div>
            </Link>
          ))}
          <div className="flex items-center justify-center md:aspect-[4/3]">
            <Link
              href={ROUTES.PUBLIC.PLAZZES.LIST}
              className="text-xl text-primary hover:text-primary/80 font-semibold transition-colors group flex items-center hover:bg-primary/10 px-4 py-2 rounded-md"
            >
              Ver todos los plazzes
              <LuArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrendingPlazzesSection;
