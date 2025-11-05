"use client";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";
import { newReview } from "@/app/api/callApi";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation"; 


const RatingForm = ({ propertyId, onSuccess }) => {
   const router = useRouter();
  const { user: currentUser } = useAuth();
  const form = useForm({
    defaultValues: {
      comment: "",
    },
  });

  const [selectedRating, setSelectedRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data) => {
    if (!currentUser?.id) {
      toast.error("Debes iniciar sesión para enviar una valoración");
      return;
    }

    if (selectedRating === 0) {
      toast.error("Por favor selecciona una calificación");
      return;
    }

    setIsSubmitting(true);

    try {
      const reviewData = {
        property: propertyId,
        guest: currentUser.id,
        rating: selectedRating,
        comment: data.comment,
      };

      const result = await newReview(reviewData);
      if (result.type === "success") {
        toast.success(result.message);
        form.reset();
        setSelectedRating(0);
        onSuccess?.();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error.response?.data?.message || "Hubo un error al enviar tu valoración"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="p-4 bg-white rounded shadow text-center">
        <p className="text-gray-600 mb-4">
          Debes iniciar sesión para dejar una valoración
        </p>
        <Button 
          onClick={() => router.push('/auth/login')} 
          className="bg-[#318F51] hover:bg-[#5FA77C]"
        >
          Iniciar sesión
        </Button>
      </div>
    );
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 p-4 bg-white rounded shadow"
      >
        <div className="space-y-1">
          <FormLabel>Agregar Valoración a esta propiedad</FormLabel>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`cursor-pointer text-2xl ${star <= selectedRating ? "text-yellow-400" : "text-gray-300"}`}
                onClick={() => setSelectedRating(star)}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        <FormField
          control={form.control}
          name="comment"
          rules={{ required: "El comentario es obligatorio" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comentario</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Escribe tu opinión..."
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : "Enviar valoración"}
        </Button>
      </form>
    </Form>
  );
};

export default RatingForm;
