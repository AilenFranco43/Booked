"use client";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { uploadImage } from "@/lib/cloudinaryService";
import Image from "next/image";

export const ImageUploader = ({
  value,
  onChange,
  mode = "profile",
  maxFiles = 5,
  className = ""
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    
    // Validaciones
    if (mode === "multiple" && files.length + (Array.isArray(value) ? value.length : 0) > maxFiles) {
      alert(`Máximo ${maxFiles} imágenes permitidas`);
      return;
    }

    try {
      setIsUploading(true);
      
      // Subir imágenes
      const uploadedUrls = await Promise.all(
        files.map(file => uploadImage(file, mode === "profile" ? "profile" : "properties"))
      );

      // Manejar el resultado según el modo
      if (mode === "profile") {
        // Para perfil (single image)
        onChange(uploadedUrls[0]);
      } else {
        // Para propiedades (multiple images)
        onChange([...(Array.isArray(value) ? value : []), ...uploadedUrls]);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = (index) => {
    if (mode === "profile") {
      onChange("");
    } else {
      const newValues = [...value];
      newValues.splice(index, 1);
      onChange(newValues);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Input para subir archivos */}
      <Input
        type="file"
        accept="image/png, image/jpeg"
        multiple={mode === "multiple"}
        onChange={handleFileChange}
        disabled={isUploading || (mode === "multiple" && value?.length >= maxFiles)}
      />
      
      {isUploading && (
        <p className="text-sm text-gray-500">
          {mode === "profile" ? "Subiendo imagen..." : "Subiendo imágenes..."}
        </p>
      )}

      {/* Vista previa */}
      {mode === "profile" ? (
        // Vista para perfil
        <div className="relative inline-block">
          <Avatar className="w-24 h-24">
            <AvatarImage src={value} />
            <AvatarFallback>Foto</AvatarFallback>
          </Avatar>
          {value && (
            <button
              type="button"
              onClick={() => handleRemove()}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
            >
              ×
            </button>
          )}
        </div>
      ) : (
        // Vista para propiedades (múltiples imágenes)
        value?.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-2">
            {value.map((url, index) => (
              <div key={index} className="relative">
                <Image
                  src={url}
                  alt={`Preview ${index}`}
                  className="w-full h-24 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};