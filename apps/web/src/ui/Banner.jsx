"use client";

import Image from "next/image";
import BannerImage from "../app/public/fondohome.png";
import { InputSearch } from "./InputSearch";

export const Banner = () => {
  return (
    <div className="relative w-full flex flex-col items-center">
      <Image
        className="w-full h-[85vh] object-cover"
        src={BannerImage}
        alt="Hero"
      />
      <div className="absolute flex flex-col gap-8 top-24">
        <h2 className="text-white text-3xl lg:text-5xl relative text-center">
          Encuentra tu lugar ideal
        </h2>

        {/* Banner content */}
        <div className="relative">
          <InputSearch />
        </div>
      </div>
    </div>
  );
};
