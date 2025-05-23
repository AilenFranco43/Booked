'use client';

import { useEffect, useState, useMemo } from "react";
import { GridProperties } from "../../components/GridProperties";
import { useProperties } from "../../hooks/useProperties";
import { InputSearch } from "../../ui/InputSearch";
import { Spinner } from "../../ui/Spinner";
import { useSearchParams, useRouter } from 'next/navigation';
import { FaUsers, FaDollarSign, FaHome, FaTrash, FaFilter, FaSortAmountDown } from "react-icons/fa";
import { Tags } from "lucide-react";

const INITIAL_FILTERS_VALUES = {
  maxPrice: 0,
  min_people: 1,
  title: '',
  tags: [],
  sort: ''
};

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { properties, getProperties, isLoading } = useProperties();

  // Convertir searchParams a objeto y sincronizar con estado local
  const params = useMemo(() => {
    const paramsObj = Object.fromEntries(searchParams.entries());
    return {
      ...paramsObj,
      maxPrice: Number(paramsObj.maxPrice) || INITIAL_FILTERS_VALUES.maxPrice,
      min_people: Number(paramsObj.min_people) || INITIAL_FILTERS_VALUES.min_people,
      title: paramsObj.title || INITIAL_FILTERS_VALUES.title,
      tags: paramsObj.tags ? paramsObj.tags.split(',') : INITIAL_FILTERS_VALUES.tags,
      sort: paramsObj.sort || INITIAL_FILTERS_VALUES.sort,
      address: paramsObj.address || '',
      startDate: paramsObj.startDate || '',
      endDate: paramsObj.endDate || ''
    };
  }, [searchParams]);

  // Estado local sincronizado con los parámetros de la URL
  const [filters, setFilters] = useState(params);

  // Actualizar propiedades cuando cambien los parámetros
  useEffect(() => {
    const fetchProperties = async () => {
      const apiParams = {
        ...params,
        orderBy: params.sort === 'price_asc' ? 'ASC' : 
                params.sort === 'price_desc' ? 'DES' : undefined
      };
      
      // Eliminar campos vacíos o con valores por defecto
      Object.keys(apiParams).forEach(key => {
        if (apiParams[key] === '' || 
            apiParams[key] === 0 || 
            (Array.isArray(apiParams[key]) && apiParams[key].length === 0)) {
          delete apiParams[key];
        }
      });

      await getProperties(apiParams);
    };

    fetchProperties();
  }, [params]); // Depende solo de params

  const handleFilterChange = (name, value) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
  };

  const handleClickFilter = () => {
    const queryParams = new URLSearchParams();

    // Agregar filtros activos
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        if (value.length > 0) queryParams.set(key, value.join(','));
      } else if (value && value.toString().trim() !== '' && 
                value !== INITIAL_FILTERS_VALUES[key]) {
        queryParams.set(key, value.toString());
      }
    });

    // Mantener parámetros de búsqueda básicos
    ['address', 'startDate', 'endDate'].forEach(param => {
      if (params[param]) queryParams.set(param, params[param]);
    });

    router.push(`/property?${queryParams.toString()}`);
  };

  const handleClickRemoveFilters = () => {
    // Mantener solo los parámetros básicos de búsqueda
    const queryParams = new URLSearchParams();
    ['address', 'startDate', 'endDate'].forEach(param => {
      if (params[param]) queryParams.set(param, params[param]);
    });

    router.push(queryParams.toString() ? `/property?${queryParams.toString()}` : '/property');
  };

  return (
    <section className="flex gap-20 p-8">
      <div className="flex flex-col gap-6 bg-[#f1f5f9] px-6 py-5 w-[340px] rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <FaFilter /> Filtros
        </h2>

        {/* Selector de ordenamiento */}
        <div className="space-y-1">
          <label htmlFor="sort" className="font-medium text-slate-800 flex gap-2 items-center">
            <FaSortAmountDown /> Ordenar por
          </label>
          <select
            name="sort"
            value={filters.sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            className="rounded-lg px-3 py-1.5 w-full border border-slate-300 focus:ring-2 focus:ring-green-500 outline-none"
          >
            <option value="">Predeterminado</option>
            <option value="price_asc">Precio: Menor a Mayor</option>
            <option value="price_desc">Precio: Mayor a Menor</option>
          </select>
        </div>

        {/* Tipo de propiedad */}
        <div className="space-y-1">
          <label htmlFor="title" className="font-medium text-slate-800 flex gap-2 items-center">
            <FaHome /> Tipo de propiedad
          </label>
          <select
            name="title"
            value={filters.title}
            onChange={(e) => handleFilterChange('title', e.target.value)}
            className="rounded-lg px-3 py-1.5 w-full border border-slate-300 focus:ring-2 focus:ring-green-500 outline-none"
          >
            <option value="">Todas</option>
            <option value="casa">Casa</option>
            <option value="departamento">Departamento</option>
          </select>
        </div>

        {/* Cantidad de personas */}
        <div className="space-y-1">
          <label htmlFor="min_people" className="font-medium text-slate-800 flex gap-2 items-center">
            <FaUsers /> Máximo de personas: <span className="ml-auto font-bold text-green-700">{filters.min_people}</span>
          </label>
          <input
            className="w-full accent-green-600"
            type="range"
            min={1}
            max={20}
            value={filters.min_people}
            onChange={(e) => handleFilterChange('min_people', Number(e.target.value))}
          />
        </div>

        {/* Precio máximo */}
        <div className="space-y-1">
          <label htmlFor="maxPrice" className="font-medium text-slate-800 flex gap-2 items-center">
            <FaDollarSign /> Precio máx. por noche
          </label>
          <select
            className="rounded-lg px-3 py-1.5 w-full border border-slate-300 focus:ring-2 focus:ring-green-500 outline-none"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value))}
          >
            <option value={0}>Sin límite</option>
            <option value={50000}>Hasta $50.000</option>
            <option value={100000}>Hasta $100.000</option>
            <option value={200000}>Hasta $200.000</option>
            <option value={500000}>Hasta $500.000</option>
            <option value={1000000}>Hasta $1.000.000</option>
          </select>
        </div>

        {/* Etiquetas */}
        <div className="space-y-1">
          <label className="font-medium text-slate-800 flex gap-2 items-center">
            <Tags size={18} /> Etiquetas
          </label>
          <div className="flex flex-wrap gap-2">
            {['wifi', 'pileta', 'pet-friendly', 'aire-acondicionado', 'estacionamiento'].map(tag => (
              <label key={tag} className="flex items-center gap-2 text-sm bg-white px-3 py-1.5 rounded-lg border border-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.tags.includes(tag)}
                  onChange={(e) => {
                    const updatedTags = e.target.checked
                      ? [...filters.tags, tag]
                      : filters.tags.filter(t => t !== tag);
                    handleFilterChange('tags', updatedTags);
                  }}
                />
                {tag}
              </label>
            ))}
          </div>
        </div>

        {/* Botones */}
        <div className="flex flex-col gap-2 mt-4">
          <button
            onClick={handleClickFilter}
            className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition-colors"
          >
            Aplicar filtros
          </button>
          <button
            onClick={handleClickRemoveFilters}
            className="text-red-500 hover:underline flex justify-center items-center gap-2"
          >
            <FaTrash /> Limpiar filtros
          </button>
        </div>
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
              {params.address ? `No se encontraron propiedades en ${params.address}` : "No hay propiedades disponibles"}
            </h3>
            <p className="text-gray-500 mb-4">
              Prueba ajustando tus filtros de búsqueda
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Page;