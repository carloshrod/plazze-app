// src/components/common/ui/scroll-to-top.tsx
"use client";

import { useEffect, useState } from "react";
import { LuArrowUp } from "react-icons/lu";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleVisibility = () => {
    if (typeof window !== "undefined" && window.scrollY > 400) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (!mounted) return;

    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg transition-all hover:shadow-xl z-50"
          aria-label="Ir al inicio"
        >
          <LuArrowUp size={24} />
        </button>
      )}
    </>
  );
};

export default ScrollToTop;
