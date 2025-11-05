"use client";

import { Title } from "@/components/title-menu";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { AlertPopup } from "@/components/Alert";
import { newProperty } from "@/app/api/callApi";
import Autocomplete from "@/components/ui/Autocomplete";
import { ImageUploader } from "@/components/ImageUploader";

const tags = [
  { id: "beachfront", label: "Playa en frente" },
  { id: "wifi", label: "Wifi" },
  { id: "pets allowed", label: "Se permiten mascotas" },
  { id: "pool", label: "Piscina" },
  { id: "with furniture", label: "Amueblada" },
  { id: "Smoking is allowed", label: "Se permite fumar" },
  { id: "private parking", label: "Estacionamiento Privado" },
  { id: "workspace", label: "Espacio de trabajo" },
];

const formSchema = z.object({
  title: z.enum(["casa", "departamento", "habitacion"], {
    errorMap: () => ({ message: "Selecciona un tipo de inmueble válido" }),
  }),
  description: z
    .string()
    .min(10, { message: "La descripción debe tener al menos 10 caracteres" }),
  price: z.number().positive("El precio debe ser mayor que 0"),
  max_people: z
    .number()
    .int()
    .positive("El número de personas debe ser mayor que 0"),
  tags: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "Selecciona al menos un ítem",
  }),
  address: z.string(),
  coordinates: z.object({
    latitude: z
      .union([z.number(), z.string().transform((val) => parseFloat(val))])
      .refine((val) => !isNaN(val), {
        message: "Latitud debe ser un número válido",
      }),
    longitude: z
      .union([z.number(), z.string().transform((val) => parseFloat(val))])
      .refine((val) => !isNaN(val), {
        message: "Longitud debe ser un número válido",
      }),
  }),
  photos: z.array(z.string().url()).min(1, "Debes subir al menos una foto"),
});

export default function RegisterProperty() {
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",

      price: 0,
      max_people: 1,
      tags: ["wifi"],
      address: "",
      coordinates: { latitude: 0, longitude: 0 },
      photos: [],
    },
  });

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const dataToSend = {
        ...values,
        price: Number(values.price),
        max_people: Number(values.max_people),
        coordinates: {
          latitude: Number(values.coordinates.latitude),
          longitude: Number(values.coordinates.longitude),
        },
      };

      const response = await newProperty(dataToSend);

      if (response.type === "success") {
        // Resetear el formulario completamente
        form.reset({
          title: "",
          description: "",
          price: 0,
          max_people: 1,
          tags: ["wifi"],
          address: "",
          coordinates: { latitude: 0, longitude: 0 },
          photos: []
        });
      }

      setAlert(response);
    } catch (error) {
      setAlert({
        show: true,
        message: "Error al comunicarse con el servidor",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelect = (location) => {
    const latitud = location.latitud;
    const longitud = location.longitud;

    if (latitud && longitud) {
      form.setValue("coordinates", { latitude: latitud, longitude: longitud });
    }

    form.setValue(
      "address",
      `${location.calle}, ${location.ciudad || "Ciudad no disponible"}, ${location.provincia || "Provincia no disponible"}, ${location.pais}`
    );
  };

  return (
    <div className="mx-auto">
      <Title
        title="Agregar nueva propiedad"
        description="Agrega, edita o elimina tus publicaciones."
      />
      {alert.show && <AlertPopup message={alert.message} type={alert.type} />}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-1 bg-color_form_background rounded-md p-5"
        >
          {/* Tipo de Inmueble */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de inmueble</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Elegir" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="casa">Casa</SelectItem>
                    <SelectItem value="departamento">Departamento</SelectItem>
                    <SelectItem value="habitacion">Habitación</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Descripción */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ingrese una breve descripción de la propiedad"
                    className="bg-white"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Breve descripción que capte la atención.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Precio */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio</FormLabel>
                <FormControl>
                  <Input
                    className="bg-white"
                    type="text"
                    pattern="\d*"
                    placeholder="Ingrese el precio del alquiler"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseFloat(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormDescription>Precio del alquiler por día</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Personas */}
          <FormField
            control={form.control}
            name="max_people"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Personas</FormLabel>
                <FormControl>
                  <Input
                    className="bg-white"
                    type="text"
                    pattern="^[1-9][0-9]{0,2}$"
                    placeholder="Ingrese las personas admitidas"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value, 10) || 1)
                    }
                  />
                </FormControl>
                <FormDescription>
                  Personas que entran en el alquiler
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Tags */}
          <FormField
            control={form.control}
            name="tags"
            render={() => (
              <FormItem>
                <FormLabel>Detalles</FormLabel>
                <FormDescription>
                  Selecciona uno o varios ítems que detallen tu propiedad.
                </FormDescription>
                <div className="flex flex-row flex-wrap">
                  {tags.map((tag) => (
                    <FormField
                      key={tag.id}
                      control={form.control}
                      name="tags"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 m-1">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(tag.id)}
                              onCheckedChange={(checked) =>
                                checked
                                  ? field.onChange([...field.value, tag.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== tag.id
                                      )
                                    )
                              }
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {tag.label}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Dirección (Autocompletado) */}
          <FormField
            control={form.control}
            name="address"
            render={() => (
              <FormItem>
                <FormLabel>Dirección (autocompletado)</FormLabel>
                <FormControl>
                  <Autocomplete onSelect={handleSelect} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Sección para subir fotos de la propiedad */}
          <FormField
            control={form.control}
            name="photos"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fotos de la propiedad</FormLabel>
                <FormDescription>
                  Sube hasta 5 imágenes (JPEG/PNG, máx. 5MB cada una)
                </FormDescription>
                <FormControl>
                  <ImageUploader
                    value={field.value}
                    onChange={field.onChange}
                    mode="multiple"
                    maxFiles={5}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Botón de enviar */}
          <div className="flex justify-end w-[90%]">
            <Button
              className="bg-color_form_button text-white mt-5"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registrando..." : "Registrar propiedad"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}