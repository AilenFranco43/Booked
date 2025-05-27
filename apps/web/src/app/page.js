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
  // {
  //   question: "¿Qué métodos de pago aceptan?",
  //   answer: "Aceptamos todas las tarjetas de crédito y débito principales, además de transferencias bancarias y Mercado Pago."
  // },
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
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex justify-between items-center w-full text-left font-medium text-lg text-gray-800 hover:text-blue-600 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        {isOpen ? <FaChevronUp className="text-blue-500" /> : <FaChevronDown className="text-blue-500" />}
      </button>
      {isOpen && (
        <div className="mt-2 text-gray-600">
          <p>{answer}</p>
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
       
        <div className='px-8 max-w-[1400px] m-auto'>
          <h2 className="font-roboto text-3xl text-slate-700 font-bold py-14">Destinos populares</h2>
          {(properties.length > 0 && !isLoading) && <GridProperties properties={properties} />}
          {isLoading && <Spinner />}
        </div>
      </section>

      <section className='px-8 max-w-[1400px] m-auto'>
        <h2 className="font-roboto text-3xl text-slate-700 font-bold py-14">Preguntas frecuentes</h2>

        <div className="bg-white rounded-xl shadow-md p-8 max-w-4xl mx-auto">
          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <FaqItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
          
          <div className="mt-12 bg-blue-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">¿No encontraste lo que buscabas?</h3>
            <p className="text-gray-700 mb-4">Nuestro equipo de atención al cliente está disponible para ayudarte.</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200">
              Contactar soporte
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Page