'use client'

import { useEffect, useState, useRef } from "react";
import { useProperties } from "../hooks/useProperties";

export const Dropdown = ({ 
  isOpen, 
  toggleIsOpen, 
  destination, 
  setDestination 
}) => {
  const [cities, setCities] = useState([]);
  const [groupedCities, setGroupedCities] = useState({});
  const { getUniqueCities, isLoading } = useProperties();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchAndGroupCities = async () => {
      try {
        const uniqueCities = await getUniqueCities();
        setCities(uniqueCities);
        
        const grouped = {};
        uniqueCities.forEach(city => {
          const group = 'Destinos disponibles';
          if (!grouped[group]) {
            grouped[group] = [];
          }
          grouped[group].push(city);
        });
        
        setGroupedCities(grouped);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };
    
    fetchAndGroupCities();
  }, []);

  const handleCitySelect = (city) => {
    setDestination(city);
    // Cerramos el dropdown después de seleccionar
    toggleIsOpen(false); 
  };

  return (
    <div className="relative flex-1 rounded-full px-4 h-full z-10">
      {/* Trigger */}
      <div
        onClick={() => toggleIsOpen(!isOpen)}
        className="flex flex-col justify-center items-start h-full hover:cursor-pointer hover:bg-slate-200/50"
      >
        <h3 className="text-slate-800 font-semibold">Dónde</h3>
        <div className="text-slate-500">
          {destination || 'Explora destinos'}
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div 
          ref={dropdownRef}
          className="absolute w-[300px] p-4 border border-slate-200 shadow-2xl bottom-[-134px] left-0 bg-white rounded-2xl z-50"
        >
          {isLoading ? (
            <div className="p-2">Cargando destinos...</div>
          ) : cities.length === 0 ? (
            <div className="p-2">No hay destinos disponibles</div>
          ) : (
            Object.entries(groupedCities).map(([region, cities]) => (
              <div key={region}>
                <h4 className="text-slate-700 font-bold mb-2">{region}</h4>
                {cities.map((city, idx) => (
                  <div
                    key={idx}
                    className="hover:bg-slate-200/50 hover:cursor-pointer p-2 rounded-2xl"
                    onClick={() => handleCitySelect(city)}
                  >
                    {city}
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};