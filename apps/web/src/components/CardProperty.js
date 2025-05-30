import Image from "next/image";
import Link from "next/link";
import { FaStar, FaRegHeart, FaHeart, FaUsers, FaMapMarkerAlt } from 'react-icons/fa';
import { useState } from 'react';

export const CardProperty = ({ property }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  
  if (!property || (!property._id && !property.id)) {
    console.error('Propiedad inválida:', property);
    return null;
  }

  // Usar id o _id según lo que venga
  // const propertyId = property._id || property.id;
  
  const {
    title,
    description,
    price,
    photos,
    tags,
    propertyId = property._id || property.id,
    max_people,
    averageRating,
    reviewCount,
    location,
    address
  } = property;

  const truncateText = (text, maxLength = 100) => {
    return text?.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const capitalizeFirstLetter = (string) => {
    return string?.charAt(0).toUpperCase() + string?.slice(1);
  };

  const photoUrl = photos?.[0] || "https://agentrealestateschools.com/wp-content/uploads/2021/11/real-estate-property.jpg";

  return (
    <div className="relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200">
      <Link href={`/property/detail/${propertyId}`} className="block">
        {/* Imagen con overlay */}
        <div className="relative h-52 w-full">
          <Image
            src={photoUrl}
            fill
            alt={`Photo of ${title}`}
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Overlay de gradiente */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
          
          {/* TOP badge */}
          {averageRating >= 4.5 && (
            <div className="absolute top-3 left-3 bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-sm">
              ⭐ TOP
            </div>
          )}
          
          {/* Botón de favoritos */}
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
            className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors shadow-sm"
            aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
          >
            {isFavorite ? (
              <FaHeart className="text-red-500 text-lg" />
            ) : (
              <FaRegHeart className="text-gray-700 text-lg" />
            )}
          </button>
        </div>

        {/* Contenido de la card */}
        <div className="p-4 bg-white flex flex-col gap-2">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {tags?.map((tag, index) => (
              <span
                key={index}
                className="bg-[#5FA777] text-white text-xs font-medium px-3 py-1 rounded-full shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Titulo y ubicación */}
          <h3 className="font-bold text-lg mb-1 line-clamp-1 text-gray-800">
            {capitalizeFirstLetter(title)}
          </h3>
          <div className="flex items-center text-gray-600 text-sm mb-3">
            <FaMapMarkerAlt className="mr-1.5 text-[#5FA777]" />
            <span className="truncate">{capitalizeFirstLetter(location || address || 'Ubicación no disponible')}</span>
          </div>

          {/* Rating */}
          <div className="flex items-center mb-4">
            <div className="flex items-center mr-2 bg-gray-100 px-2 py-1 rounded-full">
              <FaStar className="text-yellow-400 mr-1.5" />
              <span className="font-semibold text-sm text-gray-700">
                {averageRating?.toFixed(1) || 'Nuevo'}
              </span>
            </div>
            <span className="text-gray-500 text-sm">
              ({reviewCount || 0} {reviewCount === 1 ? 'reseña' : 'reseñas'})
            </span>
          </div>

          {/* Descripción */}
          <p className="text-gray-600 text-sm mb-5 line-clamp-2">
            {truncateText(capitalizeFirstLetter(description), 100)}
          </p>

          {/* Capacidad y precio */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <div className="flex items-center text-gray-600 text-sm bg-gray-50 px-3 py-1.5 rounded-full">
              <FaUsers className="mr-2 text-[#5FA777]" />
              <span>{max_people} personas</span>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-[#5FA777]">${price?.toLocaleString() || '0'}</p>
              <p className="text-xs text-gray-500 mt-0.5">por noche</p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};