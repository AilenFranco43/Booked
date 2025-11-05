'use client'
import { useState, useCallback } from "react";
const API = process.env.NEXT_PUBLIC_API_URL;


// Función para normalizar propiedades
const normalizeProperty = (property) => ({
  _id: property._id || property.id,
  id: property.id || property._id,
  title: property.title || 'Sin título',
  description: property.description || '',
  price: Number(property.price) || 0,
  photos: Array.isArray(property.photos) ? property.photos : [],
  tags: Array.isArray(property.tags) ? property.tags : [],
  max_people: Number(property.max_people) || 1,
  averageRating: property.averageRating !== undefined ? Number(property.averageRating) : 0,
  reviewCount: property.reviewCount !== undefined ? Number(property.reviewCount) : 0,
  location: property.location || '',
  address: property.address || '',
  
});

export const useProperties = () => {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getProperties = useCallback(async (inputQueryParams = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      const params = { ...inputQueryParams };

      if (params.orderBy && !params.sortByRating) {
        params.sortByRating = params.orderBy === "ASC" ? "asc" : "desc";
        delete params.orderBy;
      }

      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, value.toString());
        }
      });

      const token = localStorage.getItem("token");
      const response = await fetch(`${API}/property?${queryParams.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

      const data = await response.json();

      const normalizedProperties = Array.isArray(data)
        ? data.map(normalizeProperty)
        : [normalizeProperty(data)];

      setProperties(normalizedProperties);
      return normalizedProperties;
    } catch (err) {
      setError(err.message);
      setProperties([]);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []); // ✅ No depende de nada externo

  const getUserProperties = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const response = await fetch(`${API}/property/user/properties`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 404) {
        setProperties([]);
        return [];
      }

      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

      const data = await response.json();
      setProperties(data || []);
      return data;
    } catch (err) {
      console.error("Error in getUserProperties:", err);
      setError(err.message);
      setProperties([]);
    } finally {
      setIsLoading(false);
    }
  }, []); // ✅ idem

  const deleteProperty = useCallback(async (propertyId) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API}/property/delete/${propertyId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

      await getUserProperties();
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [getUserProperties]); // ✅ depende de la función anterior

  const getPropertyById = useCallback(async (id) => {
    try {
      const response = await fetch(`${API}/property/${id}`);
      if (!response.ok || response.status !== 200)
        throw new Error(`Error ${response.status}: ${response.statusText}`);

      const propertyData = await response.json();
      return propertyData;
    } catch (error) {
      throw error;
    }
  }, []);

  const getUniqueCities = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API}/property/cities/unique`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    getUniqueCities,
    getProperties,
    getUserProperties,
    deleteProperty,
    getPropertyById,
    properties,
    isLoading,
    error,
  };
};
