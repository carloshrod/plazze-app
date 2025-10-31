"use client";

import { Suspense } from "react";
import useInitialPlazzesLoad from "@/hooks/useInitialPlazzesLoad";
import { useURLSync } from "@/hooks/useURLSync";

const PlazzesDataLoader = () => {
  // Cargar plazzes iniciales y leer filtros de URL
  useInitialPlazzesLoad();

  // Sincronizar filtros con URL
  useURLSync();

  return null;
};

export const PlazzesDataProvider = () => {
  return (
    <Suspense fallback={null}>
      <PlazzesDataLoader />
    </Suspense>
  );
};

export default PlazzesDataProvider;
