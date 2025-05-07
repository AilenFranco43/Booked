import { Avatar } from "@/components/ui/avatar";

export const ReviewCard = ({ review }) => {

//   if (!review || typeof review !== 'object') {
//     return (
//       <div className="border-b border-gray-200 py-6 text-gray-500">
//         Reseña no disponible
//       </div>
//     );
//   }

  // Datos con valores por defecto
  const user = review?.guest || review?.user || {}; 
  const userName = user?.name || 'Usuario anónimo';
  const rating = Math.min(Math.max(review?.rating || 0, 0), 5); // Asegura entre 0-5
  const comment = review?.comment || review?.description || 'Sin descripción'; // Compatibilidad con ambos nombres
  const createdAt = review?.createdAt ? new Date(review.createdAt) : new Date();

  // Formateo de fecha
  const formattedDate = new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(createdAt);

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