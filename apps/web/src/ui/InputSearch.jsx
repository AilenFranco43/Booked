'use client'

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Dropdown } from '../components/Dropdown';
import { SearchIcon } from './icons/SearchIcon';
import { useInputSearch } from '../hooks/useInputSearch';

export const InputSearch = () => {
  const {
    redirectToPage,
    handleClickSetDate,
    handleClickSetDestination,
    searchValues,
    isDestinationsOpen,
    setIsDestinationsOpen
  } = useInputSearch();

  const [dateRange, setDateRange] = useState({
    startDate: searchValues?.startDate || null,
    endDate: searchValues?.endDate || null
  });

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setDateRange({
      startDate: start,
      endDate: end
    });
    handleClickSetDate({ startDate: start, endDate: end });
  };

  return (
    <div className="flex justify-between items-center gap-2 bg-slate-50 w-[600px] h-[90px] rounded-full px-8 shadow-2xl border border-slate-900 text-center">
      {/* Dropdown */}
      <Dropdown
        setDestination={handleClickSetDestination}
        toggleIsOpen={(state) => setIsDestinationsOpen(state)}
        destination={searchValues?.destination}
        isOpen={isDestinationsOpen}
      />
      
      <div className='bg-slate-400 h-10 w-[2px] rounded-full' />

      {/* Datepicker */}
      <div className="flex flex-col justify-center text-start hover:cursor-pointer hover:bg-slate-200/50 rounded-full px-4 h-full ml-auto">
        <h3 className="text-slate-800 font-semibold">Desde - Hasta</h3>
        <DatePicker
          selectsRange
          startDate={dateRange.startDate}
          endDate={dateRange.endDate}
          onChange={handleDateChange}
          minDate={new Date()}
          placeholderText="Agregar fechas"
          className="text-slate-500 bg-transparent placeholder:text-slate-500 outline-none hover:cursor-pointer w-full"
          dateFormat="dd/MM/yyyy"
          isClearable
          monthsShown={2}
          shouldCloseOnSelect={false}
          withPortal
        />
      </div>

      {/* Search btn */}
      <button
        onClick={redirectToPage}
        className="flex justify-center items-center size-[75px] rounded-full bg-[#5FA777] shadow-md hover:bg-cyan-900/80 border border-slate-200"
      >
        <SearchIcon />
      </button>
    </div>
  )
}