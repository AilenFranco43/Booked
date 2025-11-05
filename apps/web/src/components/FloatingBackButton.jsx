"use client"
import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react"; // o cualquier otro icono que prefieras
import Link from "next/link";

export const FloatingBackButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div className="fixed bottom-8 right-8 z-50 transition-opacity duration-300">
      {isVisible && (
        <Link
          href="#"
          className="flex items-center justify-center w-14 h-14 rounded-full bg-[#5FA777] text-white shadow-lg
                    hover:bg-[#4a8a5f] hover:shadow-xl transition-all duration-300 transform hover:scale-110"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          aria-label="Volver al inicio"
        >
          <ArrowUp size={24} />
        </Link>
      )}
    </div>
  );
};