import { Avatar } from "@/components/ui/avatar";
import { useState } from "react";

export const ReviewCard = ({ review, currentUserId, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Datos con valores por defecto
  const user = review?.guest || review?.user || {}; 
  const userName = user?.name || 'Usuario anónimo';
  const userId = user?.id || user?._id;
  const rating = Math.min(Math.max(review?.rating || 0, 0), 5);
  const comment = review?.comment || review?.description || 'Sin descripción';
  const createdAt = review?.createdAt ? new Date(review.createdAt) : new Date();

  // Formateo de fecha
  const formattedDate = new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(createdAt);

  // Función para manejar la eliminación
 const handleDelete = async () => {
  if (!window.confirm("¿Estás seguro de eliminar esta reseña?")) return;
  
  setIsDeleting(true);
  try {
    // Pasar el ID correcto (probamos ambos posibles campos)
    const reviewId = review.id || review._id;
    if (!reviewId) throw new Error("No se pudo identificar la reseña");
    
    await onDelete(reviewId);
  } catch (error) {
    console.error("Error en ReviewCard:", {
      error: error.message,
      reviewId: review.id || review._id,
      userId: currentUserId
    });
    // No mostrar alert aquí, ya se maneja en handleDeleteReview
  } finally {
    setIsDeleting(false);
  }
};
  return (
    <article className="border-b border-gray-200 py-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <Avatar 
            src={user?.avatar} 
            alt={userName}
            fallback={
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-600 font-medium">
                {userName.charAt(0).toUpperCase()}
              </div>
            }
            className="h-12 w-12"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <h3 className="text-base font-medium text-gray-900 truncate">
              {userName}
            </h3>
            <span className="text-gray-400">·</span>
            <time dateTime={createdAt.toISOString()} className="text-gray-500 text-sm">
              {formattedDate}
            </time>
            
            {/* Botón de eliminar (solo visible para el autor) */}
            {userId === currentUserId && (
              <button 
                onClick={handleDelete}
                disabled={isDeleting}
                className="ml-auto text-red-500 hover:text-red-700 text-sm font-medium"
              >
                {isDeleting ? "Eliminando..." : "Eliminar comentario"}
              </button>
            )}
          </div>
          
          <div className="flex items-center mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-lg ${star <= rating ? 'text-yellow-400' : 'text-gray-200'}`}
              >
                ★
              </span>
            ))}
          </div>
          
          <p className="mt-2 text-gray-700 whitespace-pre-line">
            {comment}
          </p>
        </div>
      </div>
    </article>
  );
};