"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Components
import { Avatar } from "@/components/ui/avatar";
import { InputSearch } from "../../../../ui/InputSearch";
import { Spinner } from "../../../../ui/Spinner";
import Map from "@/components/ui/Map";
import RatingForm from "@/components/ui/RatingForm";
import RatingSummary from "@/components/ui/RatingSumary";
import { ReviewCard } from "@/components/ui/ReviewCard";

// Hooks
import { useProperties } from "../../../../hooks/useProperties";
import { useInputSearch } from "../../../../hooks/useInputSearch";
import { useAuth } from "@/hooks/useAuth";

// Utils
import { countDaysBetweenDates } from "@/utils/dateHelpers";

// API
import {
  paymentStripe,
  getUserById,
  getReviewsByProperty,
  deleteReview,
} from "@/app/api/callApi";

const PropertyDetail = () => {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser } = useAuth();

  const { searchValues } = useInputSearch();
  const { getPropertyById } = useProperties();

  // States
  const [currentProperty, setCurrentProperty] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [hostData, setHostData] = useState(null);
  const [selectedPeopleQuantity, setSelectedPeopleQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const { startDate, endDate } = dateRange;
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
        .then((userData) => setHostData(userData))
        .catch((error) => console.error("Error fetching host data:", error));
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

          if (data.reviews?.length > 0) {
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

  const handleClickReserve = async () => {
    if (!startDate || !endDate) {
      alert("Please select check-in and check-out dates");
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
      alert("Error processing payment");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const previousReviews = [...reviews];
      setReviews((prev) =>
        prev.filter((r) => r.id !== reviewId && r._id !== reviewId)
      );

      await deleteReview(reviewId);

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
      setReviews(previousReviews);
      console.error("Error deleting review:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const TAGS_TRANSLATION = {
    beachfront: "Frente a la playa",
    wifi: "WiFi",
    "pets allowed": "Se permiten mascotas",
    pool: "Con piscina",
    "with furniture": "Amueblado",
    "Smoking is allowed": "Permitido fumar",
    "private parking": "Estacionamiento privado",
    workspace: "Espacio de trabajo",
  };

  const translateTag = (tag) => {
    return TAGS_TRANSLATION[tag.toLowerCase()] || tag;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Bar */}
      <div className="bg-white shadow-sm py-4 px-6  top-0 z-10 flex ">
        <div className="max-w-7xl mx-auto">
          <InputSearch />
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <Spinner size="lg" />
          </div>
        ) : Object.keys(currentProperty).length > 1 ? (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Property Details */}
            <div className="flex-1">
              {/* Property Header */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">
                  {currentProperty.title.charAt(0).toUpperCase() + currentProperty.title.slice(1).toLowerCase()}
                </h1>
                <div className="flex items-center mt-2">
                 
                  <span className="text-gray-600">
                    {currentProperty.location}
                  </span>
                </div>
              </div>

              {/* Image Gallery */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-8">
                {currentProperty.photos?.length > 0 ? (
                  <>
                    <div className="md:col-span-2 md:row-span-2">
                      <div
                        className="relative h-80 w-full rounded-xl overflow-hidden cursor-pointer bg-gray-200"
                        onClick={() => {
                          setCurrentImageIndex(0);
                          setSelectedImage(currentProperty.photos[0]);
                          setIsModalOpen(true);
                        }}
                      >
                        <Image
                          src={currentProperty.photos[0]}
                          alt={`Main photo of ${currentProperty.title}`}
                          fill
                          className="object-cover hover:opacity-90 transition-opacity"
                          priority
                        />
                      </div>
                    </div>
                    {currentProperty.photos.slice(1, 5).map((photo, index) => (
                      <div
                        key={index}
                        className={`relative h-40 rounded-xl overflow-hidden cursor-pointer bg-gray-200 ${
                          index === 3 ? "hidden md:block" : ""
                        }`}
                        onClick={() => {
                          const clickedIndex =
                            currentProperty.photos.indexOf(photo);
                          setCurrentImageIndex(clickedIndex);
                          setSelectedImage(photo);
                          setIsModalOpen(true);
                        }}
                      >
                        <Image
                          src={photo}
                          alt={`Photo ${index + 1} of ${currentProperty.title}`}
                          fill
                          className="object-cover hover:opacity-90 transition-opacity"
                        />
                        {index === 2 && currentProperty.photos.length > 4 && (
                          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                            <span className="text-white font-bold text-xl">
                              +{currentProperty.photos.length - 4} más
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="col-span-4 h-80 bg-gray-200 rounded-xl flex items-center justify-center">
                    <p className="text-gray-500">No hay imágenes disponibles</p>
                  </div>
                )}
              </div>

              {/* Property Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {/* Left Column */}
                <div className="md:col-span-2">
                  {/* Host Info */}
                  <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="flex items-start gap-4">
                      <Avatar
                        src={hostData?.avatar}
                        alt={hostData?.name}
                        size="lg"
                      />
                      <div>
                        <h3 className="text-xl font-semibold">
                          Alojamiento ofrecido por {hostData?.name || "Unknown"}
                        </h3>
                        
                        <div className="mt-4 flex items-center gap-2 text-sm">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center gap-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Anfitrión verificado
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <h4 className="font-semibold mb-2">Sobre este alojamiento</h4>
                      <p className="text-gray-700">
                        {currentProperty.description ||
                          "No description provided."}
                      </p>
                    </div>
                  </div>

                  {/* Amenities */}
                  {currentProperty.tags?.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                      <h3 className="text-xl font-semibold mb-4">Características</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {currentProperty.tags.map((tag, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 text-gray-700"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-green-600"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {translateTag(tag)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Reviews Section */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-semibold">
                        <span className="text-gray-900">
                          {averageRating.toFixed(1)}
                        </span>{" "}
                        <span className="text-gray-600">
                          ({reviewCount} reseñas)
                        </span>
                      </h3>
                      <RatingSummary
                        averageRating={averageRating}
                        reviewCount={reviewCount}
                      />
                    </div>

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
                          Esta propiedad aún no tiene reseñas
                        </p>
                      </div>
                    )}

                    {currentUser && (
                      <div className="mt-8">
                        <RatingForm
                          propertyId={currentProperty.id}
                          guestId={currentUser?.id}
                          onSuccess={() => {
                            // Recargar las reseñas después de enviar una nueva
                            getReviewsByProperty(currentProperty.id)
                              .then((data) => {
                                setReviews(data.reviews || []);
                                if (data.reviews?.length > 0) {
                                  const avg =
                                    data.reviews.reduce(
                                      (sum, review) => sum + review.rating,
                                      0
                                    ) / data.reviews.length;
                                  setAverageRating(avg);
                                  setReviewCount(data.reviews.length);
                                }
                              })
                              .catch(console.error);
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column - Booking Widget */}
                <div className="md:col-span-1">
                  <div className="sticky top-6">
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                      {/* Price */}
                      <div className="p-6 border-b border-gray-100">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-2xl font-bold text-gray-900">
                              ${currentProperty.price}
                            </span>
                            <span className="text-gray-600"> / noche</span>
                          </div>
                          <div className="flex items-center">
                            <RatingSummary
                              averageRating={averageRating}
                              reviewCount={reviewCount}
                              compact={true}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Date Picker */}
                      <div className="p-6 border-b border-gray-100">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Seleccionar fechas
                            </label>
                            <DatePicker
                              selectsRange
                              startDate={startDate}
                              endDate={endDate}
                              onChange={(update) => {
                                if (currentUser) {
                                  const [start, end] = update;
                                  setDateRange({
                                    startDate: start,
                                    endDate: end,
                                  });
                                } else {
                                  router.push("/register");
                                }
                              }}
                              minDate={new Date()}
                              placeholderText={
                                currentUser ? "Select dates" : "Sign up to book"
                              }
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                              dateFormat="MMM d, yyyy"
                              isClearable
                              monthsShown={2}
                              shouldCloseOnSelect={false}
                              disabled={!currentUser}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Huéspedes
                            </label>
                            <div className="flex items-center justify-between">
                              <span>{selectedPeopleQuantity} Huéspedes</span>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() =>
                                    setSelectedPeopleQuantity((prev) =>
                                      Math.max(1, prev - 1)
                                    )
                                  }
                                  disabled={selectedPeopleQuantity <= 1}
                                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full disabled:opacity-50"
                                >
                                  -
                                </button>
                                <button
                                  onClick={() =>
                                    setSelectedPeopleQuantity((prev) =>
                                      Math.min(
                                        currentProperty.max_people,
                                        prev + 1
                                      )
                                    )
                                  }
                                  disabled={
                                    selectedPeopleQuantity >=
                                    currentProperty.max_people
                                  }
                                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full disabled:opacity-50"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Price Breakdown */}
                      <div className="p-6 border-b border-gray-100">
                        <button
                          onClick={
                            currentUser
                              ? handleClickReserve
                              : () => router.push("/register")
                          }
                          disabled={!startDate || !endDate}
                          className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
                            startDate && endDate
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-gray-400 cursor-not-allowed"
                          }`}
                        >
                          {currentUser ? "Reservar" : "Regístrate para reservar"}
                        </button>

                        {startDate && endDate && (
                          <div className="mt-4 space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600 underline">
                                ${currentProperty.price} ×{" "}
                                {countDaysBetweenDates(startDate, endDate)}{" "}
                                noches
                              </span>
                              <span>${totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-medium">
                              <span>Total</span>
                              <span>${totalPrice.toFixed(2)}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Contact Host */}
                      <div className="p-6">
                        <button
                          onClick={() => {
                            if (hostData?.email) {
                              window.location.href = `mailto:${hostData.email}?subject=Question about ${currentProperty.title}`;
                            }
                          }}
                          className="w-full py-2 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                          disabled={!hostData?.email}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                          Contactar anfitrión
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Map */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                <h3 className="text-xl font-semibold mb-4">Ubicación</h3>
                <div className="h-96 rounded-lg overflow-hidden">
                  <Map
                    latitude={currentProperty.coordinates?.latitude}
                    longitude={currentProperty.coordinates?.longitude}
                    interactive={true}
                  />
                </div>
                
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium text-gray-600">
              Propiedad no encontrada
            </h2>
            <button
              onClick={() => router.push("/")}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Buscar propiedades
            </button>
          </div>
        )}
      </main>

      {/* Image Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-6 right-6 text-white p-2 rounded-full hover:bg-gray-800 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <button
            onClick={() => {
              setCurrentImageIndex(
                (prev) =>
                  (prev - 1 + currentProperty.photos.length) %
                  currentProperty.photos.length
              );
              setSelectedImage(currentProperty.photos[currentImageIndex]);
            }}
            className="absolute left-6 text-white p-4 rounded-full hover:bg-gray-800 transition-colors"
            disabled={currentProperty.photos.length <= 1}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div className="relative max-w-6xl w-full max-h-[90vh] flex items-center justify-center">
            <img
              src={selectedImage}
              alt="Enlarged view"
              className="max-w-full max-h-[90vh] object-contain"
            />
            <div className="absolute bottom-6 left-0 right-0 text-center text-white">
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
            className="absolute right-6 text-white p-4 rounded-full hover:bg-gray-800 transition-colors"
            disabled={currentProperty.photos.length <= 1}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default PropertyDetail;
