"use client";

// Importaciones de librerías externas
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Importaciones de componentes locales
import { Avatar } from "@/components/ui/avatar";
import { InputSearch } from "../../../../ui/InputSearch";
import { Spinner } from "../../../../ui/Spinner";
import Map from "@/components/ui/Map";
import RatingForm from "@/components/ui/RatingForm";
import RatingSummary from "@/components/ui/RatingSumary";

import { ReviewCard } from "@/components/ui/ReviewCard";

// Importaciones de hooks personalizados
import { useProperties } from "../../../../hooks/useProperties";
import { useInputSearch } from "../../../../hooks/useInputSearch";
import { useAuth } from "@/hooks/useAuth";

// Importaciones de API
import {
  paymentStripe,
  getUserById,
  getReviewsByProperty,
  deleteReview,
} from "@/app/api/callApi";

const PropertyDetail = () => {
  // Hooks de routing y autenticación
  const params = useParams();
  const router = useRouter();
  const { user: currentUser } = useAuth();

  // Hooks personalizados
  const { searchValues } = useInputSearch();
  const { getPropertyById } = useProperties();

  // Estados principales
  const [currentProperty, setCurrentProperty] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [hostData, setHostData] = useState(null);

  // Estados para reserva
  const [selectedPeopleQuantity, setSelectedPeopleQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const { startDate, endDate } = dateRange;

  // Estados para reseñas
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);

  // Estados para galería de imágenes
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Efectos
  useEffect(() => {
    setIsLoading(true);
    getPropertyById(params?.id)
      .then((data) => setCurrentProperty(data))
      .catch((error) => router.push("/"))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (currentProperty.userId) {
      getUserById(currentProperty.userId)
        .then((userData) => {
          setHostData(userData);
        })
        .catch((error) => {
          console.error("Error al obtener datos del propietario:", error);
        });
    }
  }, [currentProperty.userId]);

  useEffect(() => {
    if (startDate && endDate) {
      const totalDays = countDaysBetweenDates(startDate, endDate);
      const total = Number(currentProperty?.price) * totalDays;
      setTotalPrice(total);
    } else {
      setTotalPrice(0);
    }
  }, [startDate, endDate, currentProperty]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (currentProperty.id) {
        setIsLoadingReviews(true);
        try {
          const data = await getReviewsByProperty(currentProperty.id);
          setReviews(data.reviews || []);

          // Calcular el promedio si no viene del backend
          if (data.reviews && data.reviews.length > 0) {
            const avg =
              data.reviews.reduce((sum, review) => sum + review.rating, 0) /
              data.reviews.length;
            setAverageRating(avg);
            setReviewCount(data.reviews.length);
          } else {
            setAverageRating(0);
            setReviewCount(0);
          }
        } catch (error) {
          console.error("Error fetching reviews:", error);
          setReviews([]);
          setAverageRating(0);
          setReviewCount(0);
        } finally {
          setIsLoadingReviews(false);
        }
      }
    };

    fetchReviews();
  }, [currentProperty.id]);

  // Funciones auxiliares
  function countDaysBetweenDates(start, end) {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    return Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  }

  const handleClickReserve = async () => {
    if (!startDate || !endDate) {
      alert("Por favor selecciona fechas de check-in y check-out");
      return;
    }

    const payment = {
      name: currentProperty.title,
      description: currentProperty.description,
      currency: "USD",
      unit_amount: totalPrice * 100,
      quantity: 1,
      success_url: `${window.location.origin}/success`,
      cancel_url: `${window.location.origin}/cancel`,
    };

    try {
      const responseUrl = await paymentStripe(payment);
      if (responseUrl) window.location.href = responseUrl;
    } catch (error) {
      alert("Error al procesar el pago");
    }
  };
  // Función para manejar la eliminación de reseñas
  const handleDeleteReview = async (reviewId) => {
    try {
      // Optimistic update (actualización inmediata antes de la respuesta del servidor)
      const previousReviews = [...reviews];
      setReviews((prev) =>
        prev.filter((r) => r.id !== reviewId && r._id !== reviewId)
      );

      // Intenta eliminar en el servidor
      await deleteReview(reviewId);

      // Recalcular promedio
      const updatedReviews = previousReviews.filter(
        (r) => r.id !== reviewId && r._id !== reviewId
      );

      if (updatedReviews.length > 0) {
        const avg =
          updatedReviews.reduce((sum, r) => sum + r.rating, 0) /
          updatedReviews.length;
        setAverageRating(avg);
      } else {
        setAverageRating(0);
      }
      setReviewCount(updatedReviews.length);
    } catch (error) {
      // Si falla, revertir los cambios
      setReviews(previousReviews);
      console.error("Error completo al eliminar:", {
        message: error.message,
        reviewId,
        currentUser: currentUser?.id,
      });
      alert(`Error al eliminar: ${error.message}`);
    }
  };

  return (
    <section className="p-8 space-y-8">
      <div className="flex justify-center items-center">
        <InputSearch />
      </div>

      {isLoading && <Spinner />}

      {!isLoading && Object.keys(currentProperty).length > 1 && (
        <div className="flex gap-20">
          {/* Panel de reserva */}
          <div className="space-y-4 h-fit w-80 bg-slate-50 rounded p-6 border border-slate-200 shadow-md sticky top-4">
            <header className="space-y-2">
              <h2 className="font-semibold">
                {currentProperty?.title
                  ? currentProperty.title.charAt(0).toUpperCase() +
                    currentProperty.title.slice(1).toLowerCase()
                  : ""}
              </h2>
              <p className="font-medium">
                <span className="text-green-600">
                  ${currentProperty?.price}
                </span>
                /la noche
              </p>
            </header>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Fechas de estadía
              </label>
              <DatePicker
                selectsRange
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => {
                  const [start, end] = update;
                  setDateRange({
                    startDate: start,
                    endDate: end,
                  });
                }}
                minDate={new Date()}
                placeholderText="Check-in → Check-out"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                dateFormat="dd/MM/yyyy"
                isClearable
                monthsShown={2}
                shouldCloseOnSelect={false}
              />
              {startDate && endDate && (
                <p className="text-sm text-gray-600">
                  {countDaysBetweenDates(startDate, endDate)} noches
                  seleccionadas
                </p>
              )}
            </div>

            <div>
              <label htmlFor="">Huéspedes: {selectedPeopleQuantity}</label>
              <input
                type="range"
                name="peopleQuantity"
                min={1}
                max={20}
                className="w-full accent-[#318F51]"
                onChange={(data) =>
                  setSelectedPeopleQuantity(data.target.value)
                }
                value={selectedPeopleQuantity}
              />
            </div>

            <button
              onClick={handleClickReserve}
              className="bg-[#318F51] py-2 rounded-lg w-full font-semibold text-slate-100 hover:bg-[#5FA77C82]/70 transition-colors"
              disabled={!startDate || !endDate}
            >
              Reservar
            </button>

            <div className="text-center">
              <strong>Total: ${totalPrice.toFixed(2)}</strong>
              {startDate && endDate && (
                <p className="text-sm text-gray-600">
                  {countDaysBetweenDates(startDate, endDate)} noches × $
                  {currentProperty?.price}
                </p>
              )}
            </div>
          </div>

          {/* Contenido principal */}
          <div className="space-y-8 size-[1200px] h-full">
            {/* Galería de imágenes */}
            <div className="p-4 grid grid-cols-8 gap-2 bg-[#5FA77738] rounded-xl max-w-4xl mx-auto">
              {currentProperty.photos?.length > 0 ? (
                <>
                  <img
                    className="col-span-5 row-span-2 w-full h-full object-cover cursor-pointer"
                    src={currentProperty.photos[0]}
                    alt={`Portada de ${currentProperty.title}`}
                    onClick={() => {
                      setCurrentImageIndex(0);
                      setSelectedImage(currentProperty.photos[0]);
                      setIsModalOpen(true);
                    }}
                  />
                  {currentProperty.photos.slice(1, 4).map((photo, index) => (
                    <img
                      key={index}
                      className={`${index === 0 ? "col-start-6 col-span-3 w-full" : ""} 
                                  ${index === 1 ? "col-start-6 col-span-3" : ""} 
                                  ${index === 2 ? "col-start-4 col-span-3" : ""}`}
                      src={photo}
                      alt={`Imagen ${index + 1} de ${currentProperty.title}`}
                      onClick={() => {
                        const clickedIndex =
                          currentProperty.photos.indexOf(photo);
                        setCurrentImageIndex(clickedIndex);
                        setSelectedImage(photo);
                        setIsModalOpen(true);
                      }}
                    />
                  ))}
                </>
              ) : (
                <p className="col-span-8 text-center py-10">
                  No hay imágenes disponibles
                </p>
              )}

              <div className="col-span-8 pt-4">
                <h2>{currentProperty.description}</h2>
              </div>
            </div>

            {/* Modal de imagen */}
            {isModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 h-full top-[-30px]">
                <button
                  onClick={() => {
                    setCurrentImageIndex(
                      (prev) =>
                        (prev - 1 + currentProperty.photos.length) %
                        currentProperty.photos.length
                    );
                    setSelectedImage(currentProperty.photos[currentImageIndex]);
                  }}
                  className="text-white text-4xl p-4 hover:text-gray-300 absolute left-4"
                  disabled={currentProperty.photos.length <= 1}
                >
                  ◀
                </button>

                <div className="relative max-w-4xl w-full max-h-[70vh]">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="absolute top-0 right-0 text-white text-2xl hover:text-gray-300"
                  >
                    ✕
                  </button>
                  <img
                    src={selectedImage}
                    alt="Imagen ampliada"
                    className="w-full h-auto max-h-[70vh] object-contain"
                  />
                  <div className="absolute bottom-4 left-0 right-0 text-center text-white">
                    {currentImageIndex + 1} / {currentProperty.photos.length}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setCurrentImageIndex(
                      (prev) => (prev + 1) % currentProperty.photos.length
                    );
                    setSelectedImage(currentProperty.photos[currentImageIndex]);
                  }}
                  className="text-white text-4xl p-4 hover:text-gray-300 absolute right-4"
                  disabled={currentProperty.photos.length <= 1}
                >
                  ▶
                </button>
              </div>
            )}

            <hr className="h-[1px] bg-slate-400 mx-10" />

            <hr className="h-[1px] bg-slate-400 mx-10" />

            {/* Promedio de valoraciones */}
            <div className="flex justify-between items-center px-10">
              <h3 className="font-bold text-xl text-slate-700">
                Valoración de los huéspedes
              </h3>
              <RatingSummary
                averageRating={averageRating}
                reviewCount={reviewCount}
              />
            </div>

            <hr className="h-[1px] bg-slate-400 mx-10" />

            <hr className="h-[1px] bg-slate-400 mx-10" />

            {/* Mapa */}
            <div className="space-y-20">
              <h3 className="font-bold text-xl px-10 text-slate-700">
                Acá es donde vas a estar
              </h3>
              <Map
                latitude={currentProperty.coordinates?.latitude}
                longitude={currentProperty.coordinates?.longitude}
              />
            </div>

            {/* Información del anfitrión */}
            <div className="flex justify-center items-center gap-10 text-slate-700">
              <div className="flex flex-col justify-center items-center w-[400px]">
                <h3 className="font-bold text-xl px-10 text-slate-700 pt-10">
                  Conoce a tu anfitrión
                </h3>
                <Avatar src={hostData?.avatar} alt={hostData?.name} />
                <strong>{hostData?.name}</strong>
                <span className="py-2">Información confirmada</span>
                <ul>
                  <li>✔ Identidad</li>
                  <li>✔ Correo electrónico</li>
                  <li>✔ Número de teléfono</li>
                </ul>
              </div>

              <div>
                <div className="flex divide-x">
                  {/* Sección de Reseñas */}
                  <div className="mt-12 px-10">
                    <h3 className="font-bold text-2xl text-slate-700 mb-6">
                      Reseñas de los huéspedes
                    </h3>

                    {isLoadingReviews ? (
                      <div className="flex justify-center py-8">
                        <Spinner />
                      </div>
                    ) : reviews.length > 0 ? (
                      <div className="space-y-6">
                        {reviews.map((review) => (
                          <ReviewCard
                            key={review._id || review.id}
                            review={review}
                            currentUserId={currentUser?.id}
                            onDelete={handleDeleteReview}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="bg-gray-50 p-6 rounded-lg text-center">
                        <p className="text-gray-500">
                          Esta propiedad aún no tiene reseñas. Sé el primero en
                          opinar.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <RatingForm
                    propertyId={currentProperty.id}
                    guestId={currentUser?.id}
                    onSuccess={() => {
                      // Recargar las reseñas después de enviar una nueva
                      fetchReviews();
                    }}
                  />
                </div>

                <hr className="bg-slate-400 my-4" />

                <div className="mx-2 space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-amber-500 font-semibold">
                      Envíale un mensaje a tu anfitrión
                    </p>
                    {hostData?.email ? (
                      <a
                        href={`mailto:${hostData.email}?subject=Consulta sobre ${currentProperty.title}`}
                        className="bg-[#318F51] py-1 px-2 rounded text-slate-50 font-semibold hover:bg-[#5FA77C] transition-colors"
                      >
                        Enviar correo
                      </a>
                    ) : (
                      <p className="text-gray-500">Contacto no disponible</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PropertyDetail;
