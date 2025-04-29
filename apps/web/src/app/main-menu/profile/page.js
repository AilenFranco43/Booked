"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useBoundStore } from "@/store/bound.store";
import { getToken } from "../../api/token";
import { ImageUploader } from "@/components/ImageUploader";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  handleImageUpload,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Title } from "@/components/title-menu";
import userImage from "@/app/public/Perfil.png";
import { useState } from "react";

// Validación con Zod
const formSchema = z.object({
  name: z
    .string()
    .min(5, {
      message: "El nombre y apellido debe tener más de 5 caracteres.",
    })
    .max(50),
  email: z.string().email({ message: "Debe ser un email válido." }),
  birthDate: z
    .string()
    .min(1, { message: "La fecha de nacimiento es obligatoria." }),
  nationality: z
    .string()
    .min(1, { message: "La nacionalidad es obligatoria." }),
  avatar: z.string().optional(),
});

export default function Profile() {
  const [avatarUrl, setAvatarUrl] = useState(userImage.src); // Imagen por defecto
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = useBoundStore((state) => state.user);
  const userId = user?.id || user?._id;
  const token = getToken();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      birthDate: new Date().toISOString().split("T")[0],
      email: "",
      nationality: "",
      avatar: "",
    },
  });

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (file) {
      const url = await handleImageUpload(file);
      if (url) {
        form.setValue("avatar", url);
        setAvatarUrl(url);
      }
    }
  }

  async function onSubmit(values) {
    setIsSubmitting(true);
    try {
      console.log("Valores enviados al backend:", values);

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/patch/${userId}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Usuario actualizado:", response.data);
    } catch (error) {
      console.error("Error actualizando usuario:", error);
      if (error.response?.data) {
        console.error(
          "🛑 Detalles del error del backend:",
          error.response.data
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full">
      <Title
        title="Mi Perfil"
        description="Completa o edita tu información personal"
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 bg-color_form_background rounded-md p-5"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre Completo</FormLabel>
                <FormControl>
                  <Input
                    className="bg-white"
                    placeholder="Nombres y Apellido"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Ingresa tu nombre tal como figura en el documento de
                  identidad.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de nacimiento</FormLabel>
                <FormControl>
                  <Input className="bg-white" type="date" {...field} />
                </FormControl>
                <FormDescription>
                  La fecha de nacimiento es usada para comprobar tu edad.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    className="bg-white"
                    type="email"
                    placeholder="Ingresa tu email"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Este es tu email predeterminado.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nationality"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nacionalidad</FormLabel>
                <FormControl>
                  <Input
                    className="bg-white"
                    placeholder="Ingrese su nacionalidad"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Escribe tu nacionalidad actual.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="avatar"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Foto de perfil</FormLabel>
                <FormDescription>
                  Sube una imagen JPEG/PNG (máx. 2MB)
                </FormDescription>
                <FormControl>
                  <ImageUploader
                    value={field.value}
                    onChange={field.onChange}
                    mode="profile"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end w-full">
            <Button
              className="bg-[#318F51] text-white mt-5"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Actualizando..." : "Actualizar"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
