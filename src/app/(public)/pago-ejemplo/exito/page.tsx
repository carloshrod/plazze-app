"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/consts/routes";

export default function PagoExitoPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace(ROUTES.ADMIN.DASHBOARD);
  }, [router]);

  return null;
}
