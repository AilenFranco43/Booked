'use client'

import { useEffect, useState } from "react"
import { CardProperty } from "@/components/CardProperty"
import { useProperties } from "../../hooks/useProperties"
import { InputSearch } from "../../ui/InputSearch"
import { Spinner } from "../../ui/Spinner"
import { useSearchParams, useRouter } from 'next/navigation'
import { FaUsers, FaDollarSign, FaHome, FaTrash, FaFilter, FaSortAmountDown } from "react-icons/fa"
import { Tags } from "lucide-react"



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

  // Estado local para los filtros
  const [filters, setFilters] = useState(INITIAL_FILTERS_VALUES);

  // Obtener propiedades cuando cambien los parámetros de búsqueda
  useEffect(() => {
    const fetchProperties = async () => {
      const queryParams = {
        address: searchParams.get('address') || '',
        startDate: searchParams.get('startDate') || '',
        endDate: searchParams.get('endDate') || '',
        maxPrice: Number(searchParams.get('maxPrice')) || 0,
        min_people: Number(searchParams.get('min_people')) || 1,
        title: searchParams.get('title') || '',
        tags: searchParams.get('tags') ? searchParams.get('tags').split(',') : [],
        sort: searchParams.get('sort') || ''
      };

      // Actualizar filtros locales
      setFilters({
        maxPrice: queryParams.maxPrice,
        min_people: queryParams.min_people,
        title: queryParams.title,
        tags: queryParams.tags,
        sort: queryParams.sort
      });

      // Limpiar parámetros vacíos
      const cleanParams = {};
      Object.keys(queryParams).forEach(key => {
        if (queryParams[key] !== '' && 
            queryParams[key] !== 0 && 
            !(Array.isArray(queryParams[key]) && queryParams[key].length === 0)) {
          cleanParams[key] = queryParams[key];
        }
      });

      // Convertir sort a orderBy si es necesario
      if (cleanParams.sort) {
        cleanParams.orderBy = cleanParams.sort === 'price_asc' ? 'ASC' : 
                           cleanParams.sort === 'price_desc' ? 'DES' : undefined;
        delete cleanParams.sort;
      }

      await getProperties(cleanParams);
    };

    fetchProperties();
  }, [searchParams, getProperties]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleClickFilter = () => {
    const queryParams = new URLSearchParams();

    // Agregar filtros activos
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        queryParams.set(key, value.join(','));
      } else if (value && value.toString().trim() !== '' && value !== INITIAL_FILTERS_VALUES[key]) {
        queryParams.set(key, value.toString());
      }
    });

    // Mantener parámetros de búsqueda básicos
    ['address', 'startDate', 'endDate'].forEach(param => {
      if (searchParams.get(param)) queryParams.set(param, searchParams.get(param));
    });

    router.push(`/property?${queryParams.toString()}`);
  };

  const handleClickRemoveFilters = () => {
    const queryParams = new URLSearchParams();
    ['address', 'startDate', 'endDate'].forEach(param => {
      if (searchParams.get(param)) queryParams.set(param, searchParams.get(param));
    });

    router.push(queryParams.toString() ? `/property?${queryParams.toString()}` : '/property');
  };

  return (

    
    <section className="flex flex-col md:flex-row gap-8 p-4 md:p-8">
      {/* Panel de filtros */}
      <div className="flex flex-col gap-6 bg-[#f1f5f9] px-6 py-5 w-full md:w-[340px] rounded-2xl shadow-md h-fit">
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

      {/* Listado de propiedades */}
      <div className="flex flex-col gap-6 w-full">
        <InputSearch />

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner />
          </div>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {properties.map((property) => (
              <CardProperty 
                key={property._id || property.id} 
                property={property} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 w-full">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {searchParams.get('address') ? `No se encontraron propiedades en ${searchParams.get('address')}` : "No hay propiedades disponibles"}
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