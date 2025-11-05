"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Datepicker from 'react-tailwindcss-datepicker';
import { HomeCard } from './components/HomeCard';
// import imagebuenosaires from './public/buenosaires.png';
import imagefooter from './public/footer.png';
import imagedestino1 from './public/destino1.png';
import imagedestino2 from './public/destino1.png';
import imagefondohome from './public/fondohome.png';
// import imagemardelplata from './public/mardelplata.png';
// import imagemendoza from './public/mendoza.png';
// import imagesalta from './public/salta.png';
import imagetopbar from './public/topbar.png';
// import imageperfil from './public/Perfil.png';

const App = () => {
  const [dateIda, setDateIda] = useState({ startDate: null, endDate: null });
  const [dateVuelta, setDateVuelta] = useState({ startDate: null, endDate: null });
  const [pasajeros, setPasajeros] = useState(1);
  const [destinosVisible, setDestinosVisible] = useState(false);
  const [destinoSeleccionado, setDestinoSeleccionado] = useState("Seleccionar destino");
  const [mostrarPasajeros, setMostrarPasajeros] = useState(false);
  const [showDatepickerIda, setShowDatepickerIda] = useState(false);
  const [showDatepickerVuelta, setShowDatepickerVuelta] = useState(false);

  const destinos = [
    "Cancún", "Barcelona", "Mendoza", "Nueva York", "Salta", "Tokio",
    "Londres", "Mar del Plata", "París", "Bali", "Sídney", "Buenos Aires"
  ];

  // const alojamientos = [
  //   imagebuenosaires,
  //   imagemardelplata,
  //   imagemendoza,
  //   imagesalta
  // ];

  return (
    <>
      <main className="relative h-screen flex flex-col items-center justify-center mt-0 overflow-hidden">
        <Image
          src={imagefondohome}
          alt="Fondo Home"
          layout="fill"
          objectFit="cover"
          className="z-0"
        />
        <h1 className="flex items-center justify-center font-bold text-white absolute text-[70px] top-20">Encuentra tu lugar ideal</h1>

        <div className="relative z-10 text-center">

          <div className="flex space-x-6 mt-20">
            <button
              onClick={() => setDestinosVisible(!destinosVisible)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              {destinoSeleccionado}
            </button>
            {destinosVisible && (
              <div className="absolute bg-white shadow-lg rounded mt-2">
                {destinos.map((destino, index) => (
                  <div
                    key={index}
                    className="p-2 hover:bg-gray-200 cursor-pointer"
                    onClick={() => {
                      setDestinoSeleccionado(destino);
                      setDestinosVisible(false);
                    }}
                  >
                    {destino}
                  </div>
                ))}
              </div>
            )}

            <div className="relative">
              <button
                onClick={() => setShowDatepickerIda(!showDatepickerIda)}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                IDA
              </button>
              {showDatepickerIda && (
                <Datepicker
                  value={dateIda}
                  onChange={setDateIda}
                  primaryColor={"blue"}
                  displayFormat={"DD/MM/YYYY"}
                  containerClassName="absolute z-50 mt-2 bg-white shadow-lg rounded-lg p-4"
                  inputClassName="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-500"
                  showShortcuts={true}
                />
              )}
              <span>{dateIda.startDate ? dateIda.startDate : ''}</span>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowDatepickerVuelta(!showDatepickerVuelta)}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                VUELTA
              </button>
              {showDatepickerVuelta && (
                <Datepicker
                  value={dateVuelta}
                  onChange={setDateVuelta}
                  primaryColor={"blue"}
                  displayFormat={"DD/MM/YYYY"}
                  containerClassName="absolute z-50 mt-2 bg-white shadow-lg rounded-lg p-4"
                  inputClassName="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-500"
                  showShortcuts={true}
                />
              )}

              <span>{dateVuelta.startDate ? dateVuelta.startDate : ''}</span>

              <button
                onClick={() => setMostrarPasajeros(!mostrarPasajeros)}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Pasajeros: {pasajeros}
              </button>
              {mostrarPasajeros && (
                <div className="absolute bg-white shadow-lg rounded mt-2 p-4">
                  <h3>Selecciona la cantidad de huéspedes (1 - 10):</h3>
                  {[...Array(10)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setPasajeros(index + 1);
                        setMostrarPasajeros(false);
                      }}
                      className={`block w-full text-left p-2 ${pasajeros === index + 1 ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              )}
              <button className="bg-blue-500 text-white px-4 py-2 rounded">Buscar</button>
            </div>
          </div>
        </div>
      </main>

      {/*
      <section className="p-6">
        <h2 className="font-roboto text-[40px] text-black font-bold mb-4">Destinos populares</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
          {/* Mostrar 8 cards, incluso si son repetidas }
          {[...Array(1)].map((_, index) => (
            <div key={index} className="border border-[#5FA77780] rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105">
              {/* Usar imágenes repetidas }
              <Image
                src={index % 2 === 0 ? imagedestino1 : imagedestino2}
                alt={`Destino ${index + 1}`}
                className="object-cover w-full h-auto"
              />
              <div className="bg-gray-100 p-6">
                <p className="font-roboto text-[20px] text-black ml-5 font-bold">San Carlos de Bariloche</p>
                <p className="font-roboto text-[16px] text-black ml-5">5 Huéspedes</p>
                <p className="font-roboto text-[14px] text-black ml-5">4 Camas</p>
                <p className="font-roboto text-[16px] ml-5 font-bold">
                  <span className="text-[#5FA777]">$25</span>
                  <span className="text-black">/noche</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
      */}

      {/* <section className="p-6">
        <h2 className="font-roboto text-[40px] text-black mb-4 font-bold">
          Encuentra los mejores alojamientos en los destinos más buscados
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
          {[...Array(6)].map((_, index) => <HomeCard id={index} />)}
        </div>
      </section>
      <section className="p-6">
        <h2 className="text-xl font-semibold mb-4">Preguntas frecuentes</h2>
      </section>
      <footer className="bg-gray-800 text-white w-full h-24 rounded-lg">
        <Image
          src={imagefooter}
          alt="Footer"
          className="w-full h-full object-cover"
        />
      </footer>  */}

    </>
  );
};

export default App;
