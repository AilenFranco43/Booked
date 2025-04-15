"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";


const Avatar = React.forwardRef(({ className, src, alt, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}
    {...props}
  >
    <AvatarImage src={src} alt={alt} />
    <AvatarFallback>{alt?.charAt(0)}</AvatarFallback> {/* Usa la primera letra del nombre como fallback */}
  </AvatarPrimitive.Root>
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
    onError={(e) => {
      e.target.onerror = null; // Evitar bucles en caso de error de carga
      e.target.src = "/path/to/default/avatar.png"; // Ruta de la imagen por defecto
    }}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;


const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };
