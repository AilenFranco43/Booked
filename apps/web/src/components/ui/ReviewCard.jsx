import { Avatar } from "@/components/ui/avatar";
import { useState, useEffect } from "react"; // Importá useEffect
import { getUserById } from "@/app/api/callApi";

export const ReviewCard = ({ review, currentUserId, onDelete }) => {
   console.log("ReviewCard render - review.guest:", review?.guest);
  const [isDeleting, setIsDeleting] = useState(false);
  const [user, setUser] = useState(
    typeof review.guest === "object" ? review.guest : {}
  );

  useEffect(() => {
    async function fetchUser() {
      try {
        // Si guest es un string (ID), buscamos el usuario completo
        if (typeof review.guest === "string") {
          const fetchedUser = await getUserById(review.guest);
          console.log("Datos completos del usuario:", fetchedUser);
          setUser(fetchedUser);
        } 
        // Si guest es un objeto pero no tiene avatar, también lo buscamos
        else if (typeof review.guest === "object" && !review.guest.avatar) {
          const fetchedUser = await getUserById(review.guest._id);
          console.log("Datos completos del usuario:", fetchedUser);
          setUser(fetchedUser);
        }
        // Si ya tiene todos los datos (incluyendo avatar), lo usamos directamente
        else {
          setUser(review.guest);
        }
      } catch (error) {
        console.error("Error al obtener usuario:", error);
      }
    }
    
    fetchUser();
  }, [review.guest]);

  // Datos con valores por defecto
  const userName = user?.name || "Usuario anónimo";
  const userId = user?.id || user?._id;
  const rating = Math.min(Math.max(review?.rating || 0, 0), 5);
  const comment = review?.comment || review?.description || "Sin descripción";
  const createdAt = review?.createdAt ? new Date(review.createdAt) : new Date();

  // Formateo de fecha
  const formattedDate = new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(createdAt);

  // Función para manejar la eliminación
  const handleDelete = async () => {
    if (!window.confirm("¿Estás seguro de eliminar esta reseña?")) return;

    setIsDeleting(true);
    try {
      
      const reviewId = review.id || review._id;
      if (!reviewId) throw new Error("No se pudo identificar la reseña");

      await onDelete(reviewId);
    } catch (error) {
      console.error("Error en ReviewCard:", {
        error: error.message,
        reviewId: review.id || review._id,
        userId: currentUserId,
      });
      
    } finally {
      setIsDeleting(false);
    }
  };
  console.log("Avatar props:", {
  src: user?.avatar,
  alt: userName,
  userData: user
});

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
            <time
              dateTime={createdAt.toISOString()}
              className="text-gray-500 text-sm"
            >
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
                className={`text-lg ${
                  star <= rating ? "text-yellow-400" : "text-gray-200"
                }`}
              >
                ★
              </span>
            ))}
          </div>

          <p className="mt-2 text-gray-700 whitespace-pre-line">{comment}</p>
        </div>
      </div>
    </article>
  );
};
