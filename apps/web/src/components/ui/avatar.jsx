"use client";

import * as React from "react";
import Image from "next/image";
import { getDisplayName } from "next/dist/shared/lib/utils";

const Avatar = ({ className, src, alt }) => (
  <div className={`relative flex h-15 w-15 overflow-hidden rounded-full ${className}`}>
    {src ? (
      <Image src={src} alt={alt} width={70} height={70} className="object-cover" />
    ) : (
      <AvatarFallback alt={alt} />
    )}
  </div>
);

const AvatarFallback = ({ alt }) => {
  console.log("AvatarFallback alt:", alt); 
  return (
    <div className="flex items-center justify-center h-full w-full bg-gray-300 text-white text-xl">
      {alt?.charAt(0) || "?"} {/* Muestra la inicial del nombre o "?" si no hay nombre */}
    </div>
  );
};

export { Avatar };