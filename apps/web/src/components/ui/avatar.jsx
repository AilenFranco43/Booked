"use client";

import * as React from "react";
import Image from "next/image";

const AvatarFallback = ({ alt }) => {
  console.log("AvatarFallback alt:", alt);
  return (
    <div className="flex items-center justify-center h-full w-full bg-gray-300 text-white text-xl">
      {alt?.charAt(0) || "?"}
    </div>
  );
};

const AvatarImage = ({ src, alt }) => (
  <Image
    src={src}
    alt={alt}
    width={70}
    height={70}
    className="object-cover"
  />
);

const Avatar = ({ className, src, alt }) => (
  <div className={`relative flex h-15 w-15 overflow-hidden rounded-full ${className}`}>
    {src ? (
      <AvatarImage src={src} alt={alt} />
    ) : (
      <AvatarFallback alt={alt} />
    )}
  </div>
);

export { Avatar, AvatarImage, AvatarFallback };
