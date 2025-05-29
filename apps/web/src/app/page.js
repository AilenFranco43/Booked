'use client'

import { useEffect, useMemo, useState } from 'react'
import { GridProperties } from '../components/GridProperties'
import { useProperties } from '../hooks/useProperties'
import { Banner } from '../ui/Banner'
import { Spinner } from '../ui/Spinner'
import marDePlataImage from './public/mardelplata.png'
import saltaImage from './public/salta.png'
import mendozaImage from './public/mendoza.png'
import buenoAiresImage from './public/buenosaires.png'
import Image from 'next/image'
// import { FaStar } from 'react-icons/fa'; 
import {FaChevronDown, FaChevronUp } from 'react-icons/fa'


const TOP_SEARCH = [
  {
    title: 'Buenos Aires',
    href: buenoAiresImage,
  },
  {
    title: 'Mar del Plata',
    href: marDePlataImage,
  },
  {
    title: 'Salta',
    href: saltaImage,
  },
  {
    title: 'Mendoza',
    href: mendozaImage,
  }
]
const FAQS = [
  {
    question: "¿Puedo reservar sin registrarme?",
    answer: "No, es necesario crear una cuenta para realizar reservas. El registro es rápido y gratuito, y te permite gestionar tus reservas fácilmente."
  },
  {
    question: "¿Cuál es la política de cancelación?",
    answer: "La política de cancelación varía según cada propiedad. Puedes consultar los términos específicos en la página de cada alojamiento antes de reservar."
  },
  {
    question: "¿Cómo puedo contactar al anfitrión?",
    answer: "Una vez realizada la reserva, tendrás acceso a los datos de contacto del anfitrión a través de tu panel de usuario."
  },
  {
    question: "¿Hay cargos adicionales?",
    answer: "Todos los cargos deben estar especificados en el detalle de la reserva. Algunas propiedades pueden requerir un depósito de seguridad que será reembolsable."
  },
  {
    question: "¿Puedo modificar mi reserva?",
    answer: "Las modificaciones dependen de la disponibilidad y la política de la propiedad. Puedes solicitar cambios contactando al anfitrión directamente."
  }
]
const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={`border-b border-gray-100 py-5 transition-all duration-200 ${isOpen ? 'bg-gray-50 rounded-lg px-4 -mx-4' : ''}`}>
      <button
        className="flex justify-between items-center w-full text-left font-medium text-lg text-gray-800 hover:text-[#5FA777] focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-left pr-4">{question}</span>
        {isOpen ? (
          <FaChevronUp className="text-[#5FA777] shrink-0 ml-2" />
        ) : (
          <FaChevronDown className="text-gray-500 shrink-0 ml-2" />
        )}
      </button>
      {isOpen && (
        <div className="mt-3 text-gray-600 pl-2 animate-fadeIn">
          <p className="leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  )
}


const extractCityFromAddress = (address) => {
  if (!address) return 'Ciudad no disponible'
  

  const parts = address.split(',')
  if (parts.length >= 2) {
    return parts[parts.length - 2].trim()
  }
  return 'Ciudad no disponible'
}

const Page = () => {
  const { getProperties, isLoading, properties } = useProperties()
  const [topRatedProperties, setTopRatedProperties] = useState([])

  useEffect(() => {
    // Obtener solo 4 propiedades mejor calificadas
    getProperties({ 
      sortByRating: 'desc',
      limit: 4
    })
  }, [])

  const destinationsWithCount = useMemo(() => {
    const countByCity = {}
    
    // Contar propiedades por ciudad (extraída de address)
    properties.forEach(property => {
      const city = extractCityFromAddress(property.address)

      
      // Normalizamos el nombre para que coincida con TOP_SEARCH
      const normalizedCity = city.includes('Buenos Aires') ? 'Buenos Aires' : city
      countByCity[normalizedCity] = (countByCity[normalizedCity] || 0) + 1
    })

    // resultados
    return TOP_SEARCH.filter(place => {
      const count = countByCity[place.title] || 0
      return count > 0
    }).map(place => ({
      ...place,
      subTitle: `${countByCity[place.title] || 0} Alojamiento${countByCity[place.title] !== 1 ? 's' : ''}`
    }))
  }, [properties])
  return (
    <div className='space-y-20'>
      <section>
        <Banner />
      </section>

      <section className='px-8 max-w-[1400px] m-auto'>
       
        <div className='px-2 max-w-[1400px] m-auto'>
          <h2 className="font-roboto text-3xl text-slate-700 font-bold py-4">Destinos populares</h2>
          {(properties.length > 0 && !isLoading) && <GridProperties properties={properties} />}
          {isLoading && <Spinner />}
        </div>
      </section>

       <section className='px-4 sm:px-8 max-w-[1400px] mx-auto'>
        <div className="text-center mb-12">
          <h2 className="font-bold text-3xl md:text-4xl text-gray-800 mb-4">Preguntas Frecuentes</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Encuentra respuestas a las dudas más comunes sobre nuestros servicios
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
          <div className="p-6 md:p-8 space-y-4">
            {FAQS.map((faq, index) => (
              <FaqItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
          
          <div className="bg-[#f7faf7] border-t border-gray-100 p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">¿Necesitas más ayuda?</h3>
                <p className="text-gray-600">Estamos aquí para responder cualquier pregunta que tengas.</p>
              </div>
              <button className="bg-[#5FA777] hover:bg-[#4a8a5f] text-white font-medium py-3 px-6 rounded-lg transition duration-200 whitespace-nowrap">
                Contactar al soporte
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Page