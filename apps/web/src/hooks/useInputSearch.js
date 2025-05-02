'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"

import { getFormatedDate } from '../utils/getFormatedDate'
import { useBoundStore } from '../store/bound.store'

export const useInputSearch = () => {
  const filters = useBoundStore(state => state.filters)
  const setDestinationState = useBoundStore(state => state.setDestinationState)
  const setFilters = useBoundStore(state => state.setFilters)
  const isDestinationOpen = useBoundStore(state => state.isDestinationOpen)

  const router = useRouter()

  const handleClickSetDestination = (destination) => {

    const startDate = new Date(filters.startDate)
    const endDate = new Date(filters.endDate)

    if (!startDate || !endDate) return

    setFilters({ destination })
    setDestinationState(false)
  }

  // const redirectToPage = () => {

  //   const startDate = getFormatedDate(filters?.startDate)
  //   const endDate = getFormatedDate(filters?.endDate)

  //   if (!startDate || !endDate) return

  //   const start = new Date(startDate);
  //   const end = new Date(endDate);

  //   if (end <= start) return

  //   const queryParams = {
  //     address: filters?.destination,
  //     startDate,
  //     endDate,
  //   }

  //   const queryString = new URLSearchParams(queryParams).toString()
  //   router.push(`/property?${queryString}`);
  // };



  const redirectToPage = () => {
    const startDate = getFormatedDate(filters?.startDate);
    const endDate = getFormatedDate(filters?.endDate);
  
    if (!startDate || !endDate) return;
  
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    if (end <= start) return;
  
    router.push(`/property?${new URLSearchParams({
      address: filters?.destination?.toLowerCase(),
      // startDate,
      // endDate
    }).toString()}`);
  };



  const handleClickSetDate = (dates) => {
    const startDate = getFormatedDate(dates?.startDate)
    const endDate = getFormatedDate(dates?.endDate)

    setFilters({ startDate, endDate })
  }

  return {
    redirectToPage,
    handleClickSetDate,
    handleClickSetDestination,
    searchValues: filters,
    isDestinationsOpen: isDestinationOpen,
    setIsDestinationsOpen: setDestinationState
  }
}
