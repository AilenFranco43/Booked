'use client';
'use client';

import { useEffect, useState, useMemo } from "react";
import { GridProperties } from "../../components/GridProperties";
import { useProperties } from "../../hooks/useProperties";
import { InputSearch } from "../../ui/InputSearch";
import { Spinner } from "../../ui/Spinner";
import { useSearchParams, useRouter } from 'next/navigation';
import { useBoundStore } from "../../store/bound.store";

const INITIAL_FILTERS_VALUES = {
  minPrice: 0,
  peopleQuantity: 1,
  title: ''
};

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { properties, getProperties, isLoading } = useProperties();

  // Convertir searchParams a objeto reactivo
  const params = useMemo(() => {
    return Object.fromEntries(searchParams.entries());
  }, [searchParams]);

  const [filters, setFilters] = useState(INITIAL_FILTERS_VALUES);

  // Efecto para cargar parámetros y propiedades
  useEffect(() => {
    // Actualizar filtros del formulario
    setFilters({
      minPrice: params.minPrice || INITIAL_FILTERS_VALUES.minPrice,
      peopleQuantity: params.peopleQuantity || INITIAL_FILTERS_VALUES.peopleQuantity,
      title: params.title || INITIAL_FILTERS_VALUES.title
    });

    // Obtener propiedades con todos los parámetros
    fetchProperties();
  }, [params]); // ¡Ahora depende de params!

  const fetchProperties = async () => {
    await getProperties({
      address: params.address,  // Asegúrate de incluir address
      startDate: params.startDate,
      endDate: params.endDate,
      minPrice: params.minPrice,
      peopleQuantity: params.peopleQuantity,
      title: params.title
    });
  };

  const handleClickFilter = async () => {
    const queryParams = new URLSearchParams();
    
    // Agregar filtros del formulario
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value.toString().trim() !== '') {
        queryParams.set(key, value.toString().toLowerCase());
      }
    });

    // Mantener los parámetros de búsqueda (address, fechas) si existen
    if (params.address) queryParams.set('address', params.address);
    if (params.startDate) queryParams.set('startDate', params.startDate);
    if (params.endDate) queryParams.set('endDate', params.endDate);

    router.push(`/property?${queryParams.toString()}`);
  };

  const handleClickRemoveFilters = async () => {
    // Mantener solo los parámetros de búsqueda
    const queryParams = new URLSearchParams();
    if (params.address) queryParams.set('address', params.address);
    if (params.startDate) queryParams.set('startDate', params.startDate);
    if (params.endDate) queryParams.set('endDate', params.endDate);

    setFilters(INITIAL_FILTERS_VALUES);
    router.push(queryParams.toString() ? `/property?${queryParams.toString()}` : '/property');
  };

  // Debug: Mostramos los parámetros actuales
  console.log('Current params:', params);
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
            value={filters. title ?? ''}
            onChange={data => setFilters(prev => ({ ...prev, title: data?.target?.value }))}
          />
        </div>


        <div className="space-y-2">
          <label htmlFor="peopleQuantity">Cantidad de personas: {filters.peopleQuantity}</label>
          <input
            className="w-full accent-[#318F51]"
            type="range"
            name="peopleQuantity"
            min={1}
            max={20}
            value={filters.peopleQuantity ?? 1}
            onChange={(e) => setFilters(prev => ({
              ...prev,
              peopleQuantity: Number(e.target.value)
            }))}
          />
        </div>

       <div className="space-y-2">
  <label htmlFor="price">Precio Mínimo: ${filters.minPrice || 0}</label>
  <input
    className="w-full accent-[#318F51]"
    type="range"
    name="minPrice"
    min={0}
    max={2000000}
    value={filters.minPrice || 0}
    onChange={(e) => setFilters(prev => ({
      ...prev,
      minPrice: Number(e.target.value)
    }))}
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

        {isLoading ? (
          <Spinner />
        ) : properties.length > 0 ? (
          <GridProperties properties={properties} />
        ) : (
          <div className="text-center py-10 w-full">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {params.address ? (
                `No se encontraron propiedades en ${params.address}`
              ) : (
                "No hay propiedades disponibles"
              )}
            </h3>
            <p className="text-gray-500 mb-4">
              Prueba ajustando tus filtros de búsqueda
            </p>
            
          </div>
        )}
      </div>
    </section>
  )
}

export default Page;
