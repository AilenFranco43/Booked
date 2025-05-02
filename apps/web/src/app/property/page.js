'use client';

import { useEffect, useState } from "react"
import { GridProperties } from "../../components/GridProperties"
import { useProperties } from "../../hooks/useProperties"
import { InputSearch } from "../../ui/InputSearch"
import { Spinner } from "../../ui/Spinner"

import { useRouter } from 'next/navigation';
import { useBoundStore } from "../../store/bound.store";

const INITIAL_FILTERS_VALUES = {
  minPrice: 0,
  peopleQuantity: 1,
  title: ''
}
const Page = () => {
  const { properties, getProperties, isLoading } = useProperties()

  const router = useRouter()
  const searchParams = new URLSearchParams(window?.location?.search)

  const [filters, setFilters] = useState(INITIAL_FILTERS_VALUES)

  useEffect(() => {
    getPropertiesWithCurrentParams()
    loadFilteredQueryParams()
  }, [])

  const getPropertiesWithCurrentParams = async () => {
    const searchParamsToObject = Object.fromEntries(searchParams.entries());

    await getProperties({
      // minPrice: searchParamsToObject.minPrice,
      title: searchParamsToObject?.title
    })
  }

  const loadFilteredQueryParams = () => {
    const minPrice = searchParams.get('minPrice')
    const peopleQuantity = searchParams.get('peopleQuantity')
    const title = searchParams.get('title')

    const destination = searchParams.get('destination')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    setFilters(prev => ({ ...prev, minPrice, peopleQuantity, title }))
  }

  const handleClickFilter = async () => {
    let params = {}

    if (filters) {
      Object.keys(filters).forEach(key => {
        if (typeof filters[key] === 'string' && filters[key].trim() === '') {
          searchParams.delete(key)
          return
        }

        if (filters[key] !== null) params[key] = filters[key]

      });
    }

    if (params) addQueryAndReload(params)
    await getPropertiesWithCurrentParams()
  }

  const handleClickRemoveFilters = async () => {

    Object.entries(filters).map(([key]) => {
      searchParams.delete(key)
    })

    setFilters(INITIAL_FILTERS_VALUES)

    router.push(`?${searchParams.toString()}`);
    await getPropertiesWithCurrentParams()
  }

  const addQueryAndReload = (queryParams) => {
    for (const param in queryParams) {
      searchParams.set(param, queryParams[param]);
    }

    router.push(`?${searchParams.toString()}`);
  };

  const {
    minPrice,
    peopleQuantity,
    title
  } = filters

  return (
    <section className="flex gap-20 p-8">
      <div className="flex flex-col gap-4 bg-[#5FA77C82] px-6  w-[340px] py-3 rounded-2xl h-fit">
        <h2 className="text-xl font-semibold text-slate-950">Filtros</h2>

        <div className="space-y-2">
          <label htmlFor="title">Nombre</label>
          <input
            className="rounded-md outline-none px-2 shadow-sm border border-slate-200 w-full"
            type="text"
            name="title"
            value={title ?? ''}
            onChange={data => setFilters(prev => ({ ...prev, title: data?.target?.value }))}
          />
        </div>


        <div className="space-y-2">
          <label htmlFor="peopleQuantity">Cantidad de personas: {peopleQuantity}</label>
          <input
            className="w-full accent-[#318F51]"
            type="range"
            name="peopleQuantity"
            min={1}
            max={20}
            value={peopleQuantity ?? 0}
            onChange={data => setFilters(prev => ({ ...prev, peopleQuantity: data?.target?.value }))}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="price">Precio Mínimo: ${minPrice ?? 0}</label>

          <input
            className="w-full accent-[#318F51]"
            type="range"
            name="minPrice"
            min={0}
            max={2000000}
            value={minPrice ?? 0}
            onChange={data => setFilters(prev => ({ ...prev, minPrice: data?.target?.value }))}
          />
        </div>

        <button
          onClick={handleClickFilter}
          className="bg-[#5FA77C82] py-1 rounded-2xl w-fit px-8 font-semibold text-slate-100 shadow-sm border border-slate-200 hover:cursor-pointer hover:bg-[#5FA77C82]/70 m-auto"
        >
          Filtrar
        </button>

        {/* Remove filters */}
        <button
          onClick={handleClickRemoveFilters}
          className="bg-[#5FA77C82] py-1 rounded-2xl w-fit px-2 font-semibold text-slate-100 shadow-sm border border-slate-200 hover:cursor-pointer hover:bg-[#5FA77C82]/70 m-auto"
        >
          Limpiar filtros
        </button>
      </div>

      <div className="flex flex-col gap-10 justify-center items-center w-full h-full">
        <InputSearch />

        {(properties.length > 0 && !isLoading) && <GridProperties properties={properties} />}
        {isLoading && <Spinner />}
      </div>
    </section>
  )
}

export default Page;
