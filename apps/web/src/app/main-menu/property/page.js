'use client'
import { Title } from "@/components/title-menu"
import { Button } from "@/components/ui/button"
import { School } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useProperties } from "@/hooks/useProperties"
import { CardProperty } from "@/components/CardProperty"
import { Spinner } from "@/ui/Spinner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical } from "lucide-react"


export default function Property() {
  const router = useRouter()
  const [show, setShow] = useState(false)
  const { properties, isLoading, error, getUserProperties, deleteProperty } = useProperties()

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching user properties...")
        await getUserProperties()
      } catch (err) {
        console.error("Failed to fetch properties:", err)
      }
    }

    fetchData()
  }, []) // Vacío porque no depende de props/state

  const handleAddProperty = (e) => {
    e.preventDefault()
    setShow(true)
    router.push("register-property")
  }



  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("¿Estás seguro que deseas eliminar esta propiedad?");
    if (!confirmDelete) return;
  
    try {
      await deleteProperty(id);
    } catch (err) {
      console.error("Error al eliminar la propiedad:", err);
    }
  };
  
  

  return (
    <div className="w-full">
      <Title
        title="Mis propiedades"
        description="Agrega, edita o elimina tus publicaciones como anfitrión."
        hidden={show}
      />

      {isLoading ? (
        <div className="w-full flex justify-center items-center h-[600px]">
          <Spinner />
          <p className="ml-2">Cargando propiedades...</p>
        </div>
      ) : error ? (
        <div className="w-[100%] h-[600px] bg-color_form_background flex flex-col items-center justify-center">
          <School size={83} color="#ff6b6b" strokeWidth={1} />
          <p className="text-color_text_second mt-5 mb-10">
            Error al cargar tus propiedades: {error}
          </p>
          <Button
            className="bg-color_form_button text-white"
            onClick={() => getUserProperties()}
          >
            Reintentar
          </Button>
        </div>
      ) : properties && properties.length > 0 ? (
        <div className="w-full p-4">
          <div className="flex justify-end mb-4">
            <Button
              className="bg-color_form_button text-white"
              onClick={handleAddProperty}
            >
              Agregar nueva propiedad
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {properties.map((property) => (
  <div key={property.id} className="relative">
    <CardProperty property={property} />

    <div className="absolute top-2 right-2 z-10">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => handleDelete(property.id)}
            className="text-red-600 hover:bg-red-100"
          >
            Eliminar
          </DropdownMenuItem>
          {/* Más opciones en el futuro */}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
))}


          </div>
        </div>
      ) : (
        <div className="w-[100%] h-[600px] bg-color_form_background flex flex-col items-center justify-center">
          <School size={83} color="#318f51" strokeWidth={1} />
          <p className="text-color_text_second mt-5 mb-10">
            Aún no has publicado ningún inmueble.
          </p>
          <Button
            className="bg-color_form_button text-white"
            onClick={handleAddProperty}
          >
            Agregar nueva
          </Button>
        </div>
      )}
    </div>
  )
}