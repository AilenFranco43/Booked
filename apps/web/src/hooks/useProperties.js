'use client'

import { useState } from "react"
const API = process.env.NEXT_PUBLIC_API_URL;

export const useProperties = () => {
  const [properties, setProperties] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const getProperties = async (inputQueryParams = {}) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const queryParams = new URLSearchParams()
      
      Object.entries(inputQueryParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString())
        }
      })

      const token = localStorage.getItem('token')
      const response = await fetch(`${API}/property?${queryParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      setProperties(data)
      return data
    } catch (err) {
      setError(err.message)
      setProperties([])
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const getUserProperties = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('No authentication token found')
      
      const response = await fetch(`${API}/property/user/properties`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
  
      console.log("Response status:", response.status)
      
      //  si es 404, devuelve lista vacía
      if (response.status === 404) {
        setProperties([])  // El usuario simplemente no tiene propiedades
        return []
      }
  
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
  
      const data = await response.json()
      setProperties(data || [])
      return data
    } catch (err) {
      console.error("Error in getUserProperties:", err)
      setError(err.message)
      setProperties([])  // Asegura que el componente no se rompa
      // ⚠️ NO hace falta `throw err` si ya estás manejando el error en el componente
    } finally {
      setIsLoading(false)
    }
  }
  
  const deleteProperty = async (propertyId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API}/property/delete/${propertyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
  
      // Actualiza la lista de propiedades después de eliminar
      await getUserProperties();
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getPropertyById = async (id) => {
    try {
      const response = await fetch(`${API}/property/${id}`)

      if (!response.ok || response.status !== 200) throw new Error(`Error ${response.status}: ${response.statusText}`)

      const propertyData = await response.json()
      return propertyData
    } catch (error) {
      throw error
    }
  }

// useProperties hook
const getUniqueCities = async () => {
  setIsLoading(true);
  setError(null);
  
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API}/property/cities/unique`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    setError(err.message);
    throw err;
  } finally {
    setIsLoading(false);
  }
}


  return {
    getUniqueCities,
    getProperties,
    getUserProperties,
    deleteProperty,
    getPropertyById,
    properties,
    isLoading,
    error
  }
}