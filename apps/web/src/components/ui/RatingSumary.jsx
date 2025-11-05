const RatingSummary = ({ averageRating, reviewCount }) => {
  return (
    <div className="flex items-center gap-4">
      <div className="text-center">
        <span className="text-3xl font-bold block">
          {averageRating > 0 ? averageRating.toFixed(1) : '--'}
        </span>
        <span className="text-sm text-gray-500">
          {reviewCount} {reviewCount === 1 ? 'reseña' : 'reseñas'}
        </span>
      </div>
      <div className="flex flex-col">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`text-xl ${
                star <= Math.round(averageRating) 
                  ? 'text-yellow-400' 
                  : 'text-gray-200'
              }`}
            >
              ★
            </span>
          ))}
        </div>
        <span className="text-sm text-gray-500 mt-1">
          Promedio de valoraciones
        </span>
      </div>
    </div>
  );
};

export default RatingSummary;