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
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      setProperties(data)
      return data
    } catch (err) {
      console.error("Error in getUserProperties:", err)
      setError(err.message)
      setProperties([])
      throw err
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
  



  return {
    getProperties,
    getUserProperties,
    deleteProperty,
    properties,
    isLoading,
    error
  }
}