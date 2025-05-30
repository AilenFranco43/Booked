import Image from "next/image";
import Link from "next/link";
import { FaStar, FaRegHeart, FaHeart, FaUsers, FaMapMarkerAlt } from 'react-icons/fa';
import { useState } from 'react';
import PropTypes from 'prop-types';

export const CardProperty = ({ property }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Diccionario de traducción de tags
  const TAGS_TRANSLATION = {
    "beachfront": "Playa en frente",
    "wifi": "Wifi",
    "pets allowed": "Se permiten mascotas",
    "pool": "Piscina",
    "with furniture": "Amueblada",
    "Smoking is allowed": "Se permite fumar",
    "private parking": "Estacionamiento Privado",
    "workspace": "Espacio de trabajo"
  };

  // Verificación profunda de la propiedad
  if (!property || typeof property !== 'object') {
    console.error('Propiedad inválida:', property);
    return (
      <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200 text-red-500">
        Error al cargar la propiedad
      </div>
    );
  }

  const {
    title = 'Propiedad sin título',
    description = '',
    price = 0,
    photos = [],
    tags = [],
    _id = property.id || '',
    id = property._id || _id,
    max_people = 1,
    averageRating = 0,
    reviewCount = 0,
    location = '',
    address = ''
  } = property;

  const propertyId = _id || id;
  const ratingValue = Number(averageRating) || 0;
  const reviewCountValue = Number(reviewCount) || 0;
  const photoUrl = photos?.[0] || "https://agentrealestateschools.com/wp-content/uploads/2021/11/real-estate-property.jpg";

  // Funciones de ayuda
  const truncateText = (text = '', maxLength = 100) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const capitalizeFirstLetter = (string = '') => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Función para traducir tags
  const translateTag = (tag) => {
    return TAGS_TRANSLATION[tag.toLowerCase()] || tag;
  };

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
            priority={false}
          />
          
          {/* Overlay de gradiente */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
          
          {/* TOP badge - siempre visible si cumple el rating */}
          {ratingValue >= 4.5 && (
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
          {/* Tags - ahora traducidos */}
          {tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-[#5FA777] text-white text-xs font-medium px-3 py-1 rounded-full shadow-sm"
                >
                  {translateTag(tag)}
                </span>
              ))}
            </div>
          )}

          {/* Titulo y ubicación */}
          <h3 className="font-bold text-lg mb-1 line-clamp-1 text-gray-800">
            {capitalizeFirstLetter(title)}
          </h3>
          <div className="flex items-center text-gray-600 text-sm mb-3">
            <FaMapMarkerAlt className="mr-1.5 text-[#5FA777]" />
            <span className="truncate">
              {capitalizeFirstLetter(location || address || 'Ubicación no disponible')}
            </span>
          </div>

          {/* Rating - siempre visible */}
          <div className="flex items-center mb-4">
            <div className="flex items-center mr-2 bg-gray-100 px-2 py-1 rounded-full">
              <FaStar className="text-yellow-400 mr-1.5" />
              <span className="font-semibold text-sm text-gray-700">
                {ratingValue.toFixed(1)}
              </span>
            </div>
            <span className="text-gray-500 text-sm">
              ({reviewCountValue} {reviewCountValue === 1 ? 'reseña' : 'reseñas'})
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
              <p className="text-lg font-bold text-[#5FA777]">${price.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-0.5">por noche</p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};
