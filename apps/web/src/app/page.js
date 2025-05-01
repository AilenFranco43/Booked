'use client'

import { useEffect, useMemo } from 'react'
import { GridProperties } from '../components/GridProperties'
import { useProperties } from '../hooks/useProperties'
import { Banner } from '../ui/Banner'
import { Spinner } from '../ui/Spinner'
import marDePlataImage from './public/mardelplata.png'
import saltaImage from './public/salta.png'
import mendozaImage from './public/mendoza.png'
import buenoAiresImage from './public/buenosaires.png'
import Image from 'next/image'

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

  useEffect(() => {
    getProperties()
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

        <div className='px-8 max-w-[1400px] m-auto'>
          <h2 className="font-roboto text-3xl text-slate-700 font-bold py-14">Destinos populares</h2>

          {(properties.length > 0 && !isLoading) && <GridProperties properties={properties} />}
          {isLoading && <Spinner />}
        </div>
      </section>

      <section className='px-8 max-w-[1400px] mx-auto'>
        <h2 className="font-roboto text-3xl text-slate-700 font-bold py-14">
          Encontra los mejores alojamientos en los destinos más buscados
        </h2>

        <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
          {destinationsWithCount?.map((place, index) => (
            <div 
              key={index} 
              className="border-x border-b border-slate-700 rounded-2xl overflow-hidden shadow-lg transition-transform transform hover:scale-105 hover:cursor-pointer w-80 relative"
            >
              <Image
                src={place.href}
                width={500}
                height={500}
                alt={`Destino ${place.title}`}
                className="object-cover h-96"
              />
              <div className='p-4 absolute bottom-0 text-slate-50'>
                <h3 className="text-2xl font-bold">{place.title}</h3>
                <strong>{place.subTitle}</strong>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className='px-8 max-w-[1400px] m-auto'>
        <h2 className="font-roboto text-3xl text-slate-700 font-bold py-14">Preguntas frecuentes</h2>

        <div className='grid grid-cols-2 gap-4 max-w-[1000px] m-auto'>
          {
            Array(4).fill(null).map((_, index) => (
              <div key={index} className='flex gap-4 justify-between items-center bg-slate-100 border border-slate-200 shadow-md p-4 rounded-2xl'>
                <p>¿Puedo reservar sin registrarme?</p>

                <svg width="25" height="25" viewBox="0 0 37 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="18.5" cy="19" r="18.5" fill="#111111" />
                  <path d="M24.5647 14.6371L18.3854 20.6705L12.3385 14.5043L10.4402 16.3618L18.3444 24.4396L26.4222 16.5354L24.5647 14.6371Z" fill="#F9F9F9" />
                </svg>

              </div>
            ))
          }
        </div>
      </section>
    </div>
  )
}

export default Page