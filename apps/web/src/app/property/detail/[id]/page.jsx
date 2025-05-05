"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useProperties } from "../../../../hooks/useProperties";
import { InputSearch } from "../../../../ui/InputSearch";
import { Spinner } from "../../../../ui/Spinner";
import { paymentStripe } from "@/app/api/callApi";
import userImage from "../../../public/Perfil.png";
import { useInputSearch } from "../../../../hooks/useInputSearch";
import Map from "@/components/ui/Map";

const PropertyDetail = () => {
  const params = useParams();
  const router = useRouter();

  // Estados
  const [currentProperty, setCurrentProperty] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeopleQuantity, setSelectedPeopleQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Estado para fechas
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const { startDate, endDate } = dateRange;

  const { searchValues } = useInputSearch();
  const { getPropertyById } = useProperties();

  // Función para calcular días entre fechas
  function countDaysBetweenDates(start, end) {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    return Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  }

  // Efecto para calcular el precio total
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
    setIsLoading(true);
    getPropertyById(params?.id)
      .then((data) => setCurrentProperty(data))
      .catch((error) => router.push("/"))
      .finally(() => setIsLoading(false));
  }, []);

  // Manejar reserva
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

  return (
    <section className="p-8 space-y-8">
      <div className="flex justify-center items-center">
        <InputSearch />
      </div>

      {isLoading && <Spinner />}

      {!isLoading && Object.keys(currentProperty).length > 1 && (
        <div className="flex gap-20">
          <div className="space-y-4 h-fit w-80 bg-slate-50 rounded p-6 border border-slate-200 shadow-md sticky top-4">
            <header className="space-y-2">
              <h2 className="font-semibold">{currentProperty?.title}</h2>
              <p className="font-medium">
                <span className="text-green-600">
                  ${currentProperty?.price}
                </span>
                /la noche
              </p>
            </header>

            {/* Selector de fechas */}
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

            {/* Selector de huéspedes */}
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

            {/* Botón de reserva */}
            <button
              onClick={handleClickReserve}
              className="bg-[#318F51] py-2 rounded-lg w-full font-semibold text-slate-100 hover:bg-[#5FA77C82]/70 transition-colors"
              disabled={!startDate || !endDate}
            >
              Reservar
            </button>

            {/* Total */}
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

          {/* Sección de imágenes y descripción*/}

          <div className="space-y-8 size-[1200px] h-full">
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

            {/* Modal para imágenes */}
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

            {/* Resto del contenido... */}
            <hr className="h-[1px] bg-slate-400 mx-10" />

            <div className="flex font-bold text-xl px-10 gap-20">
              <h3 className="text-slate-700">
                Mejor valorado por los huéspedes
              </h3>
              <div className="flex gap-4">
                <small>4.9 ⭐</small>
                <p>10</p>
              </div>
            </div>

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

            <h3 className="font-bold text-xl px-10 text-slate-700 py-10">
              Conoce a tu anfitrión
            </h3>

            {/* Información del anfitrión */}
            <div className="flex justify-center items-center gap-10 text-slate-700">
              <div className="flex flex-col justify-center items-center p-4 w-[500px]">
                <Image src={userImage} alt="Perfil" width={100} height={100} />
                <strong>Marcelo</strong>
                <span className="py-2">Información confirmada</span>
                <ul>
                  <li>✔ Identidad</li>
                  <li>✔ Correo electrónico</li>
                  <li>✔ Número de teléfono</li>
                </ul>
              </div>

              <div>
                <div className="flex divide-x">
                  <div className="flex flex-col justify-center items-center pr-4 font-bold">
                    <h4>Calificación</h4>
                    4.8 ⭐
                  </div>
                  <div className="flex flex-col justify-center items-center px-4">
                    <strong>1</strong>
                    <small>Año de experiencia como anfitrión</small>
                  </div>
                  <div className="flex flex-col justify-center items-center pl-4 font-bold">
                    <h4>Evaluaciones</h4>
                    <small>8</small>
                  </div>
                </div>

                <hr className="bg-slate-400 my-4" />

                <div className="mx-2 space-y-4">
                  <p>
                    Hola, soy Marcelo, mi viaje ha sido moldeado por el deseo de
                    crear momentos únicos para nuestros huéspedes. Con una
                    pasión por la bienvenida y la atención al detalle,
                    transformamos nuestro Sitio en un refugio donde el confort y
                    la naturaleza se unen en armonía. Si tienes cualquier
                    pregunta, ponte en contacto conmigo.
                  </p>

                  <div className="flex justify-between items-center">
                    <p className="text-amber-500 font-semibold">
                      Envíale un mensaje a tu anfitrión
                    </p>
                    <button className="bg-[#318F51] py-1 px-2 rounded text-slate-50 font-semibold">
                      Toca acá para chatear
                    </button>
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
